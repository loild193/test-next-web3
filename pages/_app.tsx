import type { AppProps } from 'next/app'
import Web3ContextProvider from '../context/Web3'
import 'react-toastify/dist/ReactToastify.css'

function NextWeb3App({ Component, pageProps }: AppProps) {
  return (
    <Web3ContextProvider>
      <Component {...pageProps} />
    </Web3ContextProvider>
  )
}

export default NextWeb3App
