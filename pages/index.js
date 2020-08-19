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
        <p>I attend San Marino High School in San Marino, CA as a current senior.</p>
        <p>You might know me from:</p>
        <ul>
          <li>
            Titanium Robotics: I serve as the Engineering President of FRC 1160, running an online engineering academy. 
          </li>
          <li>
            Titan Hacks: I teach CS workshops in the San Marino community and ran TitanHacks, an online hackathon.
          </li>
          <li>
            RMP @ UCSB: I researched with Yi Ding about using multimodal signals for EEG-based authentication.
          </li>
          <li>
            CSP @ Stanford SPICE: I learned about the close and dynamic relationship between the USA and China.
          </li>
        </ul>
        <p>Feel free to contact me through any of the mediums below. If you prefer email, reach me at matthewlee626 at gmail dot com. Send any book recommendations; I'm always looking for a good read!</p>
      </section>
    </Layout>
  )
}
