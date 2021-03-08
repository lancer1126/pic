<template>
  <div class="image-search">
    <van-uploader
      class="open-dialog"
      :before-read="beforeRead"
      :after-read="afterRead"
      :disabled="loading"
    >
      <Icon v-show="!loading" name="image" scale="3" />
      <div class="loading" v-show="loading"></div>
    </van-uploader>
    <div class="container" v-if="file">
      <div class="thumb">
        <img :src="file.content" :alt="file.file.name" />
      </div>
      <div class="result-list" v-if="resultList">
        <div
          class="result"
          @click="toArtwork(result.id)"
          v-for="result in resultList"
          :key="result.id"
        >
          <img class="thumb" :src="result.thumb" :alt="result.title" />
          <div class="meta">
            <h2 class="title" v-html="result.title"></h2>
            <div class="info pid">ID: {{result.id}}</div>
            <div class="info author" v-html="result.author"></div>
          </div>
          <div class="similarity">{{ result.similarity }}</div>
          <div class="low" v-if="result.similarity < 80" :style="{ opacity:(100-result.similarity)/100 }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Uploader } from 'vant'
import _ from 'lodash'

export default {
  components: {
    [Uploader.name]: Uploader
  },
  data() {
    return {
      file: null,
      loading: false,
      res: null
    }
  },
  computed: {
    resultList () {
      if (!this.res) return null

      let list = this.res.results.map(result => {
        return {
          id: result.data.pixiv_id,
          title: result.data.title,
          author: result.data.member_name,
          thumb: result.header.thumbnail,
          similarity: result.header.similarity
        }
      })

      list = _.uniqBy(list, 'id')
      list = _.orderBy(list, 'similarity', 'desc')
      return list
    }
  },
  methods: {
    reset () {
      this.file = null
    },
    beforeRead (file) {
      if (!file.type.startWith('image/')) {
        this.$toast("请选择图片文件")
        return false
      }
      return true
    },
    afterRead (file) {

    },
    toArtwork (id) {
      this.$router.push({
        name: 'Artwork',
        params: { id }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.image-search {
  .open-dialog {
    position: absolute;
    top: 10px;
    right: 46px;

    ::v-deep .van-uploader__wrapper--disabled {
      opacity: 1;
    }

    .loading {
      margin-top: -8px;
      margin-right: -8px;
      width: 3em;
      height: 3em;
      background: url('~@/svg/loading-1.svg');
      background-size: 100%;
    }
  }

  .container {
    position: absolute;
    top: 98px;
    width: 100%;
    background: #fff;

    > .thumb {
      position: absolute;
      top: 0;
      width: 100%;
      // height: 400px;
      height: 100%;
      margin: 0 auto;
      overflow: hidden;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(#fff, 0);
      }

      img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 110%;
        height: 110%;
        object-fit: cover;
        filter: blur(6px);
      }
    }

    .result-list {
      position: relative;
      // margin: 32px;
      margin: 20px 20px;
      max-height: 50vh;
      overflow-y: scroll;
      border-radius: 12px;

      &::-webkit-scrollbar {
        width: 0px;
        background: transparent;
      }

      .result {
        position: relative;
        display: flex;
        justify-content: space-between;
        height: 160px;
        margin-top: 20px;
        // padding: 12px;
        border-radius: 12px;
        overflow: hidden;
        box-sizing: border-box;
        background: rgba(#fff, 0.95);

        &:first-of-type {
          margin: 0;
        }

        .thumb {
          position: relative;
          margin: 0;
          margin-right: 20px;
          width: 30%;
          height: auto;
          object-fit: cover;
        }

        .meta {
          flex: 1;
          padding: 20px 0;

          .title {
            font-size: 30px;
            margin-bottom: 10px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 470px;
          }

          .info {
            font-size: 24px;
            line-height: 36px;
            color: #888;
            max-width: 300px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .similarity {
          position: absolute;
          right: 20px;
          height: 155px;
          margin-top: 5px;
          font-family: 'Dosis';
          font-size: 60px;
          font-weight: 600;
          line-height: 160px;
          text-align: right;
          color: #555;
          letter-spacing: 2px;
        }

        .low {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(#fff, 0.6);
          pointer-events: none;
        }
      }
    }
  }
}
</style>
