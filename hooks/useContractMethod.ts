import { useContractFunction } from '@usedapp/core'
import { simpleContractAddress } from '../contracts'
import useContract from './useContract'
import { simpleContractInterface } from './useCount'

export default function useContractMethod(methodName: string) {
  const contract = useContract(simpleContractAddress, simpleContractInterface)
  const { state, send } = useContractFunction(contract, methodName, {})
  return { state, send }
}
