import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import CustomTextField from 'src/@core/components/mui/text-field'
import { FormHeaderText } from 'src/@personal/components/FormElements'
import axiosInstance from 'src/services/axiosConfig'
import * as yup from 'yup'
import { TPostOrganizationResponse } from '../types'
import toast from 'react-hot-toast'
import { TOrganization } from 'src/libs/types/responseTypes'
import { useGetOrganById } from 'src/libs/organizations/useGetData'
import { useGetValuta } from 'src/libs/organizations/useGetValuta'
import AutoCompleteAsync from 'src/@personal/components/AutoCompleteAsync'

type Props = {
  setOpen: (value: boolean) => void
  selected?: TOrganization
  refetch: () => void
}

type FormTypes = Omit<TPostOrganizationResponse, 'id'>

const schema = yup.object({
  name: yup.string().required(),
  address: yup.string().required(),
  additional_info: yup.string(),
  phone_number: yup.string().required(),
  currency: yup.number().required()
})

const EditOrganization = ({ setOpen, selected, refetch }: Props) => {
  const { t } = useTranslation()
  const [search, setSearch] = useState<string>()

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid, isSubmitting }
  } = useForm<FormTypes>({
    resolver: yupResolver(schema)
  })

  const { data } = useGetOrganById(selected?.id)
  useEffect(() => {
    if (data) {
      setValue('name', data.name)
      setValue('address', data.address)
      setValue('additional_info', data.additional_info)
      setValue('phone_number', data.phone_number)
      {
        data.currency ? setValue('currency', data.currency.id) : null
      }
    }
  }, [data, setValue])

  const { data: currenciesData, isLoading: currenciesLoading } = useGetValuta({ search })

  const currencies: {
    value: number
    title: string
  }[] = []

  currenciesData?.results.forEach(item => currencies.push({ value: item.id, title: item.name }))

  const onSubmit: SubmitHandler<FormTypes> = async data => {
    if (selected) {
      try {
        await axiosInstance.patch<TPostOrganizationResponse>(`/organizations/${selected.id}/`, data)
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
        <FormHeaderText label={t('Edit Organization')} />
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomTextField
          sx={{ mb: 2 }}
          fullWidth
          required
          label={t('Name')}
          {...register('name')}
          error={!isValid && errors.name ? true : false}
          helperText={errors.name?.message}
          autoComplete='name'
        />

        <CustomTextField
          sx={{ mb: 2 }}
          fullWidth
          label={t('Address')}
          {...register('address')}
          error={!isValid && errors.address ? true : false}
          helperText={errors.address?.message}
          autoComplete='address'
        />

        <CustomTextField
          sx={{ mb: 2 }}
          fullWidth
          label={t('Additional info')}
          {...register('additional_info')}
          error={!isValid && errors.additional_info ? true : false}
          helperText={errors.additional_info?.message}
          autoComplete='additional-info'
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
              loading={currenciesLoading}
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
    </>
  )
}

export default EditOrganization
