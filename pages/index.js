import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'

export default function Home() {
  return (
    <Layout main>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <h2>I'm Matthew Lee. </h2>
      <section>
        <p>I attend San Marino High School in San Marino, CA as a rising senior.</p>
        <p>You might know me from:</p>
        <ul>
          <li>
            Titanium Robotics: I serve as the Engineering President of FRC 1160, running an online engineering academy. 
          </li>
          <li>
            Titan Hacks: I taught CS workshops in the San Marino community and ran TitanHacks, an online hackathon.
          </li>
          <li>
            RMP @ UCSB: I'm currently researching with TBD about TBD.
          </li>
          <li>
            CSP @ Stanford SPICE: I learned about the close and dynamic relationship between the USA and China.
          </li>
        </ul>
        <p>Feel free to contact me through any of the mediums below. If you prefer email, reach me at matthewlee626 at gmail dot com.</p>
      </section>
    </Layout>
  )
}
