import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, Shield, Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-20 md:py-32">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 opacity-50" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative max-w-7xl mx-auto text-center">
        {/* AI Badge */}
        <div className="inline-flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-full px-4 py-2 mb-8">
          <Brain className="w-4 h-4 text-green-400" />
          <span className="text-sm text-gray-300">Powered by Advanced AI</span>
          <Sparkles className="w-4 h-4 text-yellow-400" />
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Your Money,
          <span className="block bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Smarter Than Ever
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Let our AI analyze your spending, predict your future, and help you build wealth while you sleep. Because your
          money deserves better than a spreadsheet.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg">
            <Link href="/signup" className="flex items-center gap-2">
              Start Tracking Free
              <TrendingUp className="w-5 h-5" />
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="px-8 py-4 text-lg bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <Link href="/demo">Watch Demo</Link>
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-400" />
            <span>Bank-level Security</span>
          </div>
          <div className="hidden sm:block w-1 h-1 bg-gray-600 rounded-full" />
          <span>No Credit Card Required</span>
          <div className="hidden sm:block w-1 h-1 bg-gray-600 rounded-full" />
          <span>10,000+ Happy Users</span>
        </div>
      </div>
    </section>
  )
}
