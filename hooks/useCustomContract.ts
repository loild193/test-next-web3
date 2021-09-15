import { Contract } from 'web3-eth-contract'
import { useContext, useMemo } from 'react'
import { Web3Context } from '../context/Web3'

interface Props {
  ABI: any
  address: string
  options?: {
    from: string
  }
}

export default function useCustomContract<T extends Contract = Contract>(props: Props): T | null {
  const {
    ABI,
    address,
    options: { from },
  } = props
  const { web3js } = useContext(Web3Context)

  return useMemo(() => {
    if (!address || !ABI || !web3js) {
      return null
    }

    try {
      return new web3js.eth.Contract(ABI, address, { from })
    } catch (error) {
      console.error('Failed To Get Contract', error)

      return null
    }
  }, [address, ABI, web3js, from]) as T
}
