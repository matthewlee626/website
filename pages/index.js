import Profile from '../components/profile'
import { Box } from '@chakra-ui/react'
const styles = {
  rootContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '4em',
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
    ['@media only screen and (max-device-width: 800px) and (orientation: portrait)']: { // eslint-disable-line no-useless-computed-key
      overflowY: 'initial'
    },
    ['@media (max-width: 1000px)']: { // eslint-disable-line no-useless-computed-key
      overflowY: 'initial'
    },    
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

const Home = () => {
  return (
    <Box sx={styles.rootContainer}>
       <Profile />
    </Box>
  )
}

export default Home;
