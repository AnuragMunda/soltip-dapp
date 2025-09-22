'use client'

import { getSoltipProgram, getSoltipProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useAnchorProvider } from '../solana/solana-provider'
import { toast } from 'sonner'
import { useTransactionToast } from '../use-transaction-toast'
import { BN } from '@coral-xyz/anchor'

export function useSoltipProgram() {
  const { connection } = useConnection()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getSoltipProgramId('devnet'), [])
  const program = useMemo(() => getSoltipProgram(provider, programId), [provider, programId])

  const profiles = useQuery({
    queryKey: ['profile', 'all', { cluster: 'devnet' }],
    queryFn: () => program.account.profile.all(),
  })

  const getCreatorProfile = async (creatorPubKey: PublicKey) => {
    const [profilePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("PROFILE"), creatorPubKey.toBuffer()],
      program.programId
    );

    return await program.account.profile.fetch(profilePda)
  }

  const supporters = useQuery({
    queryKey: ['supporter', 'all', { cluster: 'devnet' }],
    queryFn: () => program.account.supporter.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster: 'devnet' }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initializeProfile = useMutation({
    mutationKey: ['profile', 'initializeProfile', { cluster: 'devnet' }],
    mutationFn: async ({
      creator,
      name,
      email,
      bio,
      aboutMe
    }: {
      creator: PublicKey,
      name: string,
      email: string,
      bio: string,
      aboutMe: string
    }) => {
      return await program.methods
        .initializeProfile(name, email, bio, aboutMe)
        .accounts({ creator: creator })
        .rpc({ commitment: 'confirmed' })
    },
    onSuccess: async (signature) => {
      toast.success('Profile created ✅')
      transactionToast(signature)
      await profiles.refetch()
    },
    onError: () => {
      toast.error('Failed to initialize account')
    },
  })

  const updateProfile = useMutation({
    mutationKey: ['profile', 'updateProfile', { cluster: 'devnet' }],
    mutationFn: async ({
      creator,
      name,
      email,
      bio,
      aboutMe
    }: {
      creator: PublicKey;
      name: string | null,
      email: string | null,
      bio: string | null,
      aboutMe: string | null
    }) =>
      await program.methods
        .updateProfile(name, email, bio, aboutMe)
        .accounts({ creator: creator })
        .rpc({ commitment: 'confirmed' }),
    onSuccess: async (signature) => {
      transactionToast(signature)
      await profiles.refetch()
    },
    onError: () => {
      toast.error('Failed to update account')
    },
  })

  const closeProfile = useMutation({
    mutationKey: ['profile', 'closeProfile', { cluster: 'devnet' }],
    mutationFn: async (creator: Keypair) =>
      await program.methods.closeProfile().accounts({ creator: creator.publicKey }).signers([creator]).rpc(),
    onSuccess: async (signature) => {
      transactionToast(signature)
      await profiles.refetch()
    },
    onError: () => {
      toast.error('Failed to close account')
    },
  })

  const setCoinValue = useMutation({
    mutationKey: ['profile', 'setCoinValue', { cluster: 'devnet' }],
    mutationFn: async ({ creator, value }: { creator: PublicKey, value: number }) =>
      await program.methods
        .setCoinValue(new BN(Math.floor(value * LAMPORTS_PER_SOL)))
        .accounts({ creator })
        .rpc({ commitment: 'processed' }),
    onSuccess: async (signature) => {
      transactionToast(signature)
    },
    onError: () => {
      toast.error('Failed to set coin value')
    },
  })

  const withdrawFunds = useMutation({
    mutationKey: ['profile', 'setCoinValue', { cluster: 'devnet' }],
    mutationFn: async (creator: PublicKey) =>
      await program.methods
        .withdrawCoins()
        .accounts({ creator })
        .rpc({ commitment: 'processed' }),
    onSuccess: async (signature) => {
      transactionToast(signature)
    },
    onError: () => {
      toast.error('Failed to withdraw funds')
    },
  })

  const supportCreator = useMutation({
    mutationKey: ['supporter', 'supportCreator', { cluster: 'devnet' }],
    mutationFn: async ({
      supporter,
      creatorPubKey,
      amount,
      name,
      message
    }: {
      supporter: PublicKey,
      creatorPubKey: PublicKey,
      amount: number,
      name: string | null,
      message: string | null
    }) => {
      const [profilePda] = PublicKey.findProgramAddressSync(
        [Buffer.from("PROFILE"), creatorPubKey.toBuffer()],
        program.programId
      );

      return await program.methods
        .supportCreator(new BN(Math.floor(amount * LAMPORTS_PER_SOL)), name, message)
        .accounts({ supporter: supporter, profile: profilePda })
        .rpc({ commitment: 'processed' });
    },
    onSuccess: async (signature) => {
      transactionToast(signature)
      await supporters.refetch()
    },
    onError: () => {
      toast.error('Failed to tip creator')
    },
  })

  return {
    program,
    programId,
    profiles,
    getCreatorProfile,
    supporters,
    getProgramAccount,
    initializeProfile,
    updateProfile,
    closeProfile,
    setCoinValue,
    withdrawFunds,
    supportCreator
  }
}