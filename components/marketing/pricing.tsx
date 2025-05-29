import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Sparkles, Crown, Zap } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for casual shoppers",
    features: ["Basic AI recommendations", "10 searches per day", "Price comparison", "Email support"],
    cta: "Get Started",
    popular: false,
    icon: Sparkles,
    gradient: "from-slate-500 to-slate-600",
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "per month",
    description: "For serious shoppers",
    features: [
      "Advanced AI recommendations",
      "Unlimited searches",
      "Price tracking & alerts",
      "Priority support",
      "Exclusive deals",
      "Shopping history analytics",
    ],
    cta: "Start Free Trial",
    popular: true,
    icon: Crown,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For businesses and teams",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "API access",
      "Custom integrations",
      "Dedicated support",
      "Advanced analytics",
    ],
    cta: "Contact Sales",
    popular: false,
    icon: Zap,
    gradient: "from-cyan-500 to-teal-500",
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-gradient-to-r from-sky-500/10 to-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container px-6 mx-auto relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center glass-card px-6 py-3 rounded-full mb-6">
            <Crown className="mr-2 h-4 w-4 text-blue-300" />
            <span className="text-white/90 font-medium">Choose Your Plan</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Simple,
            <span className="text-gradient"> Transparent </span>
            Pricing
          </h2>

          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Start free and upgrade as your shopping needs grow. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`glass-card border-0 bg-transparent relative group transition-all duration-500 hover:-translate-y-2 ${
                plan.popular ? "glow-effect scale-105" : "hover:glow-effect"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center shadow-lg">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Most Popular
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-4 pt-8">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${plan.gradient} p-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <plan.icon className="w-8 h-8 text-white" />
                </div>

                <CardTitle className="text-2xl font-bold text-white mb-2">{plan.name}</CardTitle>

                <div className="mb-4">
                  <span className="text-4xl md:text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/60 ml-2">/{plan.period}</span>
                </div>

                <p className="text-white/70">{plan.description}</p>
              </CardHeader>

              <CardContent className="px-8 pb-8">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mr-3 flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${
                    plan.popular ? "btn-primary" : "btn-glass hover:bg-white/20"
                  }`}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-16">
          <div className="glass-card inline-block px-8 py-4 rounded-2xl">
            <p className="text-white/70">All plans include our 30-day money-back guarantee</p>
          </div>
        </div>
      </div>
    </section>
  )
}
