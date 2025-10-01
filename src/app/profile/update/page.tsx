'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-dropdown-menu"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Form from 'next/form'
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletNotConnectedError } from "@solana/wallet-adapter-base"
import { useSoltipProgram } from "@/components/soltip/soltip-data-access"
import { AiOutlineLoading } from "react-icons/ai"

const UpdateProfile = () => {
  const { publicKey } = useWallet()
  const router = useRouter();
  const { updateProfile, getCreatorProfile } = useSoltipProgram()

  const [profile, setProfile] = useState<{
    name: string,
    email: string,
    bio: string,
    aboutMe: string,
  }>({
    name: '',
    email: '',
    bio: '',
    aboutMe: '',
  })

  const handleUpdateProfile = async (formData: FormData) => {
    if (!publicKey) throw new WalletNotConnectedError()
    const name = formData.get("name")?.toString() || null
    const email = formData.get("email")?.toString() || null
    const bio = formData.get("bio")?.toString() || null
    const aboutMe = formData.get("aboutMe")?.toString() || null

    if (name || email || bio || aboutMe) {
      await updateProfile.mutateAsync({ creator: publicKey, name, email, bio, aboutMe })
      router.replace(`/profile/${publicKey}`)
    }
  }

  useEffect(() => {
    if (!publicKey) router.push('/')
  }, [publicKey, router])

  useEffect(() => {
    const fetchProfile = async () => {
      if (publicKey) {
        const _profile = await getCreatorProfile(publicKey)
        if (_profile) {
          setProfile({
            name: _profile.name,
            email: _profile.email,
            bio: _profile.bio,
            aboutMe: _profile.aboutMe
          })
        }
      }
    }
    fetchProfile()
  }, [])

  if (!publicKey) return null

  return (
    <div className="min-h-screen bg-[#F5F5F4] w-full flex flex-col items-center gap-8 mb-10">
      <div className="bg-[url('/bg-update-page.png')] bg-contain md:bg-cover h-72 md:h-40 bg-no-repeat bg-fixed w-full" />
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide py-2 bg-linear-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
        Update your details
      </h1>
      <Form action={handleUpdateProfile} className="bg-[#191A1D] w-[93%] md:w-[60%] text-white flex flex-col gap-7 px-6 md:px-10 py-5 md:py-8 rounded-2xl mx-4">
        <span>
          <Label about="name" className="mb-3 font-semibold tracking-wider text-lg">Full name</Label>
          <Input type="text" id="name" name="name" className="border border-white/30 px-3 h-10 bg-white/5" placeholder={profile.name} />
        </span>
        <span>
          <Label about="email" className="mb-3 font-semibold tracking-wider text-lg">Email</Label>
          <Input type="email" id="email" name="email" className="border border-white/30 px-3 h-10 bg-white/5" placeholder={profile.email} />
        </span>
        <span>
          <Label about="bio" className="mb-3 font-semibold tracking-wider text-lg">What are you creating?</Label>
          <Input type="text" id="bio" name="bio" placeholder={profile.bio} className="border border-white/30 px-3 h-10 bg-white/5" />
        </span>
        <span>
          <Label about="aboutMe" className="mb-3 font-semibold tracking-wider text-lg">About me</Label>
          <textarea className="border border-white/30 w-full h-40 p-2 rounded-xl bg-white/5" id="aboutMe" name="aboutMe" placeholder={profile.aboutMe} />
        </span>
        <Button className="bg-linear-to-l from-pink-500 to-violet-500 rounded-xl border py-5 text-md md:w-[250px] md:self-center" disabled={updateProfile.isPending}>
          {updateProfile.isPending ? <AiOutlineLoading className="animate-spin"/> : `Update`}
        </Button>
      </Form>
    </div>
  )
}

export default UpdateProfile