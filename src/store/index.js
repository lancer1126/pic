import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    themeColor: '#0196fa',
    galleryList: [],
    currentIndex: -1,
  },
  getters: {
    currentId: state =>state.galleryList[state.currentIndex] ? state.galleryList[state.currentIndex].id : -1
  }
})
