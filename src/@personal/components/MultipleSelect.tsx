import { Fragment, useEffect, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import { useTranslation } from 'react-i18next'

type TMyOption = {
  key: string
  title: string
}

type Props = {
  loading: boolean
  options: TMyOption[]
  title: string
  error?: string
  values: string[]
  onChange: (value: string[]) => void
}

const MultipleSelect = ({ loading, options, title, error, onChange, values }: Props) => {
  const { t } = useTranslation()
  const [selectedValues, setSelectedValues] = useState<TMyOption[]>([])

  useEffect(() => {
    const arr: TMyOption[] = []

    values?.forEach(item => {
      options.forEach(k => {
        if (item === k.key) {
          arr.push({
            key: k.key,
            title: k.title
          })
        }
      })
    })

    setSelectedValues(arr)
  }, [options, values])

  return (
    <CustomAutocomplete
      multiple
      sx={{ width: 325 }}
      options={options}
      getOptionLabel={option => option.title || ''}
      isOptionEqualToValue={(option, newValue) => option.key === newValue.key}
      value={selectedValues}
      onChange={(_, newValue) => {
        const data = newValue.map(i => i.key)
        onChange(data)
        setSelectedValues(newValue)
      }}
      renderInput={params => (
        <CustomTextField
          {...params}
          label={t(title)}
          error={error ? true : false}
          helperText={error}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {loading ? <CircularProgress size={20} /> : null}
                {params.InputProps.endAdornment}
              </Fragment>
            )
          }}
        />
      )}
    />
  )
}

export default MultipleSelect
