import { AppFooter } from '@/components/app-footer';
import { AppHeader } from '@/components/app-header';
import React from 'react'

export default function ProfileLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const links: { label: string; path: string }[] = [
    // More links...
    { label: 'Home', path: '/' },
    { label: 'Profile', path: `` },
  ]

  return (
    <>
    <AppHeader links={links} />
      {children}
    </>
  )
}
