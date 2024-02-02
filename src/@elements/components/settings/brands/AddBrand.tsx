import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button } from '@mui/material'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import CustomTextField from 'src/@core/components/mui/text-field'
import { FormHeaderText } from 'src/@personal/components/FormElements'
import * as yup from 'yup'
import axiosInstance from 'src/services/axiosConfig'
import toast from 'react-hot-toast'
import { TBoxType } from 'src/libs/types/responseTypes'

type Props = {
  setOpen: (value: boolean) => void
  refetch: () => void
}

type FormTypes = {
  name: string
}

const schema = yup.object({
  name: yup.string().required()
})

const AddBrand = ({ setOpen, refetch }: Props) => {
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting }
  } = useForm<FormTypes>({
    resolver: yupResolver(schema)
  })

  const onSubmit: SubmitHandler<FormTypes> = async data => {
    try {
      await axiosInstance.post<TBoxType>(`/brands/`, data)
      toast.success(t('Success'))
      setOpen(false)
      refetch()
    } catch (error: any) {
      const vals: string[] = Object.values(error.response.data)
      toast.error(vals[0])
      console.log(error)
    }
  }

  return (
    <>
      <Box sx={{ mb: 12 }}>
        <FormHeaderText label={t('Add brand')} />
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomTextField
          sx={{ mb: 2 }}
          fullWidth
          required
          label={t('Name')}
          {...register('name')}
          error={!isValid && errors.name ? true : false}
          helperText={errors.name ? `${t('Name')} ${t(errors.name.type)}` : null}
          autoComplete='name'
        />

        <Box display={'flex'} justifyContent={'center'} gap={5} mt={10}>
          <Button onClick={() => setOpen(false)} type='button' variant='tonal' size='small'>
            {t('Cancel')}
          </Button>
          <Button disabled={isSubmitting} type='submit' variant='contained' size='small'>
            {isSubmitting ? t('Loading') : t('Save')}
          </Button>
        </Box>
      </form>
    </>
  )
}

export default AddBrand
