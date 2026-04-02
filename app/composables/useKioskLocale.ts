import { ref, computed } from 'vue'
import { type Language } from '~/types/language'
import { kioskTranslations } from '~/constants/kioskTranslations'

export const useKioskLocale = () => {
  const activeLanguage = useState('kiosk_active_language', () => 'en')
  
  const languages = useState<Language[]>('languages', () => [])

  const reloadLanguages = () => {
      if (!import.meta.client) return
      const saved = localStorage.getItem('sanitarium_languages')
      if (saved) {
          try {
              languages.value = JSON.parse(saved)
          } catch (e) {
              console.error('Error parsing languages', e)
              languages.value = []
          }
      } else {
          // Default fallback if nothing in localStorage
          languages.value = [
              { code: 'en', name: 'English' },
              { code: 'fil', name: 'Filipino' }
          ]
      }
  }

  const saveLanguages = (list: Language[]) => {
      languages.value = list
      if (import.meta.client) {
          localStorage.setItem('sanitarium_languages', JSON.stringify(list))
      }
  }

  // Initialize on client
  if (import.meta.client && languages.value.length === 0) {
      reloadLanguages()
  }

  const t = (key: string, params?: Record<string, any>) => {
    const keys = key.split('.')
    let result: any = kioskTranslations[activeLanguage.value] || kioskTranslations['en']
    
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k]
      } else {
        return key
      }
    }

    if (typeof result === 'string' && params) {
      Object.keys(params).forEach(p => {
        result = result.replace(`{${p}}`, params[p].toString())
      })
    }

    return result as string
  }

  return {
    activeLanguage,
    languages,
    reloadLanguages,
    saveLanguages,
    t
  }
}
