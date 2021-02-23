<template>
  <div class="rank">
    <div class="top">
      <Nav :menu="menu" />
      <v-date-picker
          :attributes="[{
          key: 'today',
          highlight: 'yellow',
          dates: date
        }]"
          :min-date="minDate"
          :max-date="maxDate"
          v-model="date"
          mode="single"
          :popover="{
          placement: 'bottom',
          visibility: 'click'
        }"
      >
        <div class="calendar">
          <div class="date">{{ dateNum }}</div>
        </div>
      </v-date-picker>
    </div>
    <Top3 v-if="artList.length >= 3" :artList="artList.slice(0,3)" />
    <van-list v-if="artList.length > 3" class="rank-list" v-model="loading"
              :finished="finished" finished-text="没有更多了"
              :error.sync="error" error-text="网络异常，点击重新加载"
              @load="getRankList"
    ></van-list>
  </div>
</template>

<script>
import Nav from "@/views/Rank/components/RankNav";
import Top3 from "@/views/Rank/components/Top3";
import { List, Loading, Empty } from 'vant'
import moment from "moment";
import _ from 'lodash'
export default {
  name: 'Rank',
  components: {
    Nav,
    Top3,
    [List.name]: List,
    [Loading.name]: Loading,
    [Empty.name]: Empty
  },
  data() {
    return {
      scrollTop: 0,
      minDate: moment('2007-09-13').toDate(),
      maxDate: moment().subtract(2, 'days').toDate(),
      date: moment().subtract(2, 'days').toDate(),
      artList: [],
      curType: 'daily',
      curPage: 1,
      loading: false,
      finished: false,
      error: false,
      menu: {
        daily: { name: "日榜", io: "day" },
        weekly: { name: "周榜", io: "week" },
        monthly: { name: "月榜", io: "month" },
        rookie: { name: "新人榜", io: "week_rookie" },
        original: { name: "原创榜", io: "week_original" },
        male: { name: "男性向", io: "day_male" },
        female: { name: "女性向", io: "day_female" },
        r18: { name: "R-18 - 日榜", io: "day_r18", x: true },
        "r18-w": { name: "R-18 - 周榜", io: "week_r18", x: true },
        "r18-m": { name: "R-18 - 男性向", io: "day_male_r18", x: true },
        "r18-f": { name: "R-18 - 女性向", io: "day_female_r18", x: true }
      }
    }
  },
  computed: {
    dateNum () {
      return moment(this.date).date()
    }
  },
  methods: {
    init () {
      this.reset()
      this.curType = this.$route.params.type
      this.getRankList()
    },
    reset () {
      this.curType = 'daily'
      this.curPage = 1
      this.artList = []
    },
    getIOType (type) {
      return this.menu[type] ? this.menu[type].io : null
    },
    getRankList: _.throttle(async function() {
      let type = this.getIOType(this.curType)
      let res = await api.getRankList(type, this.curPage, this.date)
      if (res.status === 0) {
        let newList = res.data
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
      this.isLoading = false
    }, 5000)
  }
}
</script>

<style lang="stylus" scoped>
.rank {
  //padding-top: 100px;
  padding-top: env(safe-area-inset-top);
  box-sizing: border-box;

  .top {
    position: fixed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    //top: 60px;
    top: env(safe-area-inset-top);
    width: 750px;
    height: 100px;
    padding: 0 12px;
    box-sizing: border-box;
    background: #fff;
    z-index: 1;

    .calendar {
      position: relative;
      width: 60px;
      height: 60px;
      background: url('~@/assets/images/calendar.png') center no-repeat;
      background-size: 100%;
      transform: translateY(-4px);

      .date {
        position: absolute;
        top: 21.5px;
        left: 55%;
        transform: translateX(-50%);
        color: #666;
        font-family: Dosis;
        font-size: 26px;
        font-weight: 600;
        letter-spacing: 4px;
      }
    }
  }
}
</style>