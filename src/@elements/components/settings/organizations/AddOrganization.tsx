import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button } from '@mui/material'
import React, { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import CustomTextField from 'src/@core/components/mui/text-field'
import { FormHeaderText } from 'src/@personal/components/FormElements'
import * as yup from 'yup'
import axiosInstance from 'src/services/axiosConfig'
import toast, { Toaster } from 'react-hot-toast'
import { TPostOrganizationResponse } from '../types'
import AutoCompleteAsync from 'src/@personal/components/AutoCompleteAsync'
import { useGetValuta } from 'src/libs/organizations/useGetValuta'

type Props = {
  setOpen: (value: boolean) => void
  refetch: () => void
}

type FormTypes = {
  name: string
  address: string
  additional_info: string
  phone_number: string
  currency: number
}

const schema = yup.object({
  name: yup.string().required(),
  address: yup.string().required(),
  additional_info: yup.string(),
  phone_number: yup.string().matches(/^\+\d{12}$/, 'Phone Number format: +998XXXXXXXXX'),
  currency: yup.number().required()
})

const AddOrganization = ({ setOpen, refetch }: Props) => {
  const { t } = useTranslation()
  const [search, setSearch] = useState<string>()

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
      await axiosInstance.post<TPostOrganizationResponse>(`/organizations/`, data)
      toast.success(t('Success'))
      setOpen(false)
      refetch()
    } catch (error: any) {
      const vals: string[] = Object.values(error.response.data)
      toast.error(vals[0])
      console.log(error)
    }
  }

  const { data, isLoading } = useGetValuta({ search })

  const currencies: {
    title: string
    value: number
  }[] = []

  data?.results.forEach(item => {
    currencies.push({
      title: item.name,
      value: item.id
    })
  })

  return (
    <>
      <Box sx={{ mb: 12 }}>
        <FormHeaderText label={t('AddOrganization')} />
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomTextField
          sx={{ mb: 2 }}
          fullWidth
          required
          label={t('Organization name')}
          {...register('name')}
          error={!isValid && errors.name ? true : false}
          helperText={errors.name ? `${t('Organization name')} ${t('required')}` : null}
          autoComplete='name'
        />

        <CustomTextField
          sx={{ mb: 2 }}
          fullWidth
          label={t('Address')}
          {...register('address')}
          error={!isValid && errors.address ? true : false}
          helperText={errors.address ? `${t('Address')} ${t('required')}` : null}
          autoComplete='address'
        />

        <CustomTextField
          sx={{ mb: 2 }}
          fullWidth
          label={t('Extra')}
          {...register('additional_info')}
          error={!isValid && errors.additional_info ? true : false}
          helperText={errors.additional_info ? `${t('Extra')} ${t(errors.additional_info.type)}` : null}
          autoComplete='extra'
        />

        <CustomTextField
          sx={{ mb: 2 }}
          fullWidth
          label={t('Phone number')}
          {...register('phone_number')}
          error={!isValid && errors.phone_number ? true : false}
          helperText={errors.phone_number?.message}
          autoComplete='phone'
        />

        <Controller
          name='currency'
          control={control}
          render={({ field }) => (
            <AutoCompleteAsync
              value={field.value}
              setSearch={setSearch}
              onChange={value => field.onChange(value?.value)}
              error={errors.currency?.message}
              title={t('Currency')}
              loading={isLoading}
              options={currencies}
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

export default AddOrganization
