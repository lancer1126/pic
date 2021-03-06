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
      <van-skeleton class="skeleton" avatar :row="3" :avatar-size="'42px'" :loading="loading">
        <Meta :artwork="artwork" />
      </van-skeleton>
      <van-divider />
      <keep-alive>
        <AuthorCard v-if="artwork.author" :id="artwork.author.id" :key="artwork.id" />
      </keep-alive>
      <van-divider />
      <keep-alive>
        <Related :artwork="artwork" :key="artwork.id" />
      </keep-alive>
    </div>
    <van-action-sheet
        v-model="ugoiraDownloadPanelShow"
        :actions="ugoiraDownloadPanelActions"
        @select="onUgoiraDownloadPanelSelect"
        cancel-text="取消"
        description="请选择下载格式"
        close-on-popstate
        close-on-click-action
    />
  </div>
</template>

<script>
import TopBar from "@/components/TopBar";
import ImageView from "@/views/Artwork/components/ImageView";
import Meta from "@/views/Artwork/components/Meta";
import AuthorCard from "@/views/Artwork/components/AuthorCard";
import Related from "@/views/Artwork/components/Related";
import api from "@/api";
import { mapGetters, mapState } from "vuex";
import { Divider, Skeleton,ActionSheet } from 'vant'
export default {
  name: 'Artwork',
  components: {
    ImageView,
    TopBar,
    Meta,
    AuthorCard,
    Related,
    [Divider.name]: Divider,
    [Skeleton.name]: Skeleton,
    [ActionSheet.name]: ActionSheet
  },
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
    $route () {
      if (this.$route.name === 'Artwork' && this.$route.params.id !== this.artwork.id)
        this.init()
    }
  },
  computed: {
    ...mapState(["galleryList", "currentIndex", "$swiper"]),
    ...mapGetters(["currentId", "isCensored"])
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
        }
      } else {
        this.$toast({
          message: res.msg,
          icon: require('@/svg/error.svg')
        })
        setTimeout(() => { this.$router.back()}, 500)
      }
    },
    init () {
      document.querySelector('.app-main').scrollTo({ top: 0, behavior: 'smooth' })
      this.loading = true
      let id = +this.$route.params.id
      this.artwork = {}
      this.getArtwork(id)
    },
    onUgoiraDownloadPanelSelect (item) {
      this.$refs.imgView.download(item.name)
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
