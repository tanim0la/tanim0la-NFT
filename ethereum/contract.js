import { ethers } from 'ethers'
import compiledTani from './TaniNFT.json'

let contract

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  contract = new ethers.Contract(
    '0x563c9633a9888a984CF26F30601E568a02704b36',
    compiledTani.abi,
    provider.getSigner(),
  )
} else {
  contract = new ethers.Contract(
    '0x563c9633a9888a984CF26F30601E568a02704b36',
    compiledTani.abi,
  )
}

export default contract
