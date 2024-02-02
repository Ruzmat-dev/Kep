import { Typography } from '@mui/material'
import Translations from 'src/layouts/components/Translations'

export const FormHeaderText = ({ label }: { label: string }) => (
  <Typography textAlign={'center'} textTransform={'uppercase'} fontWeight={600} color={'#7367F0'}>
    <Translations text={label} />
  </Typography>
)
