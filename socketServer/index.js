import express from "express";
import dotenv from "dotenv";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "socket.io";
import Vehicle from "./models/vehicle.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
const mongodbUrl = process.env.MONGODB_URL;

const connectDb = async () => {
  try {
    await mongoose.connect(mongodbUrl);
    console.log("✅ DB connected");
  } catch (error) {
    console.error("❌ DB connection error", error);
  }
};

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_BASE_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});


//   partnerId -> socketId
 
const partnerSockets = new Map();

io.on("connection", (socket) => {
  console.log(
    "🟢 Connected:",
    socket.id
  );


    // Partner identifies itself
  
  socket.on(
    "identity",
    async ({
      partnerId,
      vehicleId,
    }) => {
      try {
        console.log(
          `Partner ${partnerId} connected`
        );

        partnerSockets.set(
          partnerId,
          socket.id
        );

        if (vehicleId) {
          socket.join(
            `vehicle:${vehicleId}`
          );

          await Vehicle.findByIdAndUpdate(
            vehicleId,
            {
              isOnline: true,
            }
          );

          console.log(
            `${socket.id} joined vehicle:${vehicleId}`
          );
        }
      } catch (err) {
        console.log(err);
      }
    }
  );

  /**
   * User/Admin joins a vehicle room
   */
  socket.on(
    "join:vehicle",
    (vehicleId) => {
      socket.join(
        `vehicle:${vehicleId}`
      );

      console.log(
        `${socket.id} joined vehicle:${vehicleId}`
      );
    }
  );

  /**
   * User/Admin leaves vehicle room
   */
  socket.on(
    "leave:vehicle",
    (vehicleId) => {
      socket.leave(
        `vehicle:${vehicleId}`
      );

      console.log(
        `${socket.id} left vehicle:${vehicleId}`
      );
    }
  );

  /**
   * Partner sends live location
   */
  socket.on(
    "partner:location",
    async (data) => {
      try {
        const {
          vehicleId,
          latitude,
          longitude,
          speed,
          heading,
        } = data;

        await Vehicle.findByIdAndUpdate(
          vehicleId,
          {
            currentLatitude:
              latitude,
            currentLongitude:
              longitude,
            speed,
            heading,
            lastLocationUpdate:
              new Date(),
          }
        );

        io.to(
          `vehicle:${vehicleId}`
        ).emit(
          "location:update",
          {
            vehicleId,
            latitude,
            longitude,
            speed,
            heading,
          }
        );
      } catch (err) {
        console.error(
          "Location update error:",
          err
        );
      }
    }
  );

  /**
   * Disconnect
   */
  socket.on(
    "disconnect",
    async () => {
      console.log(
        "🔴 Disconnected:",
        socket.id
      );

      try {
        for (const [
          partnerId,
          socketId,
        ] of partnerSockets) {
          if (
            socketId === socket.id
          ) {
            partnerSockets.delete(
              partnerId
            );

            const vehicle =
              await Vehicle.findOne(
                {
                  assignedPartnerId:
                    partnerId,
                }
              );

            if (vehicle) {
              vehicle.isOnline = false;

              await vehicle.save();
            }

            break;
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  );
});

server.listen(port, async () => {
  await connectDb();

  console.log(
    `🚀 Socket server running on port ${port}`
  );
});