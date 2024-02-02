import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, FormControlLabel, Switch } from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import CustomTextField from 'src/@core/components/mui/text-field'
import { FormHeaderText } from 'src/@personal/components/FormElements'
import * as yup from 'yup'
import axiosInstance from 'src/services/axiosConfig'
import toast from 'react-hot-toast'
import { TPostWarehouseTypesResponse } from '../types'

type Props = {
  setOpen: (value: boolean) => void
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
  status: yup.bool().default(true)
})

const AddStorageType = ({ setOpen, refetch }: Props) => {
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
      await axiosInstance.post<TPostWarehouseTypesResponse>(`/warehouse-types/`, data)
      toast.success(t('Success'))
      setOpen(false)
      refetch()
    } catch (error: any) {
      if (error.response.data) {
        const val: string[] = Object.values(error.response.data)
        const key: string[] = Object.keys(error.response.data)

        //@ts-ignore
        setError(key[0][0], val[0])
      }

      console.log(error)
    }
  }

  return (
    <>
      <Box sx={{ mb: 12 }}>
        <FormHeaderText label={t('Add storage type')} />
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <CustomTextField
            sx={{ mb: 4 }}
            fullWidth
            required
            label={t('Name')}
            {...register('name')}
            error={!isValid && errors.name ? true : false}
            helperText={errors.name ? `${t('Name')} ${t('required')}` : null}
            autoComplete='name'
          />

          <CustomTextField
            sx={{ mb: 4 }}
            fullWidth
            label={t('Sequence number')}
            {...register('order_number')}
            error={!isValid && errors.order_number ? true : false}
            helperText={errors.order_number ? `${t('Sequence number')} ${t('required')}` : null}
            autoComplete='address'
          />

          <Controller
            name='status'
            control={control}
            defaultValue
            render={({ field }) => (
              <FormControlLabel
                label={t('Status')}
                checked={field.value}
                onChange={field.onChange}
                control={<Switch />}
              />
            )}
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

export default AddStorageType
