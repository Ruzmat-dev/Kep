import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import CustomTextField from 'src/@core/components/mui/text-field'
import { FormHeaderText } from 'src/@personal/components/FormElements'
import axiosInstance from 'src/services/axiosConfig'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { TMeasurement, TMeasurementRadio } from 'src/libs/types/responseTypes'
import { useGetMeasureRatioById, useGetMeasurements } from 'src/libs/settings/useGetMeasurements'
import AutoCompleteAsync from 'src/@personal/components/AutoCompleteAsync'

type Props = {
  setOpen: (value: boolean) => void
  selected?: TMeasurement
  refetch: () => void
}

type FormTypes = {
  ratio: number
  first_unit_measure: number
  second_unit_measure: number
}

const schema = yup.object({
  ratio: yup.number().required().min(0.1),
  first_unit_measure: yup.number().required(),
  second_unit_measure: yup.number().required()
})

const EditRatio = ({ setOpen, selected, refetch }: Props) => {
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

  const { data } = useGetMeasureRatioById(selected?.id)
  useEffect(() => {
    if (data) {
      setValue('ratio', data.ratio)
      setValue('first_unit_measure', data.first_unit_measure.id)
      setValue('second_unit_measure', data.second_unit_measure.id)
    }
  }, [data, setValue])

  const onSubmit: SubmitHandler<FormTypes> = async data => {
    if (selected) {
      try {
        await axiosInstance.patch<TMeasurementRadio>(`/unit-measures-ratios/${selected.id}/`, data)
        toast.success('Success!')
        setOpen(false)
        refetch()
      } catch (error) {
        console.log(error)
      }
    }
  }

  const [search, setSearch] = useState<string>()

  const { data: measurements, isLoading } = useGetMeasurements({ search })

  const measures: {
    title: string
    value: number
  }[] = []

  measurements?.results.forEach(item => {
    measures.push({
      title: item.name,
      value: item.id
    })
  })

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
          label={t('Ratio')}
          type='number'
          {...register('ratio')}
          error={!isValid && errors.ratio ? true : false}
          helperText={errors.ratio?.message}
          autoComplete='ratio'
        />

        <Controller
          name='first_unit_measure'
          control={control}
          render={({ field }) => (
            <AutoCompleteAsync
              value={field.value}
              setSearch={setSearch}
              onChange={value => field.onChange(value?.value)}
              error={errors.first_unit_measure?.message}
              title={t('first_unit_measure')}
              loading={isLoading}
              options={measures}
            />
          )}
        />

        <Controller
          name='second_unit_measure'
          control={control}
          render={({ field }) => (
            <AutoCompleteAsync
              value={field.value}
              setSearch={setSearch}
              onChange={value => field.onChange(value?.value)}
              error={errors.second_unit_measure?.message}
              title={t('second_unit_measure')}
              loading={isLoading}
              options={measures}
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

export default EditRatio
