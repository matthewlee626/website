import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'

export default function blog() {
  return (
    <Layout main>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section >
        <h2>Meet</h2>
        <ul style={{ height: "400px" }}>
            <iframe
                src="https://calendly.com/matthewlee626"
                width="100%"
                height="100%"
                frameborder="0"
            ></iframe>
        </ul>
      </section>
    </Layout>
  )
}
