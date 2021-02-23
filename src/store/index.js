import Vue from 'vue'
import Vuex from 'vuex'
import {LocalStorage} from "@/utils/storage";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    themeColor: '#0196fa',
    galleryList: [],
    currentIndex: -1,
    $swiper: null,
    SETTING: LocalStorage.get('__PIXIV_SETTING', {
      r18: false,
      r18g: false
    })
  },
  getters: {
    currentId: state =>state.galleryList[state.currentIndex] ? state.galleryList[state.currentIndex].id : -1,
    isCensored: state => artwork => {
      if (artwork.x_restrict === 1) {
        return !state.SETTING.r18;
      } else if (artwork.x_restrict === 2) {
        return !state.SETTING.r18g;
      } else {
        return false;
      }
    }
  },
  mutations: {
    saveSETTING (state, obj) {
      state.SETTING = obj
      LocalStorage.set('__PIXIV_SETTING', state.SETTING)
    }
  }
})
