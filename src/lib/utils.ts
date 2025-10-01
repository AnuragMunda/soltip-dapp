import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ellipsify(str = '', len = 4, delimiter = '..') {
  const strLen = str.length
  const limit = len * 2 + delimiter.length

  return strLen >= limit ? str.substring(0, len) + delimiter + str.substring(strLen - len, strLen) : str
}

export const checkProfile = async (programId: PublicKey, creator: PublicKey | string, connection: Connection) => {
  const creatorPubkey =
    typeof creator === 'string' ? new PublicKey(creator) : creator

  const seeds = [Buffer.from("PROFILE"), creatorPubkey.toBuffer()];
  const [profilePDA] = PublicKey.findProgramAddressSync(
    seeds,
    programId,
  );

  const accountInfo = await connection.getAccountInfo(profilePDA)
  return accountInfo?.data != null
}

export const parseCoinValue = (value: number) => {
    return value / LAMPORTS_PER_SOL
}

export const calculateSolAmount = (amount: number, coinValue: number) => {
  console.log(parseFloat((amount * parseCoinValue(coinValue)).toFixed(4)))
    return parseFloat((amount * parseCoinValue(coinValue)).toFixed(4))
  }