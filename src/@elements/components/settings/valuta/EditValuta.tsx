import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Checkbox, FormControlLabel } from '@mui/material'
import React, { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import CustomTextField from 'src/@core/components/mui/text-field'
import { FormHeaderText } from 'src/@personal/components/FormElements'
import axiosInstance from 'src/services/axiosConfig'
import * as yup from 'yup'
import { TPostCurrencyResponse } from '../types'
import toast from 'react-hot-toast'
import { useGetValutaById } from 'src/libs/organizations/useGetValuta'
import { TCurrency } from 'src/libs/types/responseTypes'

type Props = {
  setOpen: (value: boolean) => void
  selected?: TCurrency
  refetch: () => void
}

type FormTypes = {
  name: string
  symbol: string
  side: string
  main: boolean
}

const schema = yup.object({
  name: yup.string().required(),
  symbol: yup.string().required(),
  side: yup.string().required(),
  main: yup.boolean().required()
})

const EditValuta = ({ setOpen, selected, refetch }: Props) => {
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

  const { data } = useGetValutaById(selected?.id)
  useEffect(() => {
    if (data) {
      setValue('name', data.name)
      setValue('symbol', data.symbol)
      setValue('side', data.side)
      setValue('main', data.main)
    }
  }, [data, setValue])
  const onSubmit: SubmitHandler<FormTypes> = async data => {
    if (selected) {
      try {
        await axiosInstance.patch<TPostCurrencyResponse>(`/currencies/${selected.id}/`, data)
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
        <FormHeaderText label={t('Edit Valuta')} />
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
          label={t('Symbol')}
          {...register('symbol')}
          error={!isValid && errors.symbol ? true : false}
          helperText={errors.symbol?.message}
          autoComplete='symbol'
        />

        <CustomTextField
          select
          defaultValue=''
          fullWidth
          {...register('side')}
          label={t('side')}
          id='custom-select-native'
          SelectProps={{ native: true }}
          error={!isValid && errors.side ? true : false}
          helperText={errors.side?.message}
        >
          <option value={'start'}>{t('start')}</option>
          <option value={'end'}>{t('end')}</option>
        </CustomTextField>

        <Controller
          name='main'
          control={control}
          render={({ field }) => (
            <FormControlLabel
              label={t('basic') ?? ''}
              control={<Checkbox onChange={field.onChange} checked={field.value ? true : false} name='main' />}
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

export default EditValuta
