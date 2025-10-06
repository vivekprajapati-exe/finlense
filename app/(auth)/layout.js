import React from 'react'
import './auth-styles.css'

const AuthLayout = ({children}) => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {children}
    </div>
  )
}

export default AuthLayout
