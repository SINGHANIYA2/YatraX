"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  FileCheck,
  Shield,
} from "lucide-react";

export default function PartnerOnboardingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[rgba(53,64,89,0.33)] relative overflow-auto">

      {/* Blue Glow */}
    <div className="min-h-screen bg-secondary relative overflow-auto">
        <div className="absolute inset-0 bg-secondary" />

        <div className="relative z-10 px-4 -mt-13">
            <div className="max-w-2xl mx-auto">
            {/* Card */}
                 <motion.div
                    className="
                    w-full
                    max-w-2xl
                    my-16
                    rounded-3xl
                    bg-card
                    border
                    border-primary/20
                    shadow-sm
                    p-6
                    sm:p-8
                    "
                    >
        
          {/* Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm">
              <BadgeCheck size={16} />
              Partner Program
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mt-6">
            <h1 className="text-4xl font-bold text-foreground">
              Become a YatraX Partner
            </h1>

            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Join YatraX and earn by operating company-owned vehicles.
              Complete verification and get assigned a vehicle by an admin.
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-4 mt-10">

            <motion.div
              whileHover={{ y: -4 }}
              className="
              rounded-2xl
              border
              border-border
              bg-card
              p-5
            "
            >
              <FileCheck className="text-primary" size={24} />

              <h3 className="text-foreground font-semibold mt-4">
                Document Verification
              </h3>

              <p className="text-muted-foreground text-sm mt-2">
                Upload Aadhaar and Driving License.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="
              rounded-2xl
              border
              border-border
              bg-card
              p-5
            "
            >
              <CreditCard className="text-primary" size={24} />

              <h3 className="text-foreground font-semibold mt-4">
                Bank Verification
              </h3>

              <p className="text-muted-foreground text-sm mt-2">
                Add payout account details securely.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="
              rounded-2xl
              border
              border-border
              bg-card
              p-5
            "
            >
              <Shield className="text-primary" size={24} />

              <h3 className="text-foreground font-semibold mt-4">
                Admin Approval
              </h3>

              <p className="text-muted-foreground text-sm mt-2">
                Select your preferred location and admin.
              </p>
            </motion.div>
          </div>

          {/* Required Documents */}
          <div
            className="
            mt-8
            rounded-2xl
            border
            border-primary/20
            bg-primary/5
            p-5
          "
          >
            <h4 className="text-foreground font-semibold">
              Required Documents
            </h4>

            <ul className="mt-4 space-y-2 text-muted-foreground text-sm">
              <li>• Aadhaar Card</li>
              <li>• Driving License</li>
              <li>• Bank Account Details</li>
              <li>• Profile Photo</li>
            </ul>
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              router.push("/partner/onboarding/driver-details")
            }
            className="
            mt-8
            w-full
            h-14
            rounded-2xl
            bg-primary text-primary-foreground hover:bg-primary-hover transition-colors
            font-semibold
            flex
            items-center
            justify-center
            gap-2
            shadow-lg
            shadow-sm
          "
          >
            Start Application
            <ArrowRight size={18} />
          </motion.button>
        </motion.div>
            </div>
        </div>
    </div>
    </div>
  );
}