import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, FormControlLabel, Switch } from '@mui/material'
import React, { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import CustomTextField from 'src/@core/components/mui/text-field'
import { FormHeaderText } from 'src/@personal/components/FormElements'
import axiosInstance from 'src/services/axiosConfig'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { TMeasurement } from 'src/libs/types/responseTypes'
import { useGetBoxTypesById } from 'src/libs/settings/useGetBoxTypes'

type Props = {
  setOpen: (value: boolean) => void
  selected?: TMeasurement
  refetch: () => void
}

type FormTypes = {
  name: string
  code: number | null
  short_name: string
  status: boolean
}

const schema = yup.object({
  name: yup.string().required(),
  code: yup.number().nullable(),
  short_name: yup.string(),
  status: yup.boolean().default(true)
})

const EditBoxType = ({ setOpen, selected, refetch }: Props) => {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid, isSubmitting }
  } = useForm<FormTypes>({
    resolver: yupResolver(schema)
  })

  const { data } = useGetBoxTypesById(selected?.id)
  useEffect(() => {
    if (data) {
      setValue('name', data.name)
      setValue('code', data.code)
      setValue('short_name', data.short_name)
      setValue('status', data.status)
    }
  }, [data, setValue])

  const onSubmit: SubmitHandler<FormTypes> = async data => {
    if (selected) {
      try {
        await axiosInstance.patch<TMeasurement>(`/box-types/${selected.id}/`, data)
        toast.success('Success!')
        setOpen(false)
        refetch()
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <>
      <Box sx={{ mb: 12 }}>
        <FormHeaderText label={t('Edit box type')} />
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
    </>
  )
}

export default EditBoxType
