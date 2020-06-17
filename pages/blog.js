import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'

import { getSortedPostsData } from '../lib/posts'

import Link from 'next/link'
import Date from '../components/date'

export default function blog({ allPostsData }) {
  return (
    <Layout main>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section >
        <h2>Blog</h2>
        <ul>
          {allPostsData.map(({ id, date, title }) => (
            <li key={id}>
              <Link href="/posts/[id]" as={`/posts/${id}`}>
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
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}