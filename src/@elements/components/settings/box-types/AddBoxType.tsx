import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, FormControlLabel, Switch } from '@mui/material'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import CustomTextField from 'src/@core/components/mui/text-field'
import { FormHeaderText } from 'src/@personal/components/FormElements'
import * as yup from 'yup'
import axiosInstance from 'src/services/axiosConfig'
import toast, { Toaster } from 'react-hot-toast'
import { TBoxType } from 'src/libs/types/responseTypes'

type Props = {
  setOpen: (value: boolean) => void
  refetch: () => void
}

type FormTypes = {
  name: string
  code: number
  short_name: string
  status: boolean
}

const schema = yup.object({
  name: yup.string().required(),
  code: yup.number().required(),
  short_name: yup.string(),
  status: yup.boolean().default(true)
})

const AddBoxType = ({ setOpen, refetch }: Props) => {
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting }
  } = useForm<FormTypes>({
    resolver: yupResolver(schema)
  })

  const onSubmit: SubmitHandler<FormTypes> = async data => {
    try {
      await axiosInstance.post<TBoxType>(`/box-types/`, data)
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
        <FormHeaderText label={t('Add box types')} />
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

        <CustomTextField
          sx={{ mb: 2 }}
          fullWidth
          label={t('Code')}
          {...register('code')}
          error={!isValid && errors.code ? true : false}
          helperText={errors.code ? `${t('Code')} ${t(errors.code.type)}` : null}
          autoComplete='code'
        />

        <CustomTextField
          sx={{ mb: 2 }}
          fullWidth
          label={t('Short name')}
          {...register('short_name')}
          error={!isValid && errors.short_name ? true : false}
          helperText={errors.short_name ? `${t('Extra')} ${t(errors.short_name.type)}` : null}
          autoComplete='short_name'
        />

        <Controller
          name='status'
          control={control}
          defaultValue
          render={({ field }) => (
            <FormControlLabel
              label={t('Status')}
              checked={field.value}
              onChange={field.onChange}
              control={<Switch />}
            />
          )}
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

      <Toaster />
    </>
  )
}

export default AddBoxType
