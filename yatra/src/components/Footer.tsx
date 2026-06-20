'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { Bus } from 'lucide-react'
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter
} from 'react-icons/fa'

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-blue-500/10 bg-[#030712] text-white">

      {/* Glow Effects */}
      <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-7xl mx-auto px-6 py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/20">
                <Bus className="text-blue-500" size={24} />
              </div>

              <h2 className="text-3xl font-bold">
                <span className="text-white">Yatra</span>
                <span className="text-blue-500">X</span>
              </h2>
            </div>

            <p className="mt-4 text-gray-400 leading-relaxed max-w-md">
              One platform for ticket booking, live vehicle tracking,
              route management, fleet operations and seamless travel
              experiences.
            </p>

            <div className="flex gap-4 mt-6">
              {[FaFacebook, FaInstagram, FaTwitter, FaLinkedin].map(
                (Icon, i) => (
                  <motion.a
                    key={i}
                    whileHover={{ y: -4 }}
                    href="#"
                    className="
                    w-10 h-10
                    flex items-center justify-center
                    rounded-full
                    border border-white/10
                    bg-white/5
                    text-gray-400
                    hover:text-blue-400
                    hover:border-blue-500/40
                    transition-all
                  "
                  >
                    <Icon size={18} />
                  </motion.a>
                )
              )}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-white mb-4">
              Product
            </h3>

            <div className="space-y-3 text-gray-400 text-sm">
              <Link href="/booking" className="block hover:text-blue-400">
                Book Tickets
              </Link>

              <Link href="/track" className="block hover:text-blue-400">
                Track Bus
              </Link>

              <Link href="/routes" className="block hover:text-blue-400">
                Routes
              </Link>

              <Link href="/fleet" className="block hover:text-blue-400">
                Fleet Management
              </Link>

              <Link href="/live-tracking" className="block hover:text-blue-400">
                Live Tracking
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">
              Company
            </h3>

            <div className="space-y-3 text-gray-400 text-sm">
              <Link href="/about" className="block hover:text-blue-400">
                About Us
              </Link>

              <Link href="/careers" className="block hover:text-blue-400">
                Careers
              </Link>

              <Link href="/blog" className="block hover:text-blue-400">
                Blog
              </Link>

              <Link href="/contact" className="block hover:text-blue-400">
                Contact
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white mb-4">
              Support
            </h3>

            <div className="space-y-3 text-gray-400 text-sm">
              <p>+91 98765 43210</p>
              <p>support@yatrax.com</p>
              <p>24/7 Customer Support</p>

              <Link href="/privacy" className="block hover:text-blue-400">
                Privacy Policy
              </Link>

              <Link href="/terms" className="block hover:text-blue-400">
                Terms & Conditions
              </Link>
            </div>
          </div>

        </div>
      </motion.div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 gap-3">
          <p>
            © {new Date().getFullYear()} YatraX. All rights reserved.
          </p>

          <p>
            Built with ❤️ for Smart Transportation
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer