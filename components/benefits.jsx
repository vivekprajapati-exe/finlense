import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, Clock, Brain } from "lucide-react"

export function Benefits() {
  return (
    <section className="px-4 py-20 bg-gradient-to-r from-gray-900/50 to-black/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Why Our Users Love Us
            <span className="block text-blue-400">(And Their Wallets Do Too)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="bg-green-950/30 border-green-800/50 text-center p-8">
            <CardContent className="p-0">
              <DollarSign className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-4xl font-bold text-white mb-2">$2,847</h3>
              <p className="text-green-300 font-semibold mb-2">Average Savings</p>
              <p className="text-gray-300 text-sm">
                Users save an average of $2,847 in their first year. That's a lot of avocado toast.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-blue-950/30 border-blue-800/50 text-center p-8">
            <CardContent className="p-0">
              <Clock className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-4xl font-bold text-white mb-2">5 min</h3>
              <p className="text-blue-300 font-semibold mb-2">Daily Time Spent</p>
              <p className="text-gray-300 text-sm">
                Spend less time managing money, more time making it. Our AI handles the boring stuff.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-950/30 border-purple-800/50 text-center p-8">
            <CardContent className="p-0">
              <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-4xl font-bold text-white mb-2">94%</h3>
              <p className="text-purple-300 font-semibold mb-2">Prediction Accuracy</p>
              <p className="text-gray-300 text-sm">
                Our AI predicts your spending with scary accuracy. It might know you better than you know yourself.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
