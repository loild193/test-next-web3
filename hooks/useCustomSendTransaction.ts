import { useSendTransaction } from '@usedapp/core'
import { useWeb3React } from '@web3-react/core'

export default function useCustomSendTransaction() {
  const { library, account } = useWeb3React()
  console.log(library)
  // return useSendTransaction({ signer: library.getSigner(account) })
}
