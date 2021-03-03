<template>
  <div class="search">
    <form class="search-bar-wrap" :class="{ dropdown: focus}" action="/">
      <van-search
        class="search-bar"
        v-model="keywords"
        shape="round"
        placeholder="请输入搜索关键词"
        maxlength="50"
        @search="onBlur(true)"
        @cancel="oncancel"
        @focus="onfocus"
        @blur="onBlur(false)"
      ></van-search>

    </form>
  </div>
</template>

<script>
import Tags from "@/views/Search/components/Tags";
import { Search } from 'vant'
export default {
  components: {
    Tags,
    [Search.name]: Search
  },
  data() {
    return {
      scrollTop: 0,
      keywords_: "",
      keywords: "",
      keywordsList: [],
      lastWord: "",
      focus: false,
      curPage: 1,
      artList: [],
      error: false,
      loading: false,
      finished: false,
      maskShow: false,
      imageSearchShow: true
    }
  },
  methods: {
    reset () {
      this.curPage = 1
      this.artList = []
      this.loading = false
      this.finished = false
    },
    onBlur (flag) {
      let keywords = `${this.keywords} `.replace(/\s\s+/g, " "); // 去除多余空格

      this.keywords = keywords
      this.$nextTick(() => {
        this.$refs.words.scrollLeft = this.$refs.words.clientWidth
      })

      if (/^\d+$/.test(keywords.trim())) {
        this.$router.push({
          name: "Artwork",
          params: {
            id: keywords.trim()
          }
        });
        this.keywords = "";
        this.keywordsList = [];
        this.lastWord = "";
        return;
      }

      if (flag) {
        this.focus = false
        if (this.keywords_ === keywords) {
          return false
        } else {
          this.reset()
        }
      }
    }
  }
}
</script>



<style lang="stylus" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.search {
  position: relative;

  .search-bar-wrap {
    position: fixed;
    top: 60px;
    top: env(safe-area-inset-top);
    width: 100%;
    max-width: 10rem;
    // min-height: 122px;
    background: #fff;
    z-index: 1;
    transition: all 0.2s;

    &.dropdown {
      // height: 500px;
    }

    ::v-deep {
      .van-icon-search {
        margin-top: 2px;
        margin-left: 4px;
        font-size: 20px;
      }

      .van-icon-clear {
        margin-top: 2px;
        margin-right: -2px;
        font-size: 20px;
      }
    }

    .search-bar {
      position: absolute;
      width: 100%;
      height: 128px;

      // top: 26px;
      ::v-deep .van-cell {
        line-height: 32px;

        input {
          display: inline-block;
          opacity: 0;
        }
      }
    }

    .search-bar-word {
      position: absolute;
      top: 40px;
      left: 88px;
      font-size: 0;
      width: 100%;
      max-width: 580px;
      height: 52px;
      border-radius: 8px;
      overflow-x: scroll;
      white-space: nowrap;

      .placeholder {
        font-size: 28px;
        line-height: 52px;
        color: #adadad;
      }

      // box-sizing: border-box;
      ::v-deep .word {
        display: inline-block;
        color: #fff;
        background: #7bb7e7;
        padding: 10px 8px;
        margin: 0 8px;
        border-radius: 8px;
        font-size: 24px;
        overflow: hidden;

        .text {
          border-right: 1px solid #acd9fd;
          padding-right: 8px;

          &.no-line {
            border-color: rgba(#fff, 0);
          }
        }

        .close {
          display: inline-block;
          width: 24px;
          height: 24px;
          background: url('~@/svg/close.svg');
          background-size: 100%;
        }
      }
    }

    .image-search-mask {
      position: fixed;
      top: 128px;
      top: env(safe-area-inset-top);
      width: 100%;
      max-width: 10rem;
      height: calc(100% - 128px);
      height: calc(100% - env(safe-area-inset-top));
      box-sizing: border-box;
      // pointer-events: none;
      background: rgba(0, 0, 0, 0.6);
      transition: all 0.2s;
    }

    .search-history {
      // position: absolute;
      margin-top: 150px;
      margin-bottom: 20px;
      width: 100%;
      padding: 0 6px;
      box-sizing: border-box;
      overflow: hidden;

      .title-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        font-size: 26px;
        margin: 8px 20px;
      }

      .keyword {
        float: left;
        font-size: 24px;
        padding: 12px 20px;
        background: #eaeaea;
        border-radius: 26px;
        margin: 12px 12px;
        user-select: none;
        white-space: nowrap;
        max-width: 50%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .image-search {
      position: absolute;
      top: 28px;
      width: 100%;
      z-index: 1;
    }
  }

  .list-wrap {
    position: relative;
    min-height: 100vh;
    // overflow-y: scroll;
    padding-top: 122px;
    padding-bottom: 100px;
    padding-bottom: calc(100px + env(safe-area-inset-bottom));
    box-sizing: border-box;

    >.mask {
      display: none;
    }

    &.focus {
      >.mask {
        display: block;
        position: fixed;
        top: 122px;
        width: 100%;
        max-width: 10rem;
        height: calc(100% - 122px);
        box-sizing: border-box;
        // pointer-events: none;
        background: rgba(0, 0, 0, 0.6);
        transition: all 0.2s;
      }
    }
  }
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.result-list {
  margin: 0 2px;

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
