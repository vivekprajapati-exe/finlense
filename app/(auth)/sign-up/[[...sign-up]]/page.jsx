import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Eye, Sparkles, Target, Gift, CheckCircle, Star, Users, DollarSign } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-row-reverse">
      {/* Right Side - Branding & Design */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        {/* Floating Elements */}
        <div className="absolute top-16 right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-24 left-20 w-28 h-28 bg-emerald-400/20 rounded-full blur-xl animate-bounce" style={{animationDelay: '0.5s'}} />
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-cyan-400/15 rounded-full blur-lg animate-pulse" style={{animationDelay: '1.5s'}} />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group ml-auto">
            <span className="text-2xl font-bold">FinLense</span>
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl group-hover:bg-white/30 transition-all duration-300">
              <Eye className="h-8 w-8 text-white" />
            </div>
          </Link>
          
          {/* Main Content */}
          <div className="space-y-8 max-w-md ml-auto text-right">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight">
                Start Your
                <span className="block bg-gradient-to-r from-green-200 to-blue-200 bg-clip-text text-transparent">
                  Financial Journey
                </span>
              </h1>
              <p className="text-lg text-white/80 leading-relaxed">
                Join our community and unlock powerful tools to build wealth, track expenses, and achieve your financial goals.
              </p>
            </div>
            
            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-center justify-end space-x-3">
                <span className="text-white/90">Free forever plan</span>
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <Gift className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3">
                <span className="text-white/90">AI budget recommendations</span>
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3">
                <span className="text-white/90">Goal tracking & achievements</span>
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <Target className="h-5 w-5" />
                </div>
              </div>
            </div>
            
            {/* Success Metrics */}
            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/20">
              <div className="text-right">
                <div className="text-2xl font-bold">4.9★</div>
                <div className="text-white/70 text-sm">User Rating</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">99%</div>
                <div className="text-white/70 text-sm">Success Rate</div>
              </div>
            </div>
          </div>
          
          {/* Features List */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-white font-semibold mb-4 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              What you'll get for free:
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm text-white/90">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-300 rounded-full" />
                <span>Unlimited transactions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-300 rounded-full" />
                <span>Smart categorization</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-300 rounded-full" />
                <span>Expense analytics</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-300 rounded-full" />
                <span>Budget alerts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Left Side - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <Link href="/" className="inline-flex items-center space-x-2">
              <div className="bg-primary p-2 rounded-lg">
                <Eye className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">FinLense</span>
            </Link>
          </div>
          
          {/* Welcome Text */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Create your account
            </h2>
            <p className="text-muted-foreground">
              Start your financial transformation today - it's completely free
            </p>
          </div>
          
          
          {/* Clerk Sign Up Component */}
          <div className="">
            <SignUp 
              path="/sign-up"
              signInUrl="/sign-in"
              forceRedirectUrl="/dashboard"
              fallbackRedirectUrl="/dashboard"
            />
          </div>
          
          {/* Bottom Links */}
          <div className="text-center space-y-4">
            <div className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-primary hover:text-primary/80 font-medium">
                Sign in here
              </Link>
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:text-primary/80">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:text-primary/80">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}