// ** React Import
import { useEffect, useState } from 'react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Import
import i18n from 'src/configs/i18n'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'
import { getLangIcon } from 'src/@core/utils/helpers'

interface Props {
  settings: Settings
  saveSettings: (values: Settings) => void
}

const LanguageDropdown = ({ settings, saveSettings }: Props) => {
  // ** Hook
  const [toggle, setToggle] = useState<'uz' | 'ru' | 'en'>('en')
  const handleLangItemClick = (lang: 'en' | 'ru' | 'uz') => {
    setToggle(lang)
    i18n.changeLanguage(lang)
  }

  // ** Change html `lang` attribute when changing locale

  useEffect(() => {
    document.documentElement.setAttribute('lang', i18n.language)
  }, [toggle])

  return (
    <OptionsMenu
      iconButtonProps={{ color: 'inherit' }}
      icon={<Icon fontSize='1.625rem' icon={getLangIcon(toggle)} />}
      menuProps={{ sx: { '& .MuiMenu-paper': { mt: 4.25, minWidth: 130 } } }}
      options={[
        {
          text: 'English',
          menuItemProps: {
            sx: { py: 2 },
            selected: toggle === 'en',
            onClick: () => {
              handleLangItemClick('en')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        },
        {
          text: 'Rus',
          menuItemProps: {
            sx: { py: 2 },
            selected: toggle === 'ru',
            onClick: () => {
              handleLangItemClick('ru')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        },
        {
          text: 'Uzbek',
          menuItemProps: {
            sx: { py: 2 },
            selected: toggle === 'uz',
            onClick: () => {
              handleLangItemClick('uz')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        }
      ]}
    />
  )
}

export default LanguageDropdown
