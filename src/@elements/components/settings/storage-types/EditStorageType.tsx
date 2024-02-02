import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, FormControlLabel, Switch } from '@mui/material'
import React, { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import CustomTextField from 'src/@core/components/mui/text-field'
import { FormHeaderText } from 'src/@personal/components/FormElements'
import axiosInstance from 'src/services/axiosConfig'
import * as yup from 'yup'
import { TPostWarehouseTypesResponse } from '../types'
import toast from 'react-hot-toast'
import { useGetStorageTypeById } from 'src/libs/storage-types/useGetData'

type Props = {
  setOpen: (value: boolean) => void
  selected?: TPostWarehouseTypesResponse | undefined
  refetch: () => void
}

type FormTypes = {
  name: string
  order_number: number
  status: boolean
}

const schema = yup.object({
  name: yup.string().required(),
  order_number: yup.number().required(),
  status: yup.boolean()
})

const EditStorageType = ({ setOpen, selected, refetch }: Props) => {
  const { t } = useTranslation()
  const { data } = useGetStorageTypeById(selected?.id)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isSubmitting }
  } = useForm<FormTypes>({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (data) {
      setValue('name', data.name)
      setValue('order_number', data.order_number)
      setValue('status', data.status)
    }
  }, [data, setValue])
  const onSubmit: SubmitHandler<FormTypes> = async data => {
    if (selected) {
      try {
        await axiosInstance.patch<TPostWarehouseTypesResponse>(`/warehouse-types/${selected.id}/`, data)
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
        <FormHeaderText label={t('Add Valuta')} />
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
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

          <Controller
            control={control}
            name='status'
            render={({ field }) => (
              <FormControlLabel
                control={<Switch />}
                label=''
                onChange={field.onChange}
                checked={field.value || false}
              />
            )}
          />

          <CustomTextField
            sx={{ mb: 2 }}
            fullWidth
            required
            label={t('Sequence number')}
            {...register('order_number')}
            error={!isValid && errors.order_number ? true : false}
            helperText={errors.order_number?.message}
            autoComplete='order_number'
          />
        </Box>

        <Box display={'flex'} justifyContent={'center'} gap={5} mt={10}>
          <Button onClick={() => setOpen(false)} type='button' variant='tonal' size='small' sx={{ p: '10px' }}>
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

export default EditStorageType
