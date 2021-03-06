<template>
  <div class="illusts">
    <van-cell class="cell" :border="false" is-link @click="onClick()" v-if="once">
      <template #title>
        <span class="title">
          插画作品
          <span class="num" v-if="num">{{ num }}件作品</span>
        </span>
      </template>
    </van-cell>
    <van-list
      v-model="loading"
      :finished="finished" :finished-text="!once ? '没有更多了' : ''"
      :error.sync = "error"
      error-text="网络异常，点击重新加载"
      @load="getMemberArtwork()"
    >
      <div class="card-box">
        <div class="column">
          <ImageCard mode="cover" :artwork="art" @click-card="toArtwork($event)"
                     v-for="art in odd(artList)" :key="art.id"
          />
        </div>
        <div class="column">
          <ImageCard mode="cover" :artwork="art" @click-card="toArtwork($event)"
                     v-for="art in odd(artList)" :key="art.id"
          />
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
import { Cell, List } from 'vant'
import _ from 'lodash'
import api from '@/api'
import ImageCard from "@/components/ImageCard";
export default {
  name: 'AuthorIllusts',
  components: {
    [Cell.name]: Cell,
    [List.name]: List,
    ImageCard
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    num: {
      type: Number
    },
    once: {
      type: Boolean,
      default: false
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
    reset () {
      this.curPage = 1
      this.artList = []
    },
    onClick () {
      this.$emit('onClick')
    },
    getMemberArtwork: _.throttle(async function() {
      if (!this.id) return

      let newList;
      let res = await api.getMemberArtwork(this.id, this.curPage)
      if (res.status === 0) {
        newList = res.data
        if (this.once)
          newList = newList.slice(0, 10)
        let artList = JSON.parse(JSON.stringify(this.artList))
        artList.push(...newList)
        artList = _.uniqBy(artList, 'id')

        this.artList = artList
        this.loading = false
        this.curPage++
        if (this.once || this.curPage > 20)
          this.finished = true
      } else {
        this.$toast({
          message: res.msg
        })
        this.loading = false
        this.error = true
      }
    }, 5000),
    toArtwork (id) {
      this.$router.push({
        name: 'Artwork',
        params: {id, list: this.artList }
      })
    },
    odd (list) {
      return list.filter((_, index) => (index + 1) % 2)
    },
    even (list) {
      return list.filter((_, index) => !((index + 1)) % 2)
    }
  },
  mounted () {
    this.reset()
    this.getMemberArtwork()
  }
}
</script>

<style lang="stylus" scoped>
.illusts {
  .cell {
    padding: 10px 20px;
  }

  .num {
    float: right;
    font-size: 26px;
    color: #888
  }

  .card-box {
    padding: 0 12px;
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
