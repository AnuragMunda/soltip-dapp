import { toast } from "sonner"
import { Button } from "./ui/button"
import copy from "copy-to-clipboard"
import { Copy, Edit } from "lucide-react"
import { usePathname } from "next/navigation"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import Link from "next/link"
import { parseCoinValue } from "@/lib/utils"
import { Separator } from "./ui/separator"

interface Profile {
    creator: PublicKey | null;
    name: string;
    email: string;
    bio: string;
    aboutMe: string;
    fund: number;
    coinValue: number;
    supporterCount: number;
}

const ProfileOverview = ({ profile }: { profile: Profile }) => {
  const { publicKey } = useWallet();
  const path = usePathname();
  const { creator, name, email, bio, coinValue, supporterCount } = profile;

  return (
    <div className="bg-[#191A1D] h-full text-white md:h-[93%] self-end md:flex-1 flex flex-col gap-6 px-6 py-5 rounded-2xl">
        <div className="flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-bold">Profile</h2>

            {/* Profile functions */}
            <div className="flex gap-3">
                <Button className="bg-linear-to-r from-pink-500 to-violet-500 border"
                    onClick={() => {
                    copy(`${window.location.host}${path}`)
                    toast.success('Link copied')
                }}>
                    <Copy /> Copy
                </Button>

                {publicKey && creator && publicKey.equals(creator) && (
                    <Link href='/profile/update'>
                    <Button className="bg-linear-to-r from-pink-500 to-violet-500 border">
                        <Edit /> Edit
                    </Button>
                    </Link>
                )}
            </div>
        </div>

        <div className='w-full border-b border-white/20' />

        {/* Supporter count */}
        <div className="flex justify-around items-center h-15">
            <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-bold">{supporterCount}</span>
                <span className="text-neutral-400 text-sm">Supporters</span>
            </div>

            <Separator orientation="vertical" className="bg-white/20" />

            <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-bold">{parseCoinValue(coinValue)}</span>
                <span className="text-neutral-400 text-sm">SOL per coin</span>
            </div>
        </div>

        {/* Profile bio */}
        <div className="bg-[#242428] h-50 px-3 py-2 border border-white/20 rounded-xl mb-8">
            <p>{`Hi, my name is ${name}!`}</p>
            <p>{bio}</p>
        </div>
    </div>
  )
}

export default ProfileOverview