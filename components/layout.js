import Head from 'next/head'
import styles from './layout.module.sass'
import Link from 'next/link'
import { FaInstagram, FaGithub, FaLinkedin, FaFile, FaEye} from "react-icons/fa";

const name = 'Matthew Lee'
export const siteTitle = 'Matthew Lee'

const topLevel = ["meet"]

/*
<header className={styles.header}>
  <Link href={`/`} key={'home'}>
    <a>home</a>
  </Link>
  {topLevel.map((name) => (
      <Link href={`/${name}`} key={name}>
          <a>{name}</a>
      </Link>
  ))}
</header>
*/

export default function Layout({ children, main }) {
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
      <section>
        
        <main className={styles.main}>
          {children}
          <section> 
            <a href="/resume.pdf" ><FaFile alt="My resume."/></a>
            <a href="https://github.com/matthewlee626"><FaGithub alt="My GitHub."/></a>      
            <FaEye/>
            <a href="https://instagram.com/mlee36177"><FaInstagram alt="My Instagram."/></a>
            <a href="https://linkedin.com/in/matthewlee626"><FaLinkedin alt="My LinkedIn."/></a>
          </section>
         
        </main>
      
      </section>
      <footer className={styles.footer}>
      </footer>
    </div>
  )
}