import { auth } from "../../../../../../src/auth";
import connectDb from "../../../../../../src/lib/db";
import Booking from "../../../../../../src/models/booking.models";
import Partner from "../../../../../../src/models/partner.models";
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function GET(req: NextRequest,{ params }: { params: Promise<{ bookingId: string }> }){
  try {
    await connectDb();

    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { bookingId } = await params;

    if (!/^[0-9a-fA-F]{24}$/.test(bookingId)) {
      return NextResponse.json(
        { success: false, message: "Invalid booking id" },
        { status: 400 }
      );
    }

    const booking = await Booking.findById(bookingId)
      .populate({ path: "boardStopId", select: "name city" })
      .populate({ path: "alightStopId", select: "name city" })
      .populate({
        path: "tripId",
        select: "departureDateTime arrivalDateTime vehicleId",
        populate: {
          path: "vehicleId",
          select: "vehicleType brand model vehicleNumber",
        },
      })
      .populate({ path: "userId", select: "name email phone" });

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    // ---------------- AUTHORIZATION ----------------

    const sessionUserId = String(session.user.id);
    const sessionRole = String(session.user.role ?? "").toLowerCase();

    const bookingUserId = String(
      (booking.userId as any)?._id ??
        booking.userId ??
        ""
    );

    const isOwner = bookingUserId === sessionUserId;
    const isAdmin = sessionRole === "admin";

    let isAuthorizedPartner = false;

    let partnerDebug: Record<string, unknown> = {
      partnerFound: false,
      assignedVehicleId: "",
      bookingVehicleId: "",
    };

    if (sessionRole === "partner") {
      // auth.ts sets session.user.id to the Partner document's _id.
      const partner = await Partner.findById(sessionUserId)
        .select("_id userId assignedVehicleId")
        .lean();
      const partnerRecord = Array.isArray(partner) ? partner[0] : partner;

      const trip = booking.tripId as any;
      const vehicle = trip?.vehicleId;

      const bookingVehicleId = String(
        vehicle?._id ?? vehicle ?? ""
      );

      const assignedVehicleId = String(
        partnerRecord?.assignedVehicleId ?? ""
      );

      isAuthorizedPartner =
        Boolean(partnerRecord) &&
        Boolean(assignedVehicleId) &&
        Boolean(bookingVehicleId) &&
        assignedVehicleId === bookingVehicleId;

      partnerDebug = {
        partnerFound: Boolean(partnerRecord),
        partnerId: partnerRecord?._id?.toString() ?? "",
        partnerUserId: partnerRecord?.userId?.toString() ?? "",
        assignedVehicleId,
        bookingVehicleId,
      };
    }

    console.log("=== TICKET AUTH DEBUG ===", {
      bookingId,
      sessionUserId,
      sessionRole,
      bookingUserId,
      isOwner,
      isAdmin,
      ...partnerDebug,
      isAuthorizedPartner,
    });

    if (!isOwner && !isAdmin && !isAuthorizedPartner) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    // ---------------- GENERATE PDF ----------------

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([420, 620]);
    const { width } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const primary = rgb(0.11, 0.11, 0.12);
    const muted = rgb(0.45, 0.45, 0.48);
    const success = rgb(0.09, 0.55, 0.29);
    const warning = rgb(0.75, 0.55, 0.05);

    let y = 580;

    const drawText = (
      text: string,
      x: number,
      yPos: number,
      opts: {
        size?: number;
        f?: typeof font;
        color?: ReturnType<typeof rgb>;
      } = {}
    ) => {
      page.drawText(text, {
        x,
        y: yPos,
        size: opts.size ?? 11,
        font: opts.f ?? font,
        color: opts.color ?? primary,
      });
    };

    // Header
    drawText("YatraX", 30, y, { size: 22, f: bold });
    drawText("E-Ticket", width - 100, y + 2, {
      size: 12,
      f: font,
      color: muted,
    });

    y -= 10;

    page.drawLine({
      start: { x: 30, y },
      end: { x: width - 30, y },
      thickness: 1,
      color: rgb(0.85, 0.85, 0.85),
    });

    y -= 35;

    // Vehicle details
    const vehicle: any = (booking.tripId as any)?.vehicleId;

    const vehicleName = vehicle
      ? `${vehicle.brand ?? ""} ${
          vehicle.model ?? vehicle.vehicleType ?? ""
        }`.trim() || "YatraX Vehicle"
      : "YatraX Vehicle";

    drawText(vehicleName, 30, y, { size: 15, f: bold });
    y -= 18;

    if (vehicle?.vehicleNumber) {
      drawText(`Vehicle No: ${vehicle.vehicleNumber}`, 30, y, {
        size: 10,
        color: muted,
      });
      y -= 25;
    } else {
      y -= 10;
    }

    // Route details
    const boardStop = (booking.boardStopId as any)?.name ?? "-";
    const alightStop = (booking.alightStopId as any)?.name ?? "-";

    drawText(`${boardStop}  ->  ${alightStop}`, 30, y, {
      size: 13,
      f: bold,
    });

    y -= 25;

    // Departure details
    const departure = (booking.tripId as any)?.departureDateTime;

    const dateStr = departure
      ? new Date(departure).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "-";

    const timeStr = departure
      ? new Date(departure).toLocaleTimeString("en-IN", {
          hour: "numeric",
          minute: "2-digit",
        })
      : "-";

    drawText(`Date: ${dateStr}`, 30, y, { size: 11 });
    drawText(`Time: ${timeStr}`, 220, y, { size: 11 });

    y -= 25;

    page.drawLine({
      start: { x: 30, y },
      end: { x: width - 30, y },
      thickness: 0.5,
      color: rgb(0.9, 0.9, 0.9),
    });

    y -= 25;

    // Passenger details
    const passengerUser: any = booking.userId;

    drawText("Booked by", 30, y, { size: 9, color: muted });
    y -= 15;

    drawText(passengerUser?.name ?? "-", 30, y, {
      size: 12,
      f: bold,
    });

    y -= 30;

    drawText("Passengers", 30, y, { size: 9, color: muted });
    y -= 15;

    for (const passenger of booking.passengers ?? []) {
      drawText(
        `${passenger.name} (${passenger.age} yrs, ${passenger.gender})`,
        30,
        y,
        { size: 10 }
      );
      y -= 15;
    }

    y -= 10;

    // Booking details
    drawText("Booking ID", 30, y, {
      size: 9,
      color: muted,
    });

    drawText("Seats", 220, y, {
      size: 9,
      color: muted,
    });

    y -= 15;

    drawText(booking._id.toString(), 30, y, {
      size: 10,
      f: bold,
    });

    drawText(`${booking.seatsBooked}`, 220, y, {
      size: 10,
      f: bold,
    });

    y -= 30;

    page.drawLine({
      start: { x: 30, y },
      end: { x: width - 30, y },
      thickness: 0.5,
      color: rgb(0.9, 0.9, 0.9),
    });

    y -= 25;

    // Fare and payment status
    drawText("Total Fare", 30, y, {
      size: 9,
      color: muted,
    });

    y -= 18;

    drawText(`Rs. ${booking.totalFare}`, 30, y, {
      size: 18,
      f: bold,
    });

    const statusColor =
      booking.paymentStatus === "paid" ? success : warning;

    const statusLabel =
      booking.paymentStatus === "paid"
        ? "PAID"
        : String(booking.paymentStatus ?? "pending").toUpperCase();

    drawText(statusLabel, width - 100, y - 5, {
      size: 12,
      f: bold,
      color: statusColor,
    });

    y -= 40;

    drawText(
      `Booking status: ${
        booking.bookingStatus === "cancelled"
          ? "Cancelled"
          : "Confirmed"
      }`,
      30,
      y,
      {
        size: 10,
        color:
          booking.bookingStatus === "cancelled"
            ? warning
            : success,
      }
    );

    y -= 40;

    page.drawLine({
      start: { x: 30, y },
      end: { x: width - 30, y },
      thickness: 1,
      color: rgb(0.85, 0.85, 0.85),
    });

    y -= 20;

    drawText(
      "This is a computer-generated ticket and does not require a signature.",
      30,
      y,
      { size: 8, color: muted }
    );

    y -= 12;

    drawText(
      `Generated on ${new Date().toLocaleString("en-IN")}`,
      30,
      y,
      { size: 8, color: muted }
    );

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="YatraX-Ticket-${booking._id}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Ticket generation error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to generate ticket" },
      { status: 500 }
    );
  }
}
