/**
 * Created by zuozhuo on 2017/8/22.
 */
'use strict'
import Vue from 'vue';
import VueI18n from 'vue-i18n'
import messages from './locale'

Vue.use(VueI18n);

// https://github.com/egoist/vue-timeago/tree/master/locales
const TIMEAGO_LOCALE_MAP = {
  'en': 'en-US',
  'zh': 'zh-CN',
  'tw': 'zh-TW',
  'ja': 'ja-JP',
};
// https://github.com/tradingview/charting_library/wiki/Localization
const TRADING_VIEW_LOCALE_MAP = {
  'en': 'en',
  'zh': 'zh',
  'tw': 'zh_TW',
  'ja': 'ja',
};

/**
 * 获取浏览器的语言
 * @returns {*}
 */
function getLangFromBrowser() {
  const defaultLang = 'en';
  let lang = navigator.languages ? (navigator.languages[0] || defaultLang) : defaultLang;
  if (navigator.language) {
    lang = navigator.language
  }
  if (navigator.userLanguage) {
    lang = navigator.userLanguage
  }
  lang = lang.toLowerCase();
  for (let [k, v] of Object.entries(TIMEAGO_LOCALE_MAP)) {
    k = k.toLowerCase();
    v = v.toLowerCase();
    if (k === lang || v === lang) {
      return k;
    }
  }
  return defaultLang;
}


const DEFAULT_LANG = getLangFromBrowser();
const i18n = new VueI18n({
  locale: DEFAULT_LANG, // 设置初始语言
  fallbackLocale: DEFAULT_LANG, // 未找到对应语言时的默认语言
  messages
});
i18n.DEFAULT_LANG = DEFAULT_LANG;

function getTextByLang(textJsonDict) {
  
const lang = i18n.locale;
  return textJsonDict[lang];
}

// 导出一个i18n的对象
export default i18n;
export {
  TIMEAGO_LOCALE_MAP,
  TRADING_VIEW_LOCALE_MAP,
  getTextByLang,
}
