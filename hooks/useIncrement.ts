import { useContractFunction } from '@usedapp/core'
import { simpleContractAddress } from '../contracts'
import useContract from './useContract'
import { simpleContractInterface } from './useCount'

export default function useIncrement() {
  const contract = useContract(simpleContractAddress, simpleContractInterface)
  const { state, send } = useContractFunction(contract, 'incrementCount', {})

  return { state, send }
}
