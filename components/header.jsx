"use client"
import React from 'react'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Eye } from 'lucide-react'
import { Button } from './ui/button'
import { ThemeToggle } from './theme-toggle'

function Header() {
  return (
    <header className="bg-background border-b border-muted/40 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary p-1 rounded">
              <Eye className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">FinLense</span>
          </Link>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            <SignedOut>
              <div className="flex items-center space-x-2">
                <SignInButton 
                  mode="modal" 
                  forceRedirectUrl="/dashboard"
                  fallbackRedirectUrl="/dashboard"
                >
                  <Button variant="outline">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton 
                  mode="modal" 
                  forceRedirectUrl="/dashboard"
                  fallbackRedirectUrl="/dashboard"
                >
                  <Button>
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center space-x-2">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8"
                    }
                  }}
                />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
