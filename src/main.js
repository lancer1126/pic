import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Icon from 'vue-svg-icon/Icon.vue'
import Moment from 'vue-moment'
import '@vant/touch-emulator'
import VueAwesomeSwiper from "vue-awesome-swiper";
import VCalendar from 'v-calendar'
import { Toast, Lazyload, ImagePreview } from "vant";

import './polyfill'
import 'swiper/css/swiper.css'
import '@/assets/css/base.styl'

Vue.use(Moment)
Vue.use(Toast)
Vue.use(ImagePreview)
Vue.use(VueAwesomeSwiper)
Vue.use(VCalendar)
Vue.use(Lazyload, {
  LazyComponent: true,
  loading: require('./svg/loading.svg')
})

Vue.component('Icon', Icon)

Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
