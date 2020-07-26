/** @jsx jsx */
import { jsx, Box } from 'theme-ui'

export const NameTile = props => (
    <Box
      {...props}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        ...props.sx
      }}
    />
  )