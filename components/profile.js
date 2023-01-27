import { Box} from '@chakra-ui/react'
import Link from 'next/link'; 
import Image from 'next/image';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const styles = {
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
        '&:hover, &:active': {
            background: 'url(/pfpAlt.jpg) no-repeat',
            backgroundSize: 'contain',
        }
    }
}

const Profile = () => {
    return (
        <Box sx={styles.profileContainer}>
            <Box sx={styles.pfpImage} />
            <h1>Matthew Lee</h1>
            <p>
                Hi there! 
                I'm Matthew, and I'm studying computer science and data science at the University of California, Berkeley.
            </p>
            <p>
                I'm currently a SWE intern at Figma. I also do HCI research.
            </p>
            <p>
            In my free time, I enjoy chess, museums, maps, basketball, and good food.
            </p>
            {/* <p>
              Want to reach out? Feel free to contact me at hello (at) matthewlee.xyz!
            </p> */}
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
                <Link href="/resume">
                    <InsertDriveFileIcon sx={{fontSize: '2em'}} />
                </Link>
            </Box>
        </Box>
    )
}

export default Profile;
