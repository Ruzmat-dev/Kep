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
import { TBoxType } from 'src/libs/types/responseTypes'
import { useGetOrganizations } from 'src/libs/organizations/useGetData'
import { TOptionSelect } from 'src/@elements/types'
import AutoCompleteAsync from 'src/@personal/components/AutoCompleteAsync'
import MultipleSelectAsync from 'src/@personal/components/MultipleSelectAsync'
import { useGetSupplierCategory } from 'src/libs/employes/useEmploye'

type Props = {
  setOpen: (value: boolean) => void
  refetch: () => void
}

type FormTypes = {
  name: string
  parent?: number
  organizations: number[]
}

const schema = yup.object({
  name: yup.string().required(),
  parent: yup.number(),
  organizations: yup.array(yup.number()).required()
})

const AddSuppCategory = ({ setOpen, refetch }: Props) => {
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
      await axiosInstance.post<TBoxType>(`/supplier-categories/`, data)
      toast.success(t('Success'))
      setOpen(false)
      refetch()
    } catch (error: any) {
      const vals: string[] = Object.values(error.response.data)
      toast.error(vals[0])
      console.log(error)
    }
  }
  const [searchCategory, setSearchCategory] = useState<string>()
  const [searchOrgan, setSearchOrgan] = useState<string>()

  const { data: cats, isLoading: catsLoading } = useGetSupplierCategory({ search: searchCategory })
  const { data: organs, isLoading: organsLoading } = useGetOrganizations({ search: searchOrgan })

  const categories: TOptionSelect[] = []
  const organizations: TOptionSelect[] = []
  cats?.results.forEach(item => categories.push({ title: item.name, value: item.id }))
  organs?.results.forEach(item => organizations.push({ title: item.name, value: item.id }))

  return (
    <>
      <Box sx={{ mb: 12 }}>
        <FormHeaderText label={t('Add supplier category')} />
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

        <Controller
          name='parent'
          control={control}
          render={({ field }) => (
            <AutoCompleteAsync
              value={field.value}
              setSearch={setSearchCategory}
              onChange={value => field.onChange(value?.value)}
              error={errors.parent?.message}
              title={t('Parent category')}
              loading={catsLoading}
              options={categories}
            />
          )}
        />

        <Controller
          name='organizations'
          control={control}
          render={({ field }) => (
            <MultipleSelectAsync
              values={field.value}
              setSearch={setSearchOrgan}
              onChange={value => field.onChange(value)}
              error={errors.organizations?.message}
              title={t('Organizations')}
              loading={organsLoading}
              options={organizations}
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

export default AddSuppCategory
