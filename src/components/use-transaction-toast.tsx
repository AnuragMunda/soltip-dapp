import { toast } from 'sonner'

export function useTransactionToast() {
  return (signature: string) => {
    toast('Transaction sent ✅', {
      description: <a
        href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
        target="_blank"
        rel="noopener noreferrer"
        className="link font-mono"
      >
        View Transaction
      </a>,
    })
  }
}