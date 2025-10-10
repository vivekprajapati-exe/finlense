import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Eye, Sparkles, Target, Gift, CheckCircle, Star, Users, DollarSign } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-row-reverse">
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