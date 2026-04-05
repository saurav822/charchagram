'use client'

import { usePathname } from 'next/navigation'
import HeaderTop from './HeaderTop'
import BottomNavigation from './BotoomNavigation'

interface LayoutWrapperProps {
  children: React.ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  
  // Check if the current path contains 'signup' (case insensitive)
  const isSignUpPage = pathname.toLowerCase().includes('login')

  if (isSignUpPage) {
    // For signup pages, render children without header/footer
    return <div className="min-h-screen">{children}</div>
  }

  // For other pages, render with header and footer
  return (
    <>
      <HeaderTop />
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 pb-10">
          {children}
        </main>
        <BottomNavigation />
      </div>
    </>
  )
}