import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button } from '@mui/material'
import React, { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
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
}

const schema = yup.object({
  name: yup.string().required()
})

const EditBrand = ({ setOpen, selected, refetch }: Props) => {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isSubmitting }
  } = useForm<FormTypes>({
    resolver: yupResolver(schema)
  })

  const { data } = useGetBoxTypesById(selected?.id)
  useEffect(() => {
    if (data) {
      setValue('name', data.name)
    }
  }, [data, setValue])

  const onSubmit: SubmitHandler<FormTypes> = async data => {
    if (selected) {
      try {
        await axiosInstance.patch<TMeasurement>(`/brands/${selected.id}/`, data)
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

export default EditBrand
