'use client'

import { AppFooter } from './app-footer'
import { ThemeProvider } from './theme-provider'
import { Toaster } from './ui/sonner'
import React from 'react'

export function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="flex flex-col min-h-screen min-w-screen">
        <main className="flex-grow w-full">
          {children}
        </main>
        <AppFooter />
      </div>
      <Toaster duration={6000} position='top-center' />
    </ThemeProvider>
  )
}