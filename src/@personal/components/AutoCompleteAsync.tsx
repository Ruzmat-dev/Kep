import { Fragment, useState, useEffect } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import { useTranslation } from 'react-i18next'

type TOptions = {
  title: string
  value: number
}

type Props = {
  loading: boolean
  options: TOptions[]
  title: string
  error?: string
  value?: number | null
  onChange: (value: TOptions | null) => void
  setSearch: (value: string) => void
}

const AutoCompleteAsync = ({ loading, options, title, error, onChange, value, setSearch }: Props) => {
  // ** States
  const { t } = useTranslation()
  const [open, setOpen] = useState<boolean>(false)
  const [selectedValue, setSelectedValue] = useState<TOptions | null>(null)

  useEffect(() => {
    // Update the selected value when the `value` prop changes
    const newValue = options.find(item => item.value === value)
    setSelectedValue(newValue || null)
  }, [options, value])

  return (
    <CustomAutocomplete
      open={open}
      options={options}
      loading={loading}
      sx={{ mb: 2 }}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      loadingText={t('Loading')}
      noOptionsText={t('No data')}
      getOptionLabel={option => option.title || ''}
      value={selectedValue}
      onChange={(_, newValue) => {
        setSelectedValue(newValue)
        onChange(newValue)
      }}
      isOptionEqualToValue={(option, newValue) => option.title === newValue?.title}
      renderInput={params => (
        <CustomTextField
          {...params}
          label={title}
          error={error ? true : false}
          helperText={error}
          onChange={e => setSearch(e.target.value)}
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

export default AutoCompleteAsync
