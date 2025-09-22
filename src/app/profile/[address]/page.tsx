'use client'

import { useSoltipProgram } from "@/components/soltip/soltip-data-access"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import { Coins } from "lucide-react"
import Link from "next/link"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import copy from 'copy-to-clipboard'
import { checkProfile } from "@/lib/utils"

export default function Page() {
  const { getCreatorProfile, setCoinValue, withdrawFunds, supportCreator, programId, program } = useSoltipProgram()
  const { publicKey } = useWallet()
  const params = useParams()
  const router = useRouter()
  const userAddress = params.address
  const path = usePathname()
  const { connection } = useConnection()

  if (!userAddress) return <h1>Incorrect address</h1>

  const [coinAmount, setCoinAmount] = useState('')
  const [currentCoinValue, setCurrentCoinValue] = useState('0')
  const [name, setName] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const [profile, setProfile] = useState<{
    creator: PublicKey | null,
    name: string,
    email: string,
    bio: string,
    aboutMe: string,
    fund: number,
    coinValue: number,
    supporterCount: number,
  }>({
    creator: null,
    name: '',
    email: '',
    bio: '',
    aboutMe: '',
    fund: 0,
    coinValue: 0,
    supporterCount: 0,
  })
  const [supporters, setSupporters] = useState<{
    id: number,
    supporter: PublicKey | null,
    name: string,
    tip: number,
    message: string
  }[]>([])

  const calculateSolAmount = (amount: number) => {
    return parseFloat((amount * parseCoinValue(profile.coinValue)).toFixed(4))
  }

  const parseCoinValue = (value: number) => {
    return value / LAMPORTS_PER_SOL
  }

  const fetchProfile = async () => {
    try {
      const _profile = await getCreatorProfile(new PublicKey(userAddress.toString()))
      if (_profile) {
        setProfile({
          ..._profile,
          fund:  +_profile.fund,
          coinValue: +_profile.coinValue,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchSupporters = async () => {
    try {
      const result = await program.account.supporter.all([{ memcmp: { offset: 12, bytes: (new PublicKey(userAddress).toBase58()) } }])
      if (result.length > 0) {
        setSupporters(
          result.map(({ account }) => ({
            id: account.id,
            supporter: account.supporter,
            name: account.name ?? '',
            tip: Number(account.tip),
            message: account.message ?? ''
          }))
        )
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true)
      if (userAddress) {
        const hasProfile = await checkProfile(programId, new PublicKey(userAddress), connection)
        if (hasProfile) {
          fetchProfile()
          fetchSupporters()
        }
        else
          router.replace('/')
      }
      setLoading(false)
    }
    loadProfile()
  }, [userAddress, router])

  return (
    <section className="w-full mt-10">
      {loading ? (
        <h1 className="flex justify-center items-center text-4xl">Loading...</h1>
      ) : (
        <div className="flex justify-center gap-5">
          <div className="border-3 rounded-3xl flex-1 flex flex-col gap-5 px-5 py-7">
            <div className="relative flex flex-col gap-5 pb-5 border-b-2">
              <div className="absolute right-0 self-center flex gap-2">
                <Button onClick={() => {
                  copy(`${window.location.host}${path}`)
                  toast.success('Link copied')
                }}>Copy link</Button>
                {publicKey && profile.creator && publicKey.equals(profile.creator) && (
                  <Link href='/profile/update'>
                    <Button>Edit</Button>
                  </Link>
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <h2 className="text-2xl font-bold tracking-wide">{profile.name}</h2>
                <p className="dark:text-gray-400 text-gray-600 font-semibold text-xl">{profile.bio}</p>
              </div>
              <p className="text-md tracking-wide">{profile.aboutMe}</p>
              <span className="text-sm border px-2 py-3 bg-black text-white dark:text-black rounded-lg w-[50%] text-center font-semibold dark:bg-white">{`Contact: ${profile.email}`}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-6 tracking-wide">Recent Supporters</h2>
              <div className="flex flex-col gap-6">
                {supporters && supporters?.length != 0 ? (
                  <>
                    {supporters
                      .slice()
                      .sort((a, b) => b.id - a.id)
                      .map((supporter) => (
                        <div key={supporter.id} className="flex flex-col gap-3">
                          <span className="flex gap-2 items-center">
                            <Coins />
                            <h3>{`${!supporter.name || supporter.name === '' ? 'Anonymous' : supporter.name} donated ${parseCoinValue(supporter.tip)} SOL`}</h3>
                          </span>
                          {supporter.message && (
                            <p className="bg-[#FFEFEF] rounded-lg text-black px-4 py-3">
                              {supporter.message}
                            </p>
                          )}
                        </div>
                      ))}
                  </>
                ) : (
                  <h1>
                    No supporters.
                  </h1>
                )}

              </div>
            </div>
          </div>
          {publicKey && profile.creator && publicKey.equals(profile.creator) ? (
            <div className="w-full border-3 rounded-3xl flex-1 px-5 py-7 flex flex-col gap-10">
              <h2 className="text-xl font-semibold tracking-wide border-b-2 pb-5">Vault</h2>
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-5 border-b-2 pb-10">
                  <div className="bg-[#FFF7F7] border border-[#FF5F5F] py-5 px-3 rounded-xl dark:text-black">{`Funds available: ${parseCoinValue(profile.fund)} SOL`}</div>
                  <Button className="rounded-full py-6 text-md" disabled={withdrawFunds.isPending}
                    onClick={async () => {
                      if (Number(profile.fund) === 0) {
                        toast.error('No fund available')
                        return
                      }
                      await withdrawFunds.mutateAsync(publicKey)
                      fetchProfile()
                    }}>
                    {withdrawFunds.isPending ? 'Processing...' : 'Withdraw Funds'}
                  </Button>
                </div>
                <div className="flex flex-col gap-5">
                  <div className="bg-[#FFF7F7] border border-[#FF5F5F] py-5 px-3 rounded-xl dark:text-black">{`Current coin value: ${parseCoinValue(profile.coinValue)} SOL`}</div>
                  <Input type="number" className="p-3 h-12" placeholder="Enter coin value" value={currentCoinValue} onChange={(e) => setCurrentCoinValue(e.target.value)} />
                  <Button className="rounded-full py-6 text-md" disabled={setCoinValue.isPending}
                    onClick={async () => {
                      if (parseFloat(currentCoinValue) < 0.0001) {
                        toast.error('Atleast 0.0001 SOL')
                        return
                      }
                      await setCoinValue.mutateAsync({ creator: publicKey, value: parseFloat(currentCoinValue) })
                      setCurrentCoinValue('0')
                      fetchProfile()
                    }}>
                    {setCoinValue.isPending ? 'Processing...' : 'Change coin value'}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full border-3 rounded-3xl flex-1 px-5 py-7">
              <div className="flex flex-col gap-5">
                <h2 className="text-xl font-semibold tracking-wide">{`Support ${profile.name}`}</h2>
                <div className="bg-[#FFF7F7] dark:text-black border border-[#FF5F5F] py-5 px-3 rounded-xl">{`1 Coin = ${parseCoinValue(profile.coinValue)} SOL`}</div>
                <div className="flex flex-col gap-5">
                  <Input
                    type="number"
                    className="p-3 h-12"
                    placeholder="Number of coins to donate"
                    value={coinAmount}
                    onChange={(e) => setCoinAmount(e.target.value)}
                  />
                  <Input className="p-3 h-12" placeholder="Your name" onChange={(e) => setName(e.target.value)} />
                  <textarea className="h-40 border p-2 rounded-xl" placeholder="Say something nice..." onChange={(e) => setMessage(e.target.value)} />
                  <Button className="rounded-full py-6 text-md" disabled={supportCreator.isPending}
                    onClick={async () => {
                      const coin = Number(coinAmount)
                      if (!publicKey) {
                        toast.error('Connect wallet first')
                        return
                      }
                      if (!profile.creator) {
                        toast.error('Invalid profile')
                        return
                      }
                      if (!Number.isInteger(coin) || coin <= 0) {
                        toast.error('Amount must be a positive integer')
                        return
                      }
                      const amount = calculateSolAmount(coin)
                      const supporterName = name.trim() === '' ? null : name.trim()
                      const supporterMsg = message.trim() === '' ? null : message.trim()

                      await supportCreator.mutateAsync({
                        supporter: publicKey,
                        creatorPubKey: profile.creator,
                        amount,
                        name: supporterName,
                        message: supporterMsg
                      })
                      await fetchSupporters()

                      setCoinAmount('')
                      setName('')
                      setMessage('')
                    }}
                  >
                    {supportCreator.isPending ? 'Processing...'
                      : (
                        `Support ${Number(coinAmount) === 0 ? ''
                          : `${calculateSolAmount(parseInt(coinAmount))} SOL`}`
                      )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}