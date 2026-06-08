import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { storageService } from '@/services/storage'

import en from './en.json'
import zh from './zh.json'

void i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      zh: {
        translation: zh,
      },
    },
    lng: (function () {
      const storageValue = storageService.getLanguage()
      if (storageValue === 'en' || storageValue === 'zh') return storageValue
      return navigator.language?.startsWith('zh-') ? 'zh' : 'en'
    })(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })
  .then(() => {
    applyLanguageToDocument(i18n.language)
  })

export function setLanguage(lang: 'en' | 'zh') {
  void i18n.changeLanguage(lang).then(() => {
    applyLanguageToDocument(lang)
    storageService.setLanguage(lang)
  })
}

function applyLanguageToDocument(lang: string) {
  if (lang === 'zh') {
    document.documentElement.lang = 'zh-CN'
    document.title = '在线简历生成工具'
  } else {
    document.documentElement.lang = 'en-US'
    document.title = 'Resume Builder'
  }
}

export function isChineseLanguage() {
  return i18n.language === 'zh'
}
