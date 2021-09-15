import { ethers } from 'ethers'
import { useContractCall } from '@usedapp/core'
import simpleContractAbi from '../abi/SimpleContract.json'
import { simpleContractAddress } from '../contracts'

export const simpleContractInterface = new ethers.utils.Interface(simpleContractAbi)

export default function useCount() {
  const [count]: any =
    useContractCall({
      abi: simpleContractInterface,
      address: simpleContractAddress,
      method: 'count',
      args: [],
    }) ?? []
  // console.log(count)
  return count
}
