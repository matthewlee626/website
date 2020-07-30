import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import {Box} from 'theme-ui'

export default function blog() {
  return (
    <Layout main>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section >
        <h2>Works</h2>
        <ul>
         {'In Progress'}
        </ul>
      </section>
    </Layout>
  )
}

const work = props => (
    <Box>
        
    </Box>
)