import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

function loadLocaleMessages () {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  console.log(locales)
  console.log(locales.keys())
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  console.log('messages', messages)
  return messages
}
console.log('process.env.VUE_APP_I18N_LOCALE', process.env.VUE_APP_I18N_LOCALE)
console.log('process.env.VUE_APP_I18N_FALLBACK_LOCALE', process.env.VUE_APP_I18N_FALLBACK_LOCALE)
export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages()
})
