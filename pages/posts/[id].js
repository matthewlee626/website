import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
import Head from 'next/head'
import Date from '../../components/date'

export default function Post({postData}) {
  return (
    <Layout>
        <Head>
            <title>{postData.title}</title>
        </Head>
        <article>
          <h2>{postData.title}</h2>
          <div >
            <small>
              <Date dateString={postData.date} />
            </small>
          </div>
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  )
}

export async function getStaticPaths() {
  // Return a list of possible value for id
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
    const postData = await getPostData(params.id)
    return {
      props: {
        postData
      }
    }
  }
  