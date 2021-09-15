import React, { useCallback, useEffect } from 'react'
import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { providers } from 'ethers'

export const Web3Context = React.createContext(null)

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: '7827bee64ce549dda18a2eb7b8a54d18',
    },
  },
}

let web3Modal: Web3Modal
if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions,
  })
}

type StateType = {
  web3js?: any
  provider?: any
  web3Provider?: any
  address?: string
  chainId?: number
}

type ActionType =
  | {
      type: 'SET_WEB3_PROVIDER'
      payload: {
        web3js?: StateType['web3js']
        provider?: StateType['provider']
        web3Provider?: StateType['web3Provider']
        address?: StateType['address']
        chainId?: StateType['chainId']
      }
    }
  | {
      type: 'SET_ADDRESS'
      payload: {
        address?: StateType['address']
      }
    }
  | {
      type: 'SET_CHAIN_ID'
      payload: {
        chainId?: StateType['chainId']
      }
    }
  | {
      type: 'RESET_WEB3_PROVIDER'
    }

const initialState = {
  web3js: null,
  provider: null,
  web3Provider: null,
  address: null,
  chainId: null,
}

function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case 'SET_WEB3_PROVIDER':
      return {
        ...state,
        web3js: action.payload.web3js,
        provider: action.payload.provider,
        web3Provider: action.payload.web3Provider,
        address: action.payload.address,
        chainId: action.payload.chainId,
      }
    case 'SET_ADDRESS':
      return {
        ...state,
        address: action.payload.address,
      }
    case 'SET_CHAIN_ID':
      return {
        ...state,
        chainId: action.payload.chainId,
      }
    case 'RESET_WEB3_PROVIDER':
      return initialState
    default:
      throw new Error()
  }
}

const Web3ContextProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const { web3js, provider, web3Provider, address, chainId } = state

  const connect = useCallback(async () => {
    // initial provider, is MetaMask or WalletConnect
    const provider = await web3Modal.connect()

    // get a web3Provider
    const web3Provider = new providers.Web3Provider(provider)
    const web3js = new Web3(provider)
    const signer = web3Provider.getSigner()
    const address = await signer.getAddress()

    const network = await web3Provider.getNetwork()

    dispatch({
      type: 'SET_WEB3_PROVIDER',
      payload: {
        web3js,
        provider,
        web3Provider,
        address,
        chainId: network.chainId,
      },
    })
  }, [])

  const disconnect = useCallback(async () => {
    await web3Modal.clearCachedProvider()
    if (provider?.disconnect && typeof provider.disconnect === 'function') {
      await provider.disconnect()
    }
    dispatch({
      type: 'RESET_WEB3_PROVIDER',
    })
  }, [provider])

  // Auto connect the cached provider
  React.useEffect(() => {
    if (web3Modal.cachedProvider) {
      connect()
    }
  }, [connect])

  // Listen event from provider to update local state
  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        console.log('accounts changed: ', accounts)
        dispatch({
          type: 'SET_ADDRESS',
          payload: { address: accounts[0] },
        })
      }

      const handleChainChanged = (chainId: number) => {
        console.log('chainId changed: ', chainId)
        dispatch({
          type: 'SET_CHAIN_ID',
          payload: { chainId: chainId },
        })
      }

      const handleDisconnect = (error: { code: number; message: string }) => {
        console.log('disconnect', error)
        disconnect()
      }

      provider.on('accountsChanged', handleAccountsChanged)
      provider.on('chainChanged', handleChainChanged)
      provider.on('disconnect', handleDisconnect)

      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged)
          provider.removeListener('chainChanged', handleChainChanged)
          provider.removeListener('disconnect', handleDisconnect)
        }
      }
    }
  }, [provider, disconnect])

  return (
    <Web3Context.Provider value={{ web3js, web3Provider, address, chainId, connect, disconnect }}>
      {children}
    </Web3Context.Provider>
  )
}

export default Web3ContextProvider
