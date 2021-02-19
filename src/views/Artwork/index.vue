<template>
  <div class="artwork">
    <TopBar />
    <div v-if="artwork">
      <ImageView
          :artwork="artwork"
          :lazy="true"
          ref="imgView"
          @open-download="ugoiraDownloadPanelShow = true"
      />
    </div>
  </div>
</template>

<script>
import TopBar from "@/components/TopBar";
import ImageView from "@/views/Artwork/components/ImageView";
import api from "@/api";
import {mapGetters} from "vuex";
export default {
  name: 'Artwork',
  components: {ImageView, TopBar},
  data() {
    return {
      loading: false,
      artwork: {},
      options: {
        loop: true,
        thresholdTime: 5000,
        thresholdDistance: 150
      },
      ugoiraDownloadPanelShow: false,
      ugoiraDownloadPanelActions: [
        { name: "ZIP", subname: "原始序列帧归档文件" },
        { name: "GIF", subname: "低画质，兼容性最佳" },
        { name: "WebM", subname: "高画质，兼容性差" } // chrome only
      ]
    }
  },
  watch: {

  },
  computed: {
    ...mapGetters(['isCensored'])
  },
  methods: {
    async getArtwork (id) {
      let res = await api.getArtwork(id)
      if (res.status === 0) {
        this.artwork = res.data
        this.loading = false

        if (this.isCensored(this.artwork)) {
          this.$toast({
            message: '根据当前设置，内容不予显示',
            icon: require('@/svg/ban-view.svg')
          })
          setTimeout(() => {}, 5000)
        } else {
          this.$toast({
            message: res.msg,
            icon: require('@/svg/error.svg')
          })
          setTimeout(() => { this.$router.back()}, 500)
        }
      }
    },
    init () {
      document.querySelector('.app-main').scrollTo({ top: 0, behavior: 'smooth' })
      this.loading = true
      let id = +this.$route.params.id
      this.artwork = {}
      this.getArtwork(id)
    }
  },
  mounted() {
    this.init()
  },
  updated() {}
}
</script>

<style lang="stylus" scoped>
.artwork {
  .skeleton {
    margin: 30px 0;
  }
}
</style>