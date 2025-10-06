import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Eye, TrendingUp, Shield, Zap, BarChart3, PieChart, ArrowRight } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding & Design */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-pink-400/20 rounded-full blur-lg animate-bounce" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-400/15 rounded-full blur-md animate-pulse" style={{animationDelay: '2s'}} />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl group-hover:bg-white/30 transition-all duration-300">
              <Eye className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold">FinLense</span>
          </Link>
          
          {/* Main Content */}
          <div className="space-y-8 max-w-md">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight">
                Take Control of
                <span className="block bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                  Your Finances
                </span>
              </h1>
              <p className="text-lg text-white/80 leading-relaxed">
                Join thousands of users who have transformed their financial lives with AI-powered insights and smart budgeting.
              </p>
            </div>
            
            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <span className="text-white/90">Real-time expense tracking</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <span className="text-white/90">AI-powered financial insights</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <Shield className="h-5 w-5" />
                </div>
                <span className="text-white/90">Bank-level security</span>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/20">
              <div>
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-white/70 text-sm">Active Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold">$2M+</div>
                <div className="text-white/70 text-sm">Money Managed</div>
              </div>
            </div>
          </div>
          
          {/* Bottom Quote */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <p className="text-white/90 italic mb-3">
              "FinLense helped me save $5,000 in my first year. The insights are incredible!"
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                SC
              </div>
              <div>
                <div className="text-white font-medium text-sm">Sarah Chen</div>
                <div className="text-white/60 text-xs">Product Manager, Tech Corp</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Sign In Form */}
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
              Welcome back
            </h2>
            <p className="text-muted-foreground">
              Sign in to your account to continue your financial journey
            </p>
          </div>
          
          {/* Clerk Sign In Component */}
       
            <SignIn 
              path="/sign-in"
              signUpUrl="/sign-up"
              forceRedirectUrl="/dashboard"
              fallbackRedirectUrl="/dashboard"
            />
       
          
          {/* Bottom Links */}
          <div className="text-center space-y-4">
            <div className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/sign-up" className="text-primary hover:text-primary/80 font-medium">
                Sign up for free
              </Link>
            </div>
            <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}