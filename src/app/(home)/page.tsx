/**
 * @author Anurag Munda
 * @dev This is the Home page for the web app
 */

'use client'

import { AppHeader } from "@/components/app-header";
import { WalletButton } from "@/components/solana/solana-provider";
import { useSoltipProgram } from "@/components/soltip/soltip-data-access";
import { Button } from "@/components/ui/button";
import { checkProfile } from "@/lib/utils";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SiSolana } from "react-icons/si";

export default function Home() {
  const links: { label: string; path: string }[] = [
    // More links...
    { label: 'Home', path: '/' },
    { label: 'Profile', path: `` },
  ]

  const [hasProfile, setHasProfile] = useState(false)
  const [loading, setLoading] = useState(false)
  const { publicKey } = useWallet()
  const { connection } = useConnection()
  const { programId } = useSoltipProgram()

  useEffect(() => {
    const hasProfileHandler = async () => {
      setLoading(true)
      if (publicKey) {
        const profile = await checkProfile(programId, publicKey, connection)
        setHasProfile(profile)
      }

      setLoading(false)
    }
    hasProfileHandler()
  }, [publicKey])

  return (
    <div className="min-h-screen bg-radial from-fuchsia-300 via-purple-400 to-white bg-auto bg-center bg-no-repeat">
      <AppHeader links={links} />

      <div className="h-screen flex items-center justify-center">
        <div className="h-[50%] w-full flex flex-col items-center justify-center gap-10 px-5 text-center">
          {loading ? (
            <SiSolana size={110} className="animate-spin" />
        ) : (
          <>
            <div className="flex flex-col items-center md:max-w-[600px]">
              <h1 className="text-6xl md:text-7xl font-extrabold">Get <span className="bg-black text-white italic px-3 pb-1 rounded-2xl">support</span> for your creative work</h1>
              <h2 className="text-lg border bg-white/20 rounded-xl font-base tracking-wide px-4 py-1 mt-5">Start receiving Solana</h2>
            </div>
            
            {publicKey ? (
              <Link href={hasProfile ? `/profile/${publicKey}` : '/profile/create'}>
                <Button className="text-2xl font-bold border p-8 mt-8 rounded-full bg-linear-to-r from-pink-500 to-violet-500">
                  {hasProfile ? 'Show profile' : 'Create profile'}
                </Button>
              </Link>
            ) : (
              //** Wallet connection button */
              <WalletButton />
            )}
          </>
        )}
        </div>
      </div>
    </div>
  )
}