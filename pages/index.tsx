import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import { Web3Context } from '../context/Web3'
import ABI from '../abi/SimpleContract.json'
import { simpleContractAddress } from '../contracts'
import { toast, ToastContainer } from 'react-toastify'
import useCustomContract from '../hooks/useCustomContract'

const renderToastNotification = (message: string, type: 'success' | 'error') => {
  if (type === 'error') {
    toast.error(message, {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    })
  } else if (type === 'success') {
    toast.success(message, {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    })
  }
}

function Home() {
  const { web3js, web3Provider, address, chainId, connect, disconnect } = useContext(Web3Context)
  const toAccount = '0x5Ac6B04A2E473718127e5eC72dF4d263729E926d'
  const [numberInput, setNumberInput] = useState(0)
  const [countState, setCountState] = useState<number>(null)

  const contract = useCustomContract({ ABI, address: simpleContractAddress, options: { from: address } })

  useEffect(() => {
    const intervalID = setInterval(() => {
      contract.methods
        .count()
        .call()
        .then((count: number) => setCountState(count))
    }, 5000)

    return () => {
      clearInterval(intervalID)
    }
  }, [contract])

  const handleTransfer = async () => {
    const balance = await web3js.eth.getBalance(address)
    console.log(web3js.utils.fromWei(balance, 'ether'))
  }

  const handleSetCount = () => {
    contract.methods
      .setCount(numberInput)
      .send()
      .on('receipt', function () {
        // toast.success('Done transaction', {
        //   position: 'bottom-right',
        //   autoClose: 3000,
        //   hideProgressBar: true,
        //   closeOnClick: true,
        //   pauseOnHover: false,
        //   draggable: true,
        //   progress: undefined,
        // })
        renderToastNotification('Done transaction', 'success')
      })
      .on('error', function (error: Error & { code: number }) {
        // toast()
        if (error.code === 4001) {
          // toast.error('User denied transaction', {
          //   position: 'bottom-right',
          //   autoClose: 3000,
          //   hideProgressBar: true,
          //   closeOnClick: true,
          //   pauseOnHover: false,
          //   draggable: true,
          //   progress: undefined,
          // })
          renderToastNotification('User denied transaction', 'error')
        }
        // console.error(error)
      })
  }

  const handleTransaction = () => {
    web3js.eth
      .sendTransaction({
        from: address,
        to: toAccount,
        value: web3js.utils.toWei('0.01', 'ether'),
      })
      .on('receipt', function () {
        // toast.success('Done transaction', {
        //   position: 'bottom-right',
        //   autoClose: 3000,
        //   hideProgressBar: true,
        //   closeOnClick: true,
        //   pauseOnHover: false,
        //   draggable: true,
        //   progress: undefined,
        // })
        renderToastNotification('Done transaction', 'success')
      })
      .on('error', function (error: Error & { code: number }) {
        // toast()
        if (error.code === 4001) {
          // toast.error('User denied transaction', {
          //   position: 'bottom-right',
          //   autoClose: 3000,
          //   hideProgressBar: true,
          //   closeOnClick: true,
          //   pauseOnHover: false,
          //   draggable: true,
          //   progress: undefined,
          // })
          renderToastNotification('User denied transaction', 'error')
        }
        // console.error(error)
      })
  }

  return (
    <>
      <div>
        <Head>
          <title>next-web3-boilerplate</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          {/* <Account triedToEagerConnect={triedToEagerConnect} /> */}

          {address && <span>{address}</span>}

          <div>
            {web3Provider ? (
              <button className="button" type="button" onClick={disconnect}>
                Disconnect
              </button>
            ) : (
              <button className="button" type="button" onClick={connect}>
                Connect
              </button>
            )}
          </div>
          {countState && <span>Count from contract: {countState}</span>}
          <button onClick={handleTransfer}>Increment</button>
          <input type="number" value={numberInput} onChange={(e) => setNumberInput(Number(e.target.value))} />
          <button onClick={handleSetCount}>Set count</button>
          <div>
            <span>Transfer 2B :v</span>
            <button onClick={handleTransaction}>Send transaction</button>
          </div>
        </main>
      </div>
      <ToastContainer />
    </>
  )
}

export default Home
