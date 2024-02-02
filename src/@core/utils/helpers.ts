export const getLangIcon = (lang: 'uz' | 'ru' | 'en') => {
  switch (lang) {
    case 'uz':
      return 'emojione:flag-for-uzbekistan'
    case 'en':
      return 'circle-flags:gb'
    case 'ru':
      return 'emojione:flag-for-russia'
    default:
      return 'clarity:language-line'
  }
}
