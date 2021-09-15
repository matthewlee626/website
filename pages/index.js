import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
// import { FaFile } from "react-icons/fa";

export default function Home() {
  return (
    <Layout main>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <h1>Matthew Lee</h1>
      <section>
        <p>i am currently a freshman at UC Berkeley.</p>
        <p>i intend to study computer science and data science.</p>
        <p>i also plan to dabble in design and entrepreneurship.</p>
      </section>
    </Layout>
  )
}
