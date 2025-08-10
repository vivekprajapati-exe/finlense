import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingDown, Brain, DollarSign, ArrowLeft, Home, Calculator } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border border-gray-700 bg-black backdrop-blur-sm">
        <CardContent className="p-8 md:p-12 text-center">
          {/* Error Code with Icons */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="relative">
              <span className="text-8xl md:text-9xl font-bold text-red-400 opacity-30">4</span>
              <TrendingDown className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-red-400" />
            </div>
            <div className="relative">
              <span className="text-8xl md:text-9xl font-bold text-orange-400 opacity-30">0</span>
              <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-orange-400" />
            </div>
            <div className="relative">
              <span className="text-8xl md:text-9xl font-bold text-green-400 opacity-30">4</span>
              <DollarSign className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-green-400" />
            </div>
          </div>

          {/* Main Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Oops! Your Money Went Missing</h1>

          <div className="space-y-4 mb-8">
            <p className="text-lg text-gray-300 leading-relaxed">
              Our AI is usually great at tracking finances, but apparently it can't track this page.
              <span className="block mt-2 text-sm text-gray-400 italic">
                (Don't worry, your actual money is still safe... we think 🤖)
              </span>
            </p>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mx-auto max-w-md">
              <p className="text-sm text-gray-200 font-medium mb-2">
                💡 <strong>Financial Tip:</strong>
              </p>
              <p className="text-sm text-gray-300">
                Just like this page, some investments disappear without a trace. At least this one didn't cost you
                anything!
              </p>
            </div>
          </div>

          {/* Error Details */}
          <div className="bg-red-950/50 border border-red-800/50 rounded-lg p-4 mb-8 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calculator className="w-4 h-4 text-red-400" />
              <span className="text-sm font-semibold text-red-300">Error Analysis</span>
            </div>
            <div className="text-xs text-red-200 space-y-1">
              <div className="flex justify-between">
                <span>Page Found:</span>
                <span className="font-mono">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span>Expected Value:</span>
                <span className="font-mono">$404.00</span>
              </div>
              <div className="flex justify-between border-t border-red-800/50 pt-1">
                <span>Net Loss:</span>
                <span className="font-mono text-red-400">-$404.00</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Return to Dashboard
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Go Back to Budgeting
              </Link>
            </Button>
          </div>

          {/* Footer Message */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-400">
              If you keep seeing this page, our AI might be having an existential crisis about money.
              <br />
              <Link href="/contact" className="text-green-400 hover:text-green-300 underline">
                Contact support
              </Link>{" "}
              and we'll teach it some financial responsibility.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
