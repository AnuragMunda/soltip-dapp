'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { WalletButton } from '@/components/solana/solana-provider'
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { checkProfile } from '@/lib/utils'
import { useSoltipProgram } from './soltip/soltip-data-access'
import Image from 'next/image'

export function AppHeader({ links = [] }: { links: { label: string; path: string }[] }) {
  const pathname = usePathname()
  const [showMenu, setShowMenu] = useState(false)
  const [hasProfile, setHasProfile] = useState(false)
  const { publicKey } = useWallet()
  const { connection } = useConnection()
  const { programId } = useSoltipProgram()

  function isActive(path: string) {
    return path === '/' ? pathname === '/' : pathname.startsWith(path)
  }

  useEffect(() => {
    const hasProfileHandler = async () => {
      if (publicKey) {
        const profile = await checkProfile(programId, publicKey, connection)
        setHasProfile(profile)
      }
    }

    hasProfileHandler()
  }, [publicKey])

  return (
    <header className="w-full max-w-screen dark:text-neutral-400 fixed md:flex md:justify-center md:mt-3">
      <div className={`${pathname.startsWith('/profile') ? 'bg-white/90 border border-black' : 'bg-white/60'} md:w-[60%] mx-5 mt-2 px-5 py-2 md:py-3 rounded-2xl flex items-center justify-between`}>
        {/* Logo */}
        <div>
          <Link href="/" className='cursor-pointer'>
            <Image src='/soltip-logo.png' alt='SolTip Logo' width={100} height={60} />
          </Link>
        </div>

        {/* Navigation */}
        <div className="md:flex items-baseline justify-center hidden">
          <div className="hidden md:flex items-center">
            <ul className="flex gap-4 md:gap-10 flex-nowrap items-center text-xl tracking-wider font-bold">
              {links.map(({ label, path }) => (
                label !== 'Profile' ? (
                  <li key={path}>
                    <Link
                      className={`hover:text-neutral-500 dark:hover:text-white ${isActive(path) ? 'text-neutral-500 dark:text-white' : ''}`}
                      href={path}
                      scroll={true}
                    >
                      {label}
                    </Link>
                  </li>
                ) : (
                  publicKey && hasProfile && (
                    <Link
                      className={`hover:text-neutral-500 dark:hover:text-white ${isActive(`/profile/${publicKey}`) ? 'text-neutral-500 dark:text-white' : ''}`}
                      href={`/profile/${publicKey}`}
                      key={`/profile/${publicKey}`}
                      scroll={true}
                    >
                      {label}
                    </Link>
                  )
                )
              ))}
            </ul>
          </div>
        </div>

        {/* Wallet and mobile menu */}
        <div className='flex gap-4'>
          <div className="flex items-center gap-4">
            <WalletButton />
          </div>

          <Button variant="ghost" size="icon" className="md:hidden ml-2" onClick={() => setShowMenu(!showMenu)}>
            {showMenu ? <X height={20} width={20} /> : <Menu height={20} width={200} className='w-full' />}
          </Button>
        </div>

        {showMenu && (
          <div className="md:hidden fixed top-18 left-5 rounded-2xl w-[88%] bg-neutral-100/95 backdrop-blur-sm">
            <div className="flex flex-col p-8 gap-4">
              <ul className="flex flex-col items-center gap-4">
                {links.map(({ label, path }) => (
                  label !== 'Profile' ? (
                    <li key={path}>
                    <Link
                      className={`hover:text-neutral-500 text-xl font-bold py-2  ${isActive(path) ? 'text-neutral-500' : ''} `}
                      href={path}
                      onClick={() => setShowMenu(false)}
                    >
                      {label}
                    </Link>
                  </li>
                  ) : (
                    publicKey && hasProfile && (
                      <li key={path}>
                    <Link
                      className={`hover:text-neutral-500 text-xl font-bold py-2  ${isActive(path) ? 'text-neutral-500' : ''} `}
                      href={path}
                      onClick={() => setShowMenu(false)}
                    >
                      {label}
                    </Link>
                  </li>
                    )
                  ) 
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}