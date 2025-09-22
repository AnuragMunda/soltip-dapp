'use client'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { ThemeSelect } from '@/components/theme-select'
import { WalletButton } from '@/components/solana/solana-provider'
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { checkProfile } from '@/lib/utils'
import { useSoltipProgram } from './soltip/soltip-data-access'

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
    <header className="relative z-50 px-6 py-5 dark:text-neutral-400">
      <div className="mx-auto flex items-center">
        <div className="flex-1">
          <Link href="/" className='text-2xl font-bold tracking-widest hover:text-neutral-500 dark:hover:text-white'>SOLTIP</Link>
        </div>
        <div className="flex flex-1 items-baseline justify-center gap-4">
          <div className="hidden md:flex items-center">
            <ul className="flex gap-4 flex-nowrap items-center text-xl tracking-wider font-bold">
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

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowMenu(!showMenu)}>
          {showMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        <div className="hidden md:flex items-center gap-4 flex-1 md:justify-end">
          <WalletButton />
          {/* <ClusterUiSelect /> */}
          <ThemeSelect />
        </div>

        {showMenu && (
          <div className="md:hidden fixed inset-x-0 top-[52px] bottom-0 bg-neutral-100/95 dark:bg-neutral-900/95 backdrop-blur-sm">
            <div className="flex flex-col p-4 gap-4 border-t dark:border-neutral-800">
              <ul className="flex flex-col gap-4">
                {links.map(({ label, path }) => (
                  <li key={path}>
                    <Link
                      className={`hover:text-neutral-500 dark:hover:text-white block text-lg py-2  ${isActive(path) ? 'text-neutral-500 dark:text-white' : ''} `}
                      href={path}
                      onClick={() => setShowMenu(false)}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-4">
                <WalletButton />
                {/* <ClusterUiSelect /> */}
                <ThemeSelect />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}