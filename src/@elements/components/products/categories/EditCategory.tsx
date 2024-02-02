import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, FormControlLabel, Switch } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import CustomTextField from 'src/@core/components/mui/text-field'
import { FormHeaderText } from 'src/@personal/components/FormElements'
import axiosInstance from 'src/services/axiosConfig'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { TCategory } from 'src/libs/types/paramsTypes'
import { useGetCategories, useGetCategoryById } from 'src/libs/products/useCategory'
import AutoCompleteAsync from 'src/@personal/components/AutoCompleteAsync'
import MultipleSelectAsync from 'src/@personal/components/MultipleSelectAsync'
import { useGetOrganizations } from 'src/libs/organizations/useGetData'
import { TOptionSelect } from 'src/@elements/types'

type Props = {
  setOpen: (value: boolean) => void
  selected?: TCategory
  refetch: () => void
}

type FormTypes = {
  name: string
  parent: number | null
  organizations: number[]
  brand_required: boolean
}

const schema = yup.object({
  name: yup.string().required(),
  parent: yup.number().nullable(),
  organizations: yup.array(yup.number()).required(),
  brand_required: yup.boolean().default(false)
})

const EditCategory = ({ setOpen, selected, refetch }: Props) => {
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

  const { data } = useGetCategoryById(selected?.id)
  useEffect(() => {
    if (data) {
      setValue('name', data.name)
      setValue('parent', data.parent ? data.parent.id : null)
      const orgs = data.organizations.map(item => item.id)
      setValue('organizations', orgs)
      setValue('brand_required', data.brand_required)
    }
  }, [data, setValue])

  const onSubmit: SubmitHandler<FormTypes> = async data => {
    if (selected) {
      try {
        await axiosInstance.patch(`/categories/${selected.id}/`, data)
        toast.success('Success!')
        setOpen(false)
        refetch()
      } catch (error) {
        console.log(error)
      }
    }
  }

  const [searchCategory, setSearchCategory] = useState<string>()
  const [searchOrgan, setSearchOrgan] = useState<string>()

  const { data: cats, isLoading: catsLoading } = useGetCategories({ search: searchCategory })
  const { data: organs, isLoading: organsLoading } = useGetOrganizations({ search: searchOrgan })

  const categories: TOptionSelect[] = []
  const organizations: TOptionSelect[] = []
  cats?.results.forEach(item => categories.push({ title: item.name, value: item.id }))
  organs?.results.forEach(item => organizations.push({ title: item.name, value: item.id }))

  return (
    <>
      <Box sx={{ mb: 12 }}>
        <FormHeaderText label={t('Edit category')} />
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

        <Controller
          name='brand_required'
          control={control}
          render={({ field }) => (
            <FormControlLabel
              {...field}
              onChange={(e, value) => field.onChange(value)}
              checked={field.value ? true : false}
              label={t('Brand') ?? ''}
              control={<Switch size='small' />}
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

export default EditCategory
