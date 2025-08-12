import React from 'react'
import Header from "@/components/header";
import Footer from "@/components/footer";

const MainLayout = ({children}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow container mx-auto py-8 px-4">
        {children}
      </div>

    </div>
  )
}

export default MainLayout