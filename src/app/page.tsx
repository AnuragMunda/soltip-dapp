'use client'

import { WalletButton } from "@/components/solana/solana-provider";
import { useSoltipProgram } from "@/components/soltip/soltip-data-access";
import { Button } from "@/components/ui/button";
import { checkProfile } from "@/lib/utils";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
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
    <div className="min-h-screen flex flex-col justify-center items-center gap-10">
      {loading ? (
        <h1 className="flex justify-center items-center text-4xl">Loading...</h1>
      ) : (
        <>
          <h1 className="text-6xl font-bold">Fund your creative work</h1>
          <h2 className="text-2xl font-light tracking-wide">Accept support. Start receiving Solana. It&apos;s easier than you think.</h2>
          {publicKey ? (
            <Link href={hasProfile ? `/profile/${publicKey}` : '/profile/create'}>
              <Button className="text-2xl font-bold p-9 rounded-full">
                {hasProfile ? 'Show profile' : 'Create profile'}
              </Button>
            </Link>
          ) : (
            <WalletButton />
          )}
        </>
      )}
    </div>
  )
}