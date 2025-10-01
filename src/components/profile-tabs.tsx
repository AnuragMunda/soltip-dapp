import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PublicKey } from "@solana/web3.js"
import { useWallet } from "@solana/wallet-adapter-react"
import { calculateSolAmount, parseCoinValue } from "@/lib/utils";
import { Button } from "./ui/button";
import { useSoltipProgram } from "./soltip/soltip-data-access";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { AiOutlineLoading } from 'react-icons/ai'
import { SiSolana } from "react-icons/si";

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

interface Supporter {
    id: number;
    supporter: PublicKey | null;
    name: string;
    tip: number;
    message: string;
};

const ProfileTabs = ({ 
    profile, 
    supporters,
    name,
    message,
    currentCoinValue,
    coinAmount,
    fetchProfile,
    fetchSupporters,
    setName,
    setMessage,
    setCurrentCoinValue,
    setCoinAmount
} : { 
    profile: Profile, 
    supporters: Array<Supporter>,
    name: string,
    message: string,
    currentCoinValue: string,
    coinAmount: string,
    fetchProfile: () => void,
    fetchSupporters: () => void,
    setName: (_name: string) => void,
    setMessage: (_message: string) => void,
    setCurrentCoinValue: (_coinValue: string) => void,
    setCoinAmount: (_coinAmount: string) => void
}) => {
    const { publicKey } = useWallet();
    const { setCoinValue, withdrawFunds, supportCreator } = useSoltipProgram()
    const { creator, aboutMe, coinValue, email } = profile;

    return (
        <div className="h-full">
            <Tabs className="md:h-full" defaultValue="about">
                <TabsList className="bg-linear-to-l from-pink-500 to-violet-500 px-1 py-4">
                    <TabsTrigger className="text-base px-4 py-3" value="about">About</TabsTrigger>
                    <TabsTrigger className="text-base px-4 py-3" value="supporters">Supporters</TabsTrigger>
                    {publicKey && creator && publicKey.equals(creator) ? (
                        <TabsTrigger className="text-base px-4 py-3" value="vault">Vault</TabsTrigger>
                    ) : (
                        <TabsTrigger className="text-base px-4 py-3" value="support">Support</TabsTrigger>
                    )}
                    
                </TabsList>

                {/* About Me */}
                <TabsContent value="about">
                    <Card className="bg-[#191A1D] text-white md:h-full">
                        <CardHeader>
                            <CardTitle className="font-bold text-xl md:text-2xl mb-4">About Me</CardTitle>
                            <div className='self-center border-b border-white/20' />
                        </CardHeader>
                        <CardContent className="flex flex-col gap-5">
                            <p className="bg-[#242428] h-50 p-3 border border-white/20 rounded-xl overflow-y-auto">
                                {aboutMe}
                            </p>
                            
                            <span className="text-sm border my-2 py-1 md:px-4 bg-linear-to-r from-pink-500 to-violet-500 rounded-lg w-full md:w-[230px] text-center font-semibold">
                                {email}
                            </span>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Supporters */}
                <TabsContent value="supporters">
                    <Card className="bg-[#191A1D] text-white md:h-full">
                        <CardHeader>
                            <CardTitle className="font-bold text-xl md:text-2xl mb-4">Recent Supporters</CardTitle>
                            <div className='self-center border-b border-white/20' />
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-6 h-65 overflow-y-auto">
                                {supporters && supporters?.length != 0 ? (
                                <>
                                    {supporters
                                    .slice()
                                    .sort((a, b) => b.id - a.id)
                                    .map((supporter) => (
                                        <div key={supporter.id} className="flex flex-col gap-3">
                                        <span className="flex gap-2 items-center">
                                            <SiSolana className="" size={16} />
                                            <h3>{`${!supporter.name || supporter.name === '' ? 'Anonymous' : supporter.name} donated ${parseCoinValue(supporter.tip)} SOL`}</h3>
                                        </span>
                                        {supporter.message && (
                                            <p className="bg-[#242428] rounded-lg text-white border border-white/20 px-3 py-2 mx-3">
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
                        </CardContent>
                    </Card>
                </TabsContent>
                
                {/* Vault or Donate */}
                {publicKey && creator && publicKey.equals(creator) ? (
                    // Vault
                    (
                        <TabsContent value="vault">
                            <Card className="bg-[#191A1D] text-white md:h-full">
                                <CardHeader>
                                    <CardTitle className="font-bold text-xl md:text-2xl mb-4">Vault</CardTitle>
                                    <div className='self-center border-b border-white/20' />
                                </CardHeader>
                                <CardContent>
                                    <div className="w-full rounded-3xl flex-1 flex flex-col gap-10">
                                        <div className="flex flex-col gap-10">
                                            <div className="flex flex-col gap-5">
                                                <div className="flex justify-around items-center h-10 md:h-15 my-3">
                                                    <div className="flex flex-col w-16">
                                                        <span className="text-2xl md:text-3xl font-bold">{`${parseCoinValue(profile.fund)}`}</span>
                                                        <span className="text-neutral-400 text-sm">SOL</span>
                                                    </div>

                                                    <Separator orientation="vertical" className="bg-white/20" />

                                                    <div className="flex flex-col">
                                                        <span className="text-2xl md:text-3xl font-bold">{parseCoinValue(coinValue)}</span>
                                                        <span className="text-neutral-400 text-sm">SOL per coin</span>
                                                    </div>
                                                </div>
                                                <Button className="bg-linear-to-r from-pink-500 to-violet-500 rounded-xl border py-5 text-md md:w-[250px] md:self-center md:mt-8" disabled={withdrawFunds.isPending}
                                                    onClick={async () => {
                                                    if (Number(profile.fund) === 0) {
                                                        toast.error('No fund available')
                                                        return
                                                    }
                                                    await withdrawFunds.mutateAsync(publicKey)
                                                    fetchProfile()
                                                    }}>
                                                    {withdrawFunds.isPending ? <AiOutlineLoading className="animate-spin"/> : 'Withdraw Funds'}
                                                </Button>
                                            </div>

                                            {/* Coin value update */}
                                            <div className="flex flex-col gap-3">
                                                <span>Update SOL per coin value</span>
                                                <div className="flex items-center gap-3">
                                                    <Input type="number" className="border md:flex-1 border-white/30 px-3 h-10 bg-white/5" placeholder="Coin value" value={currentCoinValue} onChange={(e) => setCurrentCoinValue(e.target.value)} />
                                                    <Button className="md:flex-1 bg-linear-to-l from-pink-500 to-violet-500 rounded-xl border py-5 text-md" disabled={setCoinValue.isPending}
                                                        onClick={async () => {
                                                        if (parseFloat(currentCoinValue) < 0.0001) {
                                                            toast.error('Atleast 0.0001 SOL')
                                                            return
                                                        }
                                                        await setCoinValue.mutateAsync({ creator: publicKey, value: parseFloat(currentCoinValue) })
                                                        setCurrentCoinValue('0')
                                                        fetchProfile()
                                                        }}>
                                                        {setCoinValue.isPending ? <AiOutlineLoading className="animate-spin"/> : 'Update'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    )
                ) : ( 
                    // Support
                    <TabsContent value="support">
                        <Card className="bg-[#191A1D] text-white md:h-full">
                            <CardHeader>
                                <CardTitle className="font-bold text-xl md:text-2xl mb-4">Support</CardTitle>
                                <div className='self-center border-b border-white/20' />
                            </CardHeader>
                            <CardContent>
                                <div className="w-full rounded-3xl flex-1 flex flex-col gap-10">
                                    <div className="flex flex-col gap-5 md:px-10">
                                        <div className="flex flex-col gap-5 md:gap-10">
                                        <Input
                                            type="number"
                                            className="border border-white/30 px-3 h-10 bg-white/5"
                                            placeholder="Number of coins to donate"
                                            value={coinAmount}
                                            onChange={(e) => setCoinAmount(e.target.value)}
                                        />
                                        <Input className="border border-white/30 px-3 h-10 bg-white/5" placeholder="Your name" onChange={(e) => setName(e.target.value)} />
                                        <textarea className="border border-white/30 w-full h-40 p-2 rounded-xl bg-white/5" placeholder="Say something nice..." onChange={(e) => setMessage(e.target.value)} />
                                        <Button className="bg-linear-to-l from-pink-500 to-violet-500 rounded-xl border py-5 text-md md:self-center md:w-[250px]" disabled={supportCreator.isPending}
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
                                            const amount = calculateSolAmount(coin, coinValue);
                                            const supporterName = name.trim() === '' ? null : name.trim();
                                            const supporterMsg = message.trim() === '' ? null : message.trim();

                                            await supportCreator.mutateAsync({
                                                supporter: publicKey,
                                                creatorPubKey: profile.creator,
                                                amount,
                                                name: supporterName,
                                                message: supporterMsg
                                            })
                                            fetchSupporters()

                                            setCoinAmount('')
                                            setName('')
                                            setMessage('')
                                            }}
                                        >
                                            {supportCreator.isPending ? <AiOutlineLoading className="animate-spin"/>
                                            : (
                                                `Support ${Number(coinAmount) === 0 ? ''
                                                : `${calculateSolAmount(parseFloat(coinAmount), coinValue)} SOL`}`
                                            )}
                                        </Button>
                                        </div>
                                    </div>
                                    </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}
                
            </Tabs>
        </div>
    )
}

export default ProfileTabs