import { Fragment, useEffect, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import { useTranslation } from 'react-i18next'
import { TOptionSelect } from 'src/@elements/types'

type Props = {
  loading: boolean
  options: TOptionSelect[]
  title: string
  error?: string
  values?: number[]
  onChange: (value: number[]) => void
  setSearch: (value: string) => void
}

const MultipleSelectAsync = ({ loading, options, title, error, onChange, setSearch, values }: Props) => {
  const { t } = useTranslation()
  const [selectedValues, setSelectedValues] = useState<TOptionSelect[]>([])

  useEffect(() => {
    const arr: TOptionSelect[] = []

    values?.forEach(item => {
      options.forEach(k => {
        if (item === k.value) {
          arr.push(k)
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
      isOptionEqualToValue={(option, newValue) => option.value === newValue?.value}
      value={selectedValues}
      onChange={(_, newValue) => {
        const data = newValue.map(i => i.value)
        onChange(data)
        setSelectedValues(newValue)
      }}
      renderInput={params => (
        <CustomTextField
          {...params}
          label={t(title)}
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

    // <CustomAutocomplete
    //   multiple
    //   sx={{ width: 325 }}
    //   options={options}
    //   getOptionLabel={option => option.title || ''}
    //   isOptionEqualToValue={(option, newValue) => option.title === newValue?.title}
    //   value={selectedValues}
    //   onChange={(_, newValue) => onChange(newValue)}
    //   renderInput={params => (
    //     <CustomTextField
    //       {...params}
    //       label={title}
    //       error={error ? true : false}
    //       helperText={error}
    //       onChange={e => setSearch(e.target.value)}
    //       InputProps={{
    //         ...params.InputProps,
    //         endAdornment: (
    //           <Fragment>
    //             {loading ? <CircularProgress size={20} /> : null}
    //             {params.InputProps.endAdornment}
    //           </Fragment>
    //         )
    //       }}
    //     />
    //   )}
    // />
  )
}

export default MultipleSelectAsync

//   renderInput={params => <CustomTextField {...params} label='filterSelectedOptions' placeholder='Favorites' />}
// />
