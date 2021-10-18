import Box from '@mui/material/Box';
import Link from '@mui/material/Link'
import Image from 'next/image';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const styles = {
    profileContainer: {
      width: '350px',
      padding: '0 25px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      textAlign: 'justify',
      '> h1': {
          margin: '1.8em 0 0.4em 0',
          fontSize: '1.6em',
      },
      '> p': {
          fontSize: '1.14em',
          ['@media only screen and (max-device-width: 800px) and (orientation: portrait)']: { // eslint-disable-line no-useless-computed-key
            textAlign: 'center',
        },
        ['@media (max-width: 1000px)']: { // eslint-disable-line no-useless-computed-key
            textAlign: 'center',
        },  
      }
    },
    iconContainer: {
        marginTop: '1em',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        'svg': {
            color: '#33507b'
        },
    },
    pfpImage: {
        width: '275px',
        height:'275px',
        background: 'url(/pfpMain.jpg) no-repeat',
        backgroundSize: 'contain',
        '&:hover, &:active': {
            background: 'url(/pfpAlt.jpg) no-repeat',
            backgroundSize: 'contain',
        }
    }
}

const Profile = () => {
    return (
        <Box sx={styles.profileContainer}>
            <Box sx={styles.pfpImage}>
            </Box>
            <h1>Matthew Lee</h1>
            <p>
                Hi there! 
                I'm a student at UC Berkeley, majoring in Computer Science and Data Science with a minor in Global Studies. 
                I’m broadly interested in all things HCI, web development, entrepreneurship, and design. 
                When I’m not building cool projects, I enjoy hiking, visiting museums, and watching basketball games.
            </p>
            <Box sx={styles.iconContainer}>
                <Link href="https://linkedin.com/in/matthewlee626">
                    <LinkedInIcon sx={{fontSize: '2em'}} />
                </Link>
                <Link href="https://github.com/matthewlee626">
                    <GitHubIcon sx={{fontSize: '2em'}} />
                </Link>
                <Link href="https://twitter.com/matthewlee626">
                    <TwitterIcon sx={{fontSize: '2em'}} />
                </Link>
                <Link href="https://instagram.com/matthewlee.626">
                    <InstagramIcon sx={{fontSize: '2em'}} />
                </Link>
            </Box>
        </Box>
    )
}

export default Profile;
