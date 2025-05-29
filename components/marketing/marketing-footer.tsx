import Link from "next/link"
import { ShoppingBag, Twitter, Github, Linkedin, Mail, Heart } from "lucide-react"

export function MarketingFooter() {
  return (
    <footer className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

      <div className="glass-nav border-t border-white/10 relative">
        <div className="container px-6 py-16 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="space-y-6">
              <Link href="/" className="flex items-center space-x-2">
                <ShoppingBag className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold text-white">ShopAI</span>
              </Link>
              <p className="text-white/70 max-w-xs leading-relaxed">
                Your personal AI shopping assistant that makes finding the perfect products effortless and enjoyable.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: Twitter, href: "#" },
                  { icon: Github, href: "#" },
                  { icon: Linkedin, href: "#" },
                  { icon: Mail, href: "#" },
                ].map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    className="w-10 h-10 glass-card rounded-full flex items-center justify-center text-white/60 hover:text-white hover:glow-effect transition-all duration-300"
                  >
                    <social.icon className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold text-white mb-6 text-lg">Product</h3>
              <ul className="space-y-4">
                {["Features", "Pricing", "Demo", "API"].map((item) => (
                  <li key={item}>
                    <Link href={`#${item.toLowerCase()}`} className="text-white/70 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-white mb-6 text-lg">Company</h3>
              <ul className="space-y-4">
                {["About", "Careers", "Blog", "Contact"].map((item) => (
                  <li key={item}>
                    <Link href={`/${item.toLowerCase()}`} className="text-white/70 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-white mb-6 text-lg">Support</h3>
              <ul className="space-y-4">
                {["Help Center", "Privacy Policy", "Terms of Service", "Status"].map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/10 mt-16 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-white/60 text-center md:text-left">
                © 2024 ShopAI. All rights reserved. Built with <Heart className="inline w-4 h-4 text-red-400 mx-1" />
                for better shopping.
              </p>

              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <span className="text-white/40 text-sm">Powered by AI</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
