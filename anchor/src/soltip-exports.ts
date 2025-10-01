// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import SoltipIDL from '../target/idl/soltip.json'
import type { Soltip } from '../target/types/soltip'

// Re-export the generated IDL and type
export { Soltip, SoltipIDL }

// The programId is imported from the program IDL.
export const SOLTIP_PROGRAM_ID = new PublicKey(SoltipIDL.address)

// This is a helper function to get the Soltip Anchor program.
export function getSoltipProgram(provider: AnchorProvider, address?: PublicKey): Program<Soltip> {
  return new Program({ ...SoltipIDL, address: address ? address.toBase58() : SoltipIDL.address } as Soltip, provider)
}

// This is a helper function to get the program ID for the Soltip program depending on the cluster.
export function getSoltipProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Soltip program on devnet and testnet.
      return new PublicKey('9UXhm3zakFtqXYYgEuT2VQhhp7ots23N52PHKxynFCZ9')
    case 'mainnet-beta':
    default:
      return SOLTIP_PROGRAM_ID
  }
}
