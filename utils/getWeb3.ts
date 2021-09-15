import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'

const getWeb3 = async () => {
  let web3js: Web3, web3Modal: Web3Modal, provider
  let providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: '7827bee64ce549dda18a2eb7b8a54d18',
      },
    },
  }

  const isConnected = JSON.parse(localStorage.getItem('isConnected'))

  if (typeof window.web3 !== undefined && isConnected) {
    // metamask is already provide
    web3js = new Web3(window.web3.currentProvider)
  } else {
    // no provider
    web3Modal = new Web3Modal({ cacheProvider: true, providerOptions })
    // web3Modal = new Web3Modal({ cacheProvider: true, providerOptions })
    provider = await web3Modal.connect()
    provider.on('accountsChanged', (accounts: string[]) => {
      console.log(accounts)
    })

    provider.on('disconnect', (error: { code: number; message: string }) => {
      console.error(error)
    })
    provider.on('connect', (info: { chainId: number }) => {
      console.log(info)
    })
    web3js = new Web3(provider)
    localStorage.setItem('isConnected', 'true')
  }

  return web3js
}

export default getWeb3
