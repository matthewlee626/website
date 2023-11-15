import { Box, Heading } from '@chakra-ui/react';
import { Link } from './link';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Head from 'next/head';

const styles = {
    overallContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      textAlign: 'center',
      gap: "1em",
    },
    textContainer: {
      // left aligned text
      textAlign: 'justify',
    },
    profileContainer: {
      width: '350px',
      padding: '0 25px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      textAlign: 'justify',
      gap: "1em",
      '> h1': {
          margin: '1em 0 0.4em 0',
          fontSize: '1.6em',
      },
      '> p': {
          fontSize: '1.14em',
      }
    },
    iconContainer: {
        marginTop: '1em',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        'svg': {
            color: '#33507b',
            '&:hover, &:active': {
                cursor: "pointer"
            },
            // '&:active': {
            //     cursor: "grab"
            // }
        },
    },
    pfpImage: {
        width: '275px',
        height:'275px',
        background: 'url(/pfpMain.jpg) no-repeat',
        backgroundSize: 'contain',
        borderRadius: '8px',
        transition: 'all 0.2s ease-in-out',
        // delay
        transitionDelay: '150ms',
        '&:hover, &:active': {
            background: 'url(/pfpAlt.jpg) no-repeat',
            backgroundSize: 'contain', 
            boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.8)',
        }
    },
    name: {
      fontSize: "38px",
      fontFamily: "Arial",
      color: "white",
      fontStyle: "normal",
      fontWeight: "400",
      lineHeight: "normal",
      letterSpacing: "2.4px",
      "-webkit-text-stroke": "1px #33507b"
    }
}

const Profile = () => {
    return (
        <Box sx={styles.profileContainer}>
          <Head>
            <link rel="preload" href="/pfpAlt.jpg" as="image" />
          </Head>
            <Box sx={styles.overallContainer}>
              <Box>
                <Box sx={styles.pfpImage} />

              </Box>
              <Heading sx={styles.name}>Matthew Lee</Heading>

              <Box sx={styles.textContainer}>
                <p>
                  I'm Matthew, and I'm studying computer science and data science at the University of California, Berkeley. My research interests are in the intersection of HCI and ML; I've explored learnings in <Link href="https://doi.org/10.1145/3563657.3596138" external>iterative prompt design for chatbots</Link> and novel interfaces for manipulating dictated text on mobile devices with LLMs. I also run <Link href="https://calhacks.io/" external>Cal Hacks</Link>, UC Berkeley's largest hackathon. I’ve interned at some great companies, including Uber, Figma, and Spatial. In my free time, I enjoy playing chess, learning languages (Korean, Spanish), building interesting maps, and trying good food of all kinds.
                </p>
              </Box>
              <Box sx={styles.iconContainer}>
                  <Link href="https://linkedin.com/in/matthewlee626" external>
                      <LinkedInIcon sx={{fontSize: '2em'}} />
                  </Link>
                  <Link href="https://github.com/matthewlee626" external>
                      <GitHubIcon sx={{fontSize: '2em'}} />
                  </Link>
                  <Link href="https://twitter.com/matthewlee626" external>
                      <TwitterIcon sx={{fontSize: '2em'}} />
                  </Link>
                  <Link href="https://instagram.com/matthewlee.626" external>
                      <InstagramIcon sx={{fontSize: '2em'}} />
                  </Link>
                  <Link href="/resume" external>
                      <InsertDriveFileIcon sx={{fontSize: '2em'}} />
                  </Link>
                </Box>
            </Box>

        </Box>
    )
}

export default Profile;
