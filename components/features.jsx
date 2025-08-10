import { Card, CardContent } from "@/components/ui/card"
import { Brain, PieChart, Bell, Target, TrendingUp, Shield } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description:
      "Our AI analyzes your spending patterns and gives you personalized recommendations that actually make sense.",
    color: "text-purple-400",
  },
  {
    icon: PieChart,
    title: "Smart Categorization",
    description:
      "Automatically categorizes transactions with 99% accuracy. No more manual tagging of your coffee addiction.",
    color: "text-blue-400",
  },
  {
    icon: Bell,
    title: "Predictive Alerts",
    description: "Get warned before you overspend, not after. Our AI predicts your future expenses better than you do.",
    color: "text-yellow-400",
  },
  {
    icon: Target,
    title: "Goal Tracking",
    description: "Set financial goals and watch our AI create a personalized roadmap to achieve them faster.",
    color: "text-green-400",
  },
  {
    icon: TrendingUp,
    title: "Investment Insights",
    description: "Discover investment opportunities based on your spending habits and risk tolerance.",
    color: "text-red-400",
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description:
      "Your data is encrypted with military-grade security. We take your privacy as seriously as your money.",
    color: "text-cyan-400",
  },
]

export function Features() {
  return (
    <section className="px-4 py-20 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Features That Actually
            <span className="block text-green-400">Make You Money</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Stop using boring finance apps that feel like homework. Our AI does the heavy lifting so you can focus on
            spending... responsibly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
