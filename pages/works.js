import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import {Card, Image, Text, Link} from 'theme-ui'
import styles from './works.module.sass'

const works = {
    'items': [
        {
          'name': "Hunt",
          'blurb': "Artwork analyzed.",
          'id': 0,
          'img': '/noimage.png',
          'url': ''
        },
        {
          'name': "Zoom-In",
          'blurb': "A skribbl.io-like visual guessing game. Date TBA.",
          'id': 0,
          'img': '/noimage.png',
          'url': ''
        },
        {
          'name': "Notebook",
          'blurb': "Caligraphy style notebook. Publish to the world! Date TBA.",
          'id': 0,
          'img': '/noimage.png',
          'url': ''
        },
        {
          'name': "CCSM",
          'blurb': "A website for sharing programming materials for a mentoring program. Released 8/20.",
          'id': 0,
          'img': '/ccsm.png',
          'url': 'https://ccsm.vercel.app/'
        },
        {
          'name': "ABLS",
          'blurb': "Airtable-based link shortener; bit.ly without the ads.",
          'id': 0,
          'img': '/airtable.png',
          'url': ''
        },
        {
          'name': "Octavo",
          'blurb': "A tool for training identification in musical interviews.",
          'id': 0,
          'img': '/octavo.png',
          'url': 'https://octavo.matthewlee.xyz/'
        },
        {
          'name': "Scouting App",
          'blurb': "Game information collection tool for the FRC 2020 game.",
          'id': 0,
          'img': '/scouting.png',
          'url': 'https://matthewlee626.github.io/webscouting/'
        },
        {
          'name': "TTT",
          'blurb': "Simple Tic-Tac-Toe game built on React Native.",
          'id': 0,
          'img': '/ttt.png',
          'url': 'https://play.google.com/store/apps/details?id=com.matthewlee626.TicTacToe'
        },
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
        <section className={styles.workCards}>
          
         {works['items'].map(({name, blurb, id, img, url}) => (
            <Link href={url} key={id} className={styles.workOverlay}>
             <Work
                name={name}
                blurb={blurb}
                img={img}
             >
             </Work>
            </Link>
         ))}
        </section>
      </section>
    </Layout>
  )
}

const Work = props => (
    <Card className={styles.card}>
        <Image src={props.img}></Image>
        <h3>{props.name}</h3>
        <Text>{props.blurb}</Text>
    </Card>
)