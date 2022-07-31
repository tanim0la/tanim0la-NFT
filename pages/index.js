import Header from '../components/Header'
import Claim from '../components/Claim'
import Footer from '../components/Footer'

export default function Home(props) {
  return (
    <div className="h-full w-full bg-neutral-900 py-10 text-neutral-100 font-mono">
      <Header />
      <Claim owner={props} />
      <Footer />
    </div>
  )
}

export async function getServerSideProps() {
  return {
    props: {
      network: process.env.NETWORK,
      pkey: process.env.PRIVATE_KEY,
    },
  }
}
