<template>
  <div class="related">
    <van-cell class="cell" :border="false">
      <template #title>
        <Icon class="icon heart" name="heart"></Icon>
        <span class="title">相关作品</span>
      </template>
    </van-cell>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了"
              :error.sync="error" error-text="网络异常，请重新加载" @load="getRelated()">
      <div class="card-box">
        <div class="column">
          <ImageCard mode="cover" v-for="art in odd(artList)" :key="art.id"
                     :artwork="art" @click-card="toArtwork($event)"
          />
        </div>
        <div class="column">
          <ImageCard mode="cover" v-for="art in even(artList)" :key="art.id"
                     :artwork="art" @click-card="toArtwork($event)"
          />
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
import { Cell, List, Icon } from 'vant'
import api from '@/api'
import _ from 'lodash'
import ImageCard from "@/components/ImageCard";

export default {
  name: 'Related',
  components: {
    ImageCard,
    [Cell.name]: Cell,
    [List.name]: List,
    [Icon.name]: Icon
  },
  props: {
    artwork: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      curPage: 1,
      artList: [],
      error: false,
      loading: false,
      finished: false
    }
  },
  methods: {
    odd (list) {
      return list.filter((_, index) => (index + 1) % 2)
    },
    even (list) {
      return list.filter((_, index) => !((index + 1) % 2))
    },
    toArtwork (id) {
      this.$router.push({
        name: 'Artwork',
        params: {id, list: this.artList }
      })
    },
    getRelated: _.throttle(async function() {
      if (!this.artwork.id) return
      let newList
      let res = await api.getRelated(this.artwork.id, this.curPage)
      if (res.status === 0) {
        newList = res.data
        let artList = JSON.parse(JSON.stringify(this.artList))

        artList.push(...newList)
        artList = _.uniqBy(artList, 'id')

        this.artList = artList
        this.loading = false
        this.curPage++
        if (this.curPage > 5) this.finished = true
      } else {
        this.$toast({ message: res.msg })
        this.loading = false
        this.error = true
      }
    }, 5000),
    reset () {
      this.curPage = 1
      this.artList = []
    }
  },
  mounted() {
    this.reset()
    this.getRelated()
  }
}
</script>

<style lang="stylus" scoped>
.related {
  .cell {
    padding: 0 8px 20px 8px
  }

  .card-box {
    display: flex;
    flex-direction: row;

    .column {
      width: 50%;

      .image-card {
        max-height: 360px;
        margin: 4px 2px;
      }
    }
  }
}
</style>