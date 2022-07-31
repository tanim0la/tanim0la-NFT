import Head from 'next/head'
import Image from 'next/image'
import img from '../public/images/pp.png'

function Header() {
  return (
    <div className="flex flex-col items-center pt-16 px-4">
      <Head>
        <title>tanim0la NFT</title>
        <meta name="description" content="Tanim0la NFT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-28 h-28 p-3 sm:w-36 sm:h-36 rounded-full border-4 border-neutral-100 shadow-xl shadow-neutral-600/50">
        <Image className="" draggable={false} src={img} />
      </div>
      <div className="font-bold text-4xl py-5 sm:text-5xl">tanim0la NFT</div>
      <div className="font-bold text-center pb-20 sm:px-3">
        10,000 collections of tanim0la NFT, vibing on Blockchain. A project
        built for the community, by the community.
      </div>
    </div>
  )
}

export default Header
