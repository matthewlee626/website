import Head from 'next/head'
import styles from './layout.module.sass'
import Link from 'next/link'

const name = 'Matthew Lee'
export const siteTitle = 'Matthew Lee'

const topLevel = ["blog"]

export default function Layout({ children, home }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="I'm Matthew Lee, an aspiring programmer from San Marino High School."
        />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            siteTitle
          )}.png?theme=light&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header className={styles.header}>
        <Link href={`/`}>
          <a>Home</a>
        </Link>
        {topLevel.map((name) => (
            <Link href={`${name}`}>
                <a>{name.charAt(0).toUpperCase() + name.slice(1)}</a>
            </Link>
        ))}
      </header>
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
    </div>
  )
}