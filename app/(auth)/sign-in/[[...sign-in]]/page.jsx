import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Eye, TrendingUp, Shield, Zap, BarChart3, PieChart, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding & Design */}

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