import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLocale from './en'
import zhLocale from './zh'
import adminToolkitLocale from '@ccprivate/admin-toolkit'
import locale from 'element-ui/lib/locale' // 引入element ui 语言包
Vue.use(VueI18n)
const messages = {
  en: {
    ...adminToolkitLocale.langMessages.en,
    ...enLocale
  },
  zh: {
    ...adminToolkitLocale.langMessages.zh,
    ...zhLocale
  }
}
const i18n = new VueI18n({
  locale: 'zh',
  messages
})
locale.i18n((key, value) => i18n.t(key, value))
export default i18n
