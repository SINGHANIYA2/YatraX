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
    <div className="min-h-screen bg-[#020617] relative overflow-auto">

      {/* Blue Glow */}
    <div className="min-h-screen bg-[#020617] relative overflow-auto">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2563eb55,transparent_55%)]" />

        <div className="relative z-10 px-4 -mt-13">
            <div className="max-w-2xl mx-auto">
            {/* Card */}
                 <motion.div
                    className="
                    w-full
                    max-w-2xl
                    my-16
                    rounded-3xl
                    bg-slate-950/70
                    backdrop-blur-xl
                    border
                    border-blue-500/20
                    shadow-[0_0_60px_rgba(37,99,235,0.15)]
                    p-6
                    sm:p-8
                    "
                    >
        
          {/* Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm">
              <BadgeCheck size={16} />
              Partner Program
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mt-6">
            <h1 className="text-4xl font-bold text-white">
              Become a YatraX Partner
            </h1>

            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
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
              border-slate-800
              bg-slate-900/60
              p-5
            "
            >
              <FileCheck className="text-blue-400" size={24} />

              <h3 className="text-white font-semibold mt-4">
                Document Verification
              </h3>

              <p className="text-slate-400 text-sm mt-2">
                Upload Aadhaar and Driving License.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-900/60
              p-5
            "
            >
              <CreditCard className="text-blue-400" size={24} />

              <h3 className="text-white font-semibold mt-4">
                Bank Verification
              </h3>

              <p className="text-slate-400 text-sm mt-2">
                Add payout account details securely.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-900/60
              p-5
            "
            >
              <Shield className="text-blue-400" size={24} />

              <h3 className="text-white font-semibold mt-4">
                Admin Approval
              </h3>

              <p className="text-slate-400 text-sm mt-2">
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
            border-blue-500/20
            bg-blue-500/5
            p-5
          "
          >
            <h4 className="text-white font-semibold">
              Required Documents
            </h4>

            <ul className="mt-4 space-y-2 text-slate-400 text-sm">
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
            bg-gradient-to-r
            from-blue-600
            to-blue-500
            text-white
            font-semibold
            flex
            items-center
            justify-center
            gap-2
            shadow-lg
            shadow-blue-500/20
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