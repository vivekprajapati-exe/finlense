"use client"
import React, { useState } from 'react'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Eye, Menu, X } from 'lucide-react'
import { Button } from './ui/button'
import { ThemeToggle } from './theme-toggle'

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="bg-background border-b border-muted/40 sticky top-0 z-50 backdrop-blur-md bg-background/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="bg-primary p-1.5 rounded-lg">
              <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
            </div>
            <span className="text-lg sm:text-xl font-bold">FinLense</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            
            <SignedOut>
              <div className="flex items-center space-x-2">
                <SignInButton 
                  mode="modal" 
                  fallbackRedirectUrl="/dashboard"
                >
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton 
                  mode="modal" 
                  fallbackRedirectUrl="/dashboard"
                >
                  <Button size="sm">
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

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-muted/40 bg-background/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <SignedOut>
                <div className="flex flex-col space-y-2 p-4">
                  <SignInButton 
                    mode="modal" 
                    fallbackRedirectUrl="/dashboard"
                  >
                    <Button variant="outline" className="w-full justify-center">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton 
                    mode="modal" 
                    fallbackRedirectUrl="/dashboard"
                  >
                    <Button className="w-full justify-center">
                      Sign Up
                    </Button>
                  </SignUpButton>
                </div>
              </SignedOut>

              <SignedIn>
                <div className="flex flex-col space-y-2 p-4">
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">
                      Dashboard
                    </Button>
                  </Link>
                  <div className="flex justify-center pt-2">
                    <UserButton 
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "h-10 w-10"
                        }
                      }}
                    />
                  </div>
                </div>
              </SignedIn>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
