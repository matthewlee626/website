import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'

import { getSortedPostsData } from '../lib/works'

import Link from 'next/link'
import Date from '../components/date'

export default function works({ allWorksData }) {
  return (
    <Layout main>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section >
        <h2>Works</h2>
        <ul>
          {allWorksData.map(({ id, date, title }) => (
            <li key={id}>
              <Link href="/works/[id]" as={`/works/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}


export async function getStaticProps() {
  const allWorksData = getSortedPostsData()
  return {
    props: {
      allWorksData
    }
  }
}