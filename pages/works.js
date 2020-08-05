import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import {Box} from 'theme-ui'
import styles from './works.module.sass'

const works = {
    'items': [
        {
            'name': "Octavo",
            'blurb': "Octavo is cool.",
            'id': 0
        }
    ]
}

export default function blog() {


  return (
    <Layout main>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section >
        <h2>Works</h2>
        <ul>
         {works['items'].map(({name, blurb, id}) => (
             <Work
                id={id}
                name={name}
                blurb={blurb}
             >
             </Work>
         ))}
        </ul>
      </section>
    </Layout>
  )
}

const Work = props => (
    <Box className={styles.workOverlay}>
        <p>{props.name}</p>
        <p>{props.blurb}</p>
    </Box>
)