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
              <SignUpButton forceRedirectUrl='/dashboard' >
              <Button className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors">
                Sign Up
              </Button>
              </SignUpButton>
            </SignedOut>

            
            <SignedIn>
              <UserButton signInUrl='/dashboard'/>
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
