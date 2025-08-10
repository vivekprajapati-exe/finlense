"use client"
import React from 'react'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Eye } from 'lucide-react'
import { Button } from './ui/button'

function Header() {
  return (
    <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-white p-1 rounded">
              <Eye className="h-6 w-6 text-black" />
            </div>
            <span className="text-xl font-bold text-white">FinLense</span>
          </Link>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <SignedOut>
              <div className="flex items-center space-x-2">
                <SignInButton 
                  mode="modal" 
                  forceRedirectUrl="/dashboard"
                  fallbackRedirectUrl="/dashboard"
                >
                  <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-black">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton 
                  mode="modal" 
                  forceRedirectUrl="/dashboard"
                  fallbackRedirectUrl="/dashboard"
                >
                  <Button className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors">
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center space-x-2">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
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
