import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Check, Sparkles } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: ["Basic expense tracking", "Simple categorization", "Monthly reports", "Mobile app access"],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Smart",
    price: "$9",
    period: "per month",
    description: "AI-powered insights and predictions",
    features: [
      "Everything in Free",
      "AI spending insights",
      "Predictive alerts",
      "Goal tracking",
      "Investment recommendations",
      "Priority support",
    ],
    cta: "Go Smart",
    popular: true,
  },
  {
    name: "Genius",
    price: "$19",
    period: "per month",
    description: "For serious wealth builders",
    features: [
      "Everything in Smart",
      "Advanced AI analysis",
      "Custom financial strategies",
      "Tax optimization tips",
      "Portfolio management",
      "1-on-1 AI coaching",
      "White-glove onboarding",
    ],
    cta: "Become a Genius",
    popular: false,
  },
]

export function Pricing() {
  return (
    <section className="px-4 py-20 bg-gradient-to-r from-black/50 to-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Pricing That Won't
            <span className="block text-green-400">Break Your Budget</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose the plan that fits your financial goals. All plans come with our "you'll-save-more-than-you-spend"
            guarantee.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.popular
                  ? "bg-gradient-to-b from-green-950/50 to-gray-900/50 border-green-500/50 scale-105"
                  : "bg-gray-900/50 border-gray-700"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-500 text-black px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-1">/{plan.period}</span>
                </div>
                <p className="text-gray-300">{plan.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={`w-full ${
                    plan.popular ? "bg-green-600 hover:bg-green-700" : "bg-gray-700 hover:bg-gray-600"
                  } text-white`}
                >
                  <Link href="/signup">{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">
            All plans include a 30-day money-back guarantee.
            <Link href="/contact" className="text-green-400 hover:text-green-300 underline ml-1">
              Questions? We're here to help.
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
