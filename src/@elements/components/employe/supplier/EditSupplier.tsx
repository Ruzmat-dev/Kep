import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, FormControlLabel, Radio, RadioGroup } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import CustomTextField from 'src/@core/components/mui/text-field'
import { FormHeaderText } from 'src/@personal/components/FormElements'
import axiosInstance from 'src/services/axiosConfig'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { TCategory } from 'src/libs/types/paramsTypes'
import AutoCompleteAsync from 'src/@personal/components/AutoCompleteAsync'
import { TOptionSelect } from 'src/@elements/types'
import { useGetSupplierCategory } from 'src/libs/employes/useEmploye'
import { useGetSupplierById } from 'src/libs/employes/useSupplier'

type Props = {
  setOpen: (value: boolean) => void
  selected?: TCategory
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

const EditSupplier = ({ setOpen, selected, refetch }: Props) => {
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

  const { data } = useGetSupplierById(selected?.id)
  useEffect(() => {
    if (data) {
      setValue('company_name', data.company_name)
      setValue('supplier_type', data.supplier_type)
      setValue('stir', data.stir)
      setValue('address', data.address)
      setValue('category', data.category.id)
      setValue('phone_number', data.phone_number)
      setValue('note', data.note)
      setValue('legal_entity', data.legal_entity.id)
    }
  }, [data, setValue])

  const onSubmit: SubmitHandler<FormTypes> = async data => {
    if (selected) {
      try {
        await axiosInstance.patch(`/suppliers/${selected.id}/`, data)
        toast.success('Success!')
        setOpen(false)
        refetch()
      } catch (error) {
        console.log(error)
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
        <FormHeaderText label={t('Edit supplier category')} />
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
    </>
  )
}

export default EditSupplier
