import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Feed from '../components/Feed'
import SideBar from '../components/Sidebar'
import Widgets from '../components/Widgets'
import { fetchTweets } from '../utils/fetchTweets'
import { Tweet } from '../typings'
import { Toaster } from 'react-hot-toast'

interface Props {
  tweets: Tweet[]
}

const Home = ({ tweets }: Props) => {
  
  return (
    <div className=' max-h-screen overflow-hidden lg:max-w-6xl mx-auto'  >
      <Head>
        <title>Twitter 2.0</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster />
      <main className='grid grid-cols-9' >
        {/* SideBar */}
        <SideBar />

        {/* Feed */}
        <Feed tweets={tweets} />
        {/* Widgets */}
        <Widgets />
      </main>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {

  const tweets = await fetchTweets();

  return {
    props: {
      tweets
    }
  }
}