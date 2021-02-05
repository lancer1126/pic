<template>
  <div class="rank-card">
    <van-cell class="cell" :border="false" is-link to="/rank/daily">
      <template #title>
        <Icon class="icon crown" name="crown"></Icon>
        <span class="title">排行榜</span>
      </template>
    </van-cell>
    <div class="card-box">
    </div>
  </div>
</template>

<script>
import { Cell, Swipe, SwipeItem, Icon} from 'vant'
import api from '@/api'
import ImageCard from "../../../components/ImageCard";
export default {
  components: {
    ImageCard
  },
  data() {
    return {
      artList: []
    }
  },
  computed: {
    slides() {
      let artList = this.artList.slice(6, 11)
      return artList.map(art => {
        return {
          title: art.title,
          src: art.image[0].m
        }
      })
    }
  },
  methods: {
    async getRankList() {
    }
  }
}
</script>

<style lang="stylus" scoped>
.rank-card {
  padding: 0 14px;
  margin-bottom: 24px;

  .card-box {
    // padding: 0 12px;
    height: 365px;

    .swipe-wrap {
      height: 100%;
      border-radius: 20px;
      overflow: hidden;

      .swipe-item {
        &:last-child {
          .image-card {
            margin-right: 0;
          }
        }

        .image-card {
          // width: 50vw;
          font-size: 0;
          float: left;
          margin-right: 12px;
          border: 1px solid #ebebeb;
          border-radius: 18px;
          box-sizing: border-box;
          width: calc(100% - 12px);
          height: 100% !important;
        }

        .image-slide {
          border: 1px solid #ebebeb;
          border-radius: 18px;
          box-sizing: border-box;

          .link {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #efefef;

            &::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(#000, 0.6);
            }

            svg {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -55%);
              font-size: 20em;
            }

            div {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, 80%);
              font-size: 34px;
              text-align: center;
              white-space: nowrap;
            }
          }
        }

        &.more {
          .rank {
            display: flex;
            height: 100%;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
  }
}
</style>
