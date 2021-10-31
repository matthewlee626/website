import Box from '@mui/material/Box';
import Link from '@mui/material/Link'
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const styles = {
    iconContainer: {
        marginTop: '1em',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        'svg': {
            color: '#33507b'
        },
        gridColumnStart: '1',
        gridColumnEnd: '2',
        gridRowStart: '10',
        gridRowEnd: '11',
    },
}

const Socials = () => {
    return (
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
    )
}

export default Socials;