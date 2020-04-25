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
        <p>i am currently a senior at San Marino High.</p>
        <p>i will attend UC Berkeley this coming fall.</p>
        <p>i plan to study computer science and business, and maybe dabble in public policy.</p>
        <p>i code, design, and envision.</p>
      </section>
    </Layout>
  )
}
