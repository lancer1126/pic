import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Icon from 'vue-svg-icon/Icon'
import { Toast, Lazyload, ImagePreview } from "vant";

Vue.config.productionTip = false

Vue.use(Toast)
Vue.use(Lazyload)
Vue.use(Lazyload, {
  LazyComponent: true,
  loading: require('./svg/loading.svg')
})
Vue.use(ImagePreview)
Vue.component(`Icon`, Icon)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
