import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Star, Users } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl" />

        {/* Floating Elements */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="container px-6 mx-auto text-center relative">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="mb-8">
            <div className="inline-flex items-center glass-card px-6 py-3 rounded-full glow-effect">
              <Users className="mr-2 h-4 w-4 text-green-300" />
              <span className="text-white/90 font-medium">Join 500,000+ Happy Shoppers</span>
              <div className="ml-2 flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            Ready to Transform
            <br />
            Your Shopping
            <span className="text-gradient"> Experience?</span>
          </h2>

          {/* Description */}
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Start your journey with ShopAI today and discover a smarter way to shop. No credit card required for your
            free account.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link href="/signup">
              <Button className="btn-primary px-10 py-5 text-xl rounded-full group shadow-2xl">
                Start Shopping for Free
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button className="btn-glass px-10 py-5 text-xl rounded-full group">
                <Sparkles className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
                Watch Demo First
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="glass-card p-8 rounded-3xl max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-white mb-1">Free Forever</div>
                <div className="text-white/60 text-sm">No credit card required</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">Cancel Anytime</div>
                <div className="text-white/60 text-sm">No long-term commitments</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">24/7 Support</div>
                <div className="text-white/60 text-sm">We're here to help</div>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-60">
            {["TechCrunch", "Forbes", "Wired", "The Verge", "Mashable"].map((brand, index) => (
              <div key={index} className="text-white/40 font-semibold text-lg">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
