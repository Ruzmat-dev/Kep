import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, FormControlLabel, Radio, RadioGroup } from '@mui/material'
import React, { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import CustomTextField from 'src/@core/components/mui/text-field'
import { FormHeaderText } from 'src/@personal/components/FormElements'
import * as yup from 'yup'
import axiosInstance from 'src/services/axiosConfig'
import toast, { Toaster } from 'react-hot-toast'
import { TBoxType } from 'src/libs/types/responseTypes'
import { TOptionSelect } from 'src/@elements/types'
import AutoCompleteAsync from 'src/@personal/components/AutoCompleteAsync'
import { useGetSupplierCategory } from 'src/libs/employes/useEmploye'
import axios, { AxiosError } from 'axios'

type Props = {
  setOpen: (value: boolean) => void
  refetch: () => void
}

type FormTypes = {
  supplier_type: string
  company_name: string
  stir: number
  address: string
  phone_number: string
  note: string
  category: number
  legal_entity: number
}

const schema = yup.object({
  supplier_type: yup.string().oneOf(['legal_entity', 'natural_person']).default('legal_entity'),
  company_name: yup.string().required(),
  stir: yup.number().required(),
  address: yup.string().required(),
  phone_number: yup.string().required(),
  note: yup.string().required(),
  category: yup.number().required(),
  legal_entity: yup.number().default(1)
})

const AddSupplier = ({ setOpen, refetch }: Props) => {
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isValid, isSubmitting }
  } = useForm<FormTypes>({
    resolver: yupResolver(schema)
  })

  const onSubmit: SubmitHandler<FormTypes> = async data => {
    try {
      await axiosInstance.post<TBoxType>(`/suppliers/`, data)
      toast.success(t('Success'))
      setOpen(false)
      refetch()
    } catch (error: any) {
      // If the API call results in an error (e.g., 400 Bad Request)
      if (axios.isAxiosError(error)) {
        const apiError = (error as AxiosError).response?.data

        // Loop through the API error details and set errors for corresponding form fields
        if (apiError) {
          Object.entries(apiError).forEach(([field, message]) => {
            // @ts-ignore
            setError(field as string, {
              type: 'manual',
              message: message as string // You can customize the error message based on your API response
            })
          })
        }
      } else {
        // Handle other types of errors (e.g., network issues)
        console.error('Error:', error.message)
      }
    }
  }
  const [searchCategory, setSearchCategory] = useState<string>()

  const { data: cats, isLoading: catsLoading } = useGetSupplierCategory({ search: searchCategory })

  const categories: TOptionSelect[] = []
  cats?.results.forEach(item => categories.push({ title: item.name, value: item.id }))

  return (
    <>
      <Box sx={{ mb: 12 }}>
        <FormHeaderText label={t('Add supplier')} />
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomTextField
          sx={{ mb: 2 }}
          fullWidth
          required
          label={t('Company name')}
          {...register('company_name')}
          error={!isValid && errors.company_name ? true : false}
          helperText={errors.company_name?.message}
          autoComplete='name'
        />

        <Controller
          control={control}
          name='supplier_type'
          render={({ field }) => (
            <RadioGroup row defaultValue={'legal_entity'} onChange={(e, value) => field.onChange(value)}>
              <FormControlLabel value='legal_entity' control={<Radio />} label={t('Legal entity')} />
              <FormControlLabel value='natural_person' control={<Radio />} label={t('Natural person')} />
            </RadioGroup>
          )}
        />

        <CustomTextField
          sx={{ mb: 2 }}
          type='number'
          inputMode='numeric'
          fullWidth
          required
          label={t('STIR')}
          {...register('stir')}
          error={!isValid && errors.stir ? true : false}
          helperText={errors.stir?.message}
          autoComplete='stire'
        />

        <CustomTextField
          sx={{ mb: 2 }}
          fullWidth
          required
          label={t('Address')}
          {...register('address')}
          error={!isValid && errors.address ? true : false}
          helperText={errors.address?.message}
          autoComplete='address'
        />

        <CustomTextField
          sx={{ mb: 2 }}
          fullWidth
          required
          label={t('Phone')}
          {...register('phone_number')}
          error={!isValid && errors.phone_number ? true : false}
          helperText={errors.phone_number?.message}
          autoComplete='phone_number'
        />

        <CustomTextField
          sx={{ mb: 2 }}
          fullWidth
          required
          label={t('Note')}
          {...register('note')}
          error={!isValid && errors.note ? true : false}
          helperText={errors.note?.message}
          autoComplete='note'
        />

        <Controller
          name='category'
          control={control}
          render={({ field }) => (
            <AutoCompleteAsync
              value={field.value}
              setSearch={setSearchCategory}
              onChange={value => field.onChange(value?.value)}
              error={errors.category?.message}
              title={t('Category')}
              loading={catsLoading}
              options={categories}
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

export default AddSupplier
