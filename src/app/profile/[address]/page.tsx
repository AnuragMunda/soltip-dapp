'use client'

import { useSoltipProgram } from "@/components/soltip/soltip-data-access"
import { useConnection } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { checkProfile } from "@/lib/utils"
import ProfileTabs from "@/components/profile-tabs"
import ProfileOverview from "@/components/profile-overview"
import { SiSolana } from "react-icons/si";

export default function Page() {
  const { getCreatorProfile, programId, program } = useSoltipProgram()
  const params = useParams()
  const router = useRouter()
  const userAddress = params.address
  const { connection } = useConnection()

  const [currentCoinValue, setCurrentCoinValue] = useState('')
  const [coinAmount, setCoinAmount] = useState('')
  const [name, setName] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

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

  const fetchProfile = async () => {
    try {
      if (!userAddress) return
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
      if (!userAddress) return
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

  const setAName = (name: string) => {
    setName(name);
  }

  const setAMessage = (message: string) => {
    setMessage(message);
  }

  const setCoinValue = (value: string) => {
    setCurrentCoinValue(value);
  }

  const setNumberOfCoins = (value: string) => {
    setCoinAmount(value);
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

  if (!userAddress) return <h1>Incorrect address</h1>

  return (
    <section className={`min-h-screen w-full ${loading ? 'bg-radial from-fuchsia-300 via-purple-400 to-white bg-auto' : 'bg-[#F5F5F4]'}`}>
      {loading ? (
        <div className="w-full min-h-screen flex items-center justify-center">
          <SiSolana size={110} className="animate-spin" />
        </div>
      ) : (
        <div className="md:h-screen md:flex md:flex-col md:gap-2">
          <div className="bg-[url('/bg-image-wide.png')] bg-contain md:bg-cover h-72 md:h-40 bg-no-repeat bg-fixed" />

          {/* Main section */}
          <div className="md:h-full px-3 md:px-20 md:flex md:flex-col md:gap-4">
            <h2 className="text-4xl md:text-5xl text-center pt-4 pb-7 font-extrabold bg-linear-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              {profile.name}
            </h2>

            <div className="md:flex h-[80%] md:gap-15">
              {/* Profile Overview */}
              <ProfileOverview profile={profile} />

              {/* Profile Tabs */}
              <div className="my-10 md:my-0 md:flex-1">
                <ProfileTabs 
                profile={profile} 
                supporters={supporters}
                name={name}
                message={message}
                currentCoinValue={currentCoinValue}
                coinAmount={coinAmount}
                fetchProfile={fetchProfile}
                fetchSupporters={fetchSupporters}
                setName={setAName}
                setMessage={setAMessage}
                setCurrentCoinValue={setCoinValue}
                setCoinAmount={setNumberOfCoins}
              />
            </div>
          </div>
          </div>
        </div>
  )}
  </section>
  )
}