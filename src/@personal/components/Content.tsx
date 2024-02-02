import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer
} from '@mui/material'
import { ReactNode } from 'react'
import Translations from 'src/layouts/components/Translations'

type TMyDrawer = {
  setOpen: (value: boolean) => void
  open: boolean
  children: ReactNode
}

export const MyDrawer = ({ open, children, setOpen }: TMyDrawer) => (
  <Drawer anchor='right' open={open} onClose={() => setOpen(false)}>
    <Box width={360} p={5}>
      {children}
    </Box>
  </Drawer>
)

type TConfirmModal = {
  setOpen: (value: boolean) => void
  open: boolean
  onChange: () => Promise<void>
  loading: boolean
  label?: string
  description: string
}
export const ConfirmModal = ({ open, setOpen, onChange, description, loading, label }: TConfirmModal) => (
  <Dialog
    open={open}
    disableEscapeKeyDown
    aria-labelledby='alert-dialog-title'
    aria-describedby='alert-dialog-description'
    onClose={() => setOpen(false)}
  >
    {label && (
      <DialogTitle textAlign={'center'} id='alert-dialog-title'>
        {label}
      </DialogTitle>
    )}
    <DialogContent>
      <DialogContentText textAlign={'center'} id='alert-dialog-description'>
        {description}
      </DialogContentText>
    </DialogContent>
    <DialogActions className='dialog-actions-dense'>
      <Button onClick={() => setOpen(false)}>
        <Translations text={'Cancel'} />
      </Button>
      <Button disabled={loading} onClick={onChange}>
        {loading ? <Translations text='Loading' /> : <Translations text='Delete' />}
      </Button>
    </DialogActions>
  </Dialog>
)
