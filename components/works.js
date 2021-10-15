import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

const styles = {
    superContainer: {
        width: '100%',
        padding: '0 2em 0 4em',
        display: 'flex',
        flexDirection: 'column ',
        '> h2': {
            marginTop: '0',
        },
        ['@media only screen and (max-device-width: 800px) and (orientation: portrait)']: { // eslint-disable-line no-useless-computed-key
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '2em'
        },
        ['@media (max-width: 1000px)']: { // eslint-disable-line no-useless-computed-key
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '2em',
        },  
    },
    worksContainer: {
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: '2.5em 2.5em',
    }
}

const WorkCard = ({work}) => {
    return (
        <Card sx={{ width: '20em' }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={work.image}
                    alt={work.alt}
                />
                <CardContent>
                <Typography gutterBottom variant="h5" component="div" sx={{fontFamily: 'Lato', fontWeight: 'bold'}}>
                    {work.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{fontFamily: 'Lato', fontWeight: 'bold'}}>
                    {work.description}
                </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
  }

const Works = ({title, works}) => {
    return (
        <Box sx={styles.superContainer}>
            <h2>{title}</h2>
            <Box sx={styles.worksContainer}>
                {works && works.map((work) => (
                    <WorkCard work={work} />
                ))}
            </Box>
        </Box>
    )
}

export default Works;
