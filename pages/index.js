import Box from '@mui/material/Box';

import Profile from '../components/profile'
import Works from '../components/works'

const styles = {
  rootContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '4em',

    ['@media only screen and (max-device-width: 800px) and (orientation: portrait)']: { // eslint-disable-line no-useless-computed-key
      flexDirection: 'column',
      alignItems: 'center',
    },
    ['@media (max-width: 1000px)']: { // eslint-disable-line no-useless-computed-key
      flexDirection: 'column',
      alignItems: 'center',
    },    
  },
  worksOrganizingContainer: {
    width: 'calc(100% - 350px)',
    minWidth: '350px',
    maxHeight: 'calc(100vh - 16em)',
    display: 'flex',
    flexDirection: 'column',
    margin: '-0.5em 0 0 0',
    gap: '2em 0',
    overflowY: 'auto',
    '::-webkit-scrollbar': {
      width: '10px',
    },
    '::-webkit-scrollbar-track': {
      background: '#eeeeee'
    },
    '::-webkit-scrollbar-thumb': {
      background: '#c4c4c4'
    },
    '::-webkit-scrollbar-thumb:hover': {
      background: '#b4b4b4'
    }
  }
}

const dummyData = [
  {
    image: '/blocker.svg',
    alt: 'test',
    title: 'Title',
    description: 'LLLLLLLLL',
    linkTo: 'https://google.com'
  },
  {
    image: '/blocker.svg',
    alt: 'test',
    title: 'Title',
    description: 'LLLLLLLLL',
    linkTo: 'https://google.com'
  },
  {
    image: '/blocker.svg',
    alt: 'test',
    title: 'Title',
    description: 'LLLLLLLLL',
    linkTo: 'https://google.com'
  },
  {
    image: '/blocker.svg',
    alt: 'test',
    title: 'Title',
    description: 'LLLLLLLLL',
    linkTo: 'https://google.com'
  },
  {
    image: '/blocker.svg',
    alt: 'test',
    title: 'Title',
    description: 'LLLLLLLLL',
    linkTo: 'https://google.com'
  },
  {
    image: '/blocker.svg',
    alt: 'test',
    title: 'Title',
    description: 'LLLLLLLLL',
    linkTo: 'https://google.com'
  },
]

const Home = ({projects, experiences}) => {
  return (
    <Box sx={styles.rootContainer}>
       <Profile />
       <Box sx={styles.worksOrganizingContainer}>
          <Works title={"Experiences"} works={experiences.data} />
          <Works title={"Projects"} works={projects.data} />
       </Box>
    </Box>
  )
}

export async function getStaticProps() {

  const projects = require('../public/data/projects.json');
  const experiences = require('../public/data/experiences.json');

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      projects,
      experiences,
    },
  }
}

export default Home;