import React, { useState, useEffect } from 'react'
import keccak256 from 'keccak256'
import contract from '../ethereum/contract'
import MerkleTree from 'merkletreejs'
import { ethers } from 'ethers'
import compiledTani from '../ethereum/TaniNFT.json'

function Claim(props) {
  const [button, setButton] = useState('')
  const [address, setAddress] = useState('')
  const [amountMinted, setAmountMinted] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [connected, setConnected] = useState()
  const [whitelisted, setWhitelisted] = useState(false)
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    const isConnected = async () => {
      if (
        typeof window !== 'undefined' &&
        typeof window.ethereum !== 'undefined'
      ) {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        })

        if (accounts.length > 0) {
          setAddress(accounts[0])
          setButton('Join WhiteList')
          isWhitelisted()
          contract.on('Transfer', (from, to, tokenId) => {
            let a = parseInt(tokenId) + 1
            setAmountMinted(String(a))
          })
        } else {
          setButton('Connect Wallet')
          setWhitelisted(false)
          setConnected(false)
        }
      } else {
        setButton('Connect Wallet')
        setConnected(false)
        setWhitelisted(false)
      }
    }

    try {
      isConnected()
    } catch (err) {
      setErrMsg(err.message)
    }
  }, [address])

  const isWhitelisted = async () => {
    let addresses = await contract.getAddresses()
    let tSupply = await contract.totalSupply()
    setAmountMinted(String(tSupply))
    addresses = addresses.map((addy) => addy.toLowerCase())
    setConnected(true)
    if (address && addresses.includes(address.toLowerCase())) {
      let minted = await contract.minted(address)
      if (minted) {
        setButton('Minted!')
        setDisabled(true)
        setWhitelisted(true)
      } else {
        setWhitelisted(true)
        setButton('Mint NFT')
      }
    }
  }

  const onConnect = async () => {
    setErrMsg('')
    if (
      typeof window !== 'undefined' &&
      typeof window.ethereum !== 'undefined'
    ) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })

        setAddress(accounts[0])
        isWhitelisted()
      } catch (err) {
        setErrMsg(err.message)
      }
    } else {
      setErrMsg('No Metamask.')
    }
  }

  const onWhitelist = async () => {
    if (window.ethereum.networkVersion == '4') {
      try {
        setErrMsg('')
        setDisabled(true)
        setButton('Loading.')

        await contract.joinWl().then((tx) => tx.wait())
        setButton('Loading..')
        setWhitelisted(true)

        let addresses = await contract.getAddresses()
        if (addresses.length > 0) {
          const leaves = addresses.map((addy) => keccak256(addy))
          const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
          const root = '0x' + tree.getRoot().toString('hex')
          const Owner = props.owner
          const connection = new ethers.providers.JsonRpcProvider(Owner.network)
          const wallet = new ethers.Wallet(Owner.pkey)
          const signer = wallet.connect(connection)
          const owner = new ethers.Contract(
            '0x563c9633a9888a984CF26F30601E568a02704b36',
            compiledTani.abi,
            signer,
          )
          setButton('Loading...')
          await owner.setRoot(root).then((tx) => tx.wait())
        }
        setButton('Mint NFT')
        setDisabled(false)
      } catch (err) {
        setErrMsg(err.message)
        setDisabled(false)
        setWhitelisted(false)
        setButton('Join WhiteList')
      }
    } else {
      setErrMsg('Change to Rinkeby test network!!!')
    }
  }

  const onMint = async () => {
    if (window.ethereum.networkVersion == '4') {
      try {
        setErrMsg('')
        setDisabled(true)
        setButton('Minting...')

        let addresses = await contract.getAddresses()
        const leaves = addresses.map((addy) => keccak256(addy))
        const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
        const buf2hex = (x) => '0x' + x.toString('hex')
        const leaf = keccak256(address)
        const proof = tree.getProof(leaf).map((x) => buf2hex(x.data))

        await contract.MintNft(proof).then((tx) => tx.wait())
        setButton('Minted!')
      } catch (err) {
        setErrMsg(err.message)
        setDisabled(false)
        setButton('Mint NFT')
      }
    } else {
      setErrMsg('Change to Rinkeby test network!!!')
    }
  }

  return (
    <div className="text-center my-16 sm:px-16">
      {whitelisted ? (
        <div className="text-4xl font-extralight pb-5">
          {'['}
          {amountMinted}
          {'/10000]'}
          <span className="text-sm">minted</span>
        </div>
      ) : null}
      <span className="pb-8 text-center">
        {address.length > 40
          ? address.slice(0, 6) + '...' + address.slice(37, 42) + ' - connected'
          : null}{' '}
      </span>
      {connected ? (
        <button
          disabled={disabled}
          onClick={whitelisted ? onMint : onWhitelist}
          className="bg-neutral-100 text-neutral-900 w-4/5 font-semibold py-2 rounded-lg shadow-lg hover:shadow-neutral-500/50 sm:text-2xl"
        >
          {button}
        </button>
      ) : (
        <button
          onClick={onConnect}
          className="bg-neutral-100 text-neutral-900 w-4/5 font-semibold py-2 rounded-lg shadow-lg hover:shadow-neutral-500/50 sm:text-2xl"
        >
          {button}
        </button>
      )}
      {errMsg ? (
        <div className="flex justify-center">
          <div className="text-start rounded-md border-2 border-red-700 bg-red-100 text-red-700 w-4/5 p-4">
            <span className="font-semibold text-xl">Oops!</span> <br />
            {errMsg}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Claim

