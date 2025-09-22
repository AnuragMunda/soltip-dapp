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
    <div className="min-h-screen flex flex-col items-center gap-10 mt-10">
      <h1 className="text-3xl font-bold tracking-wide">Update your details</h1>
      <Form action={handleUpdateProfile} className="flex flex-col gap-10 h-full w-[50%]">
        <span>
          <Label about="name" className="mb-5 font-semibold tracking-wider text-lg">Full name</Label>
          <Input type="text" id="name" name="name" className="h-12" placeholder={profile.name} />
        </span>
        <span>
          <Label about="email" className="mb-5 font-semibold tracking-wider text-lg">Email</Label>
          <Input type="email" id="email" name="email" className="h-12" placeholder={profile.email} />
        </span>
        <span>
          <Label about="bio" className="mb-5 font-semibold tracking-wider text-lg">What are you creating?</Label>
          <Input type="text" id="bio" name="bio" placeholder={profile.bio} className="h-12" />
        </span>
        <span>
          <Label about="aboutMe" className="mb-5 font-semibold tracking-wider text-lg">About me</Label>
          <textarea className="border-2 w-full h-40 p-2 rounded-xl" id="aboutMe" name="aboutMe" placeholder={profile.aboutMe} />
        </span>
        <Button className="py-6 rounded-full text-md" disabled={updateProfile.isPending}>
          {updateProfile.isPending ? `Processing...` : `Update`}
        </Button>
      </Form>
    </div>
  )
}

export default UpdateProfile