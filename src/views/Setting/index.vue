<template>
  <div class="setting">
    <van-cell center title="持久化缓存" :label="size.local | bytes">
      <template #right-icon>
        <van-button type="primary" size="small" @click="clearCache('local')">清理</van-button>
      </template>
    </van-cell>

    <van-cell center title="运行时缓存" :label="size.session | bytes">
      <template #right-icon>
        <van-button type="info" size="small" @click="clearCache('local')">清理</van-button>
      </template>
    </van-cell>

    <van-cell center title="R-18作品显示" label="包含裸露内容或性描写">
      <template #right-icon>
        <van-switch :value="currentSETTING.r18" @input="onR18Change($event, 1)" size="24" />
      </template>
    </van-cell>

    <van-cell center title="R-18G作品显示" label="包含血腥或恶心内容">
      <template #right-icon>
        <van-switch :value="currentSETTING.r18g" @input="onR18Change($event, 2)" size="24" />
      </template>
    </van-cell>
  </div>
</template>

<script>
import { Cell, Switch, Button, Dialog } from 'vant'
import { LocalStorage, SessionStorage } from "@/utils/storage";
import {mapActions, mapState} from "vuex";

export default {
  name: 'Setting',
  components: {
    [Cell.name]: Cell,
    [Button.name]: Button,
    [Switch.name]: Switch
  },
  data() {
    return {
      currentSETTING: {
        r18: false,
        r18g: false
      },
      size: {
        local: 0,
        session: 0
      }
    }
  },
  computed: {
    ...mapState(['SETTING'])
  },
  watch: {
    $route () {
      this.calCacheSize()
    }
  },
  methods: {
    clearCache (type) {
      let showName
      switch (type) {
        case 'local':
          showName = '持久化缓存'
          break
        case 'session':
          showName = '运行时缓存'
          break
        default:
          break
      }
      Dialog.confirm({
        message: `确定要清理${showName}吗？清理后将重新从网络加载相关内容`,
        confirmButtonColor: 'black',
        cancelButtonColor: 'blue',
        closeOnPopstate: true
      }).then(() => {
        if (type === 'local')   LocalStorage.clear()
        if (type === 'session') SessionStorage.clear()

        this.calCacheSize()
        this.$toast.success('清理完成')
      })
    },
    calCacheSize () {
      this.size.local = LocalStorage.size
      this.size.session = SessionStorage.size
    },
    onR18Change (checked, type) {
      let name
      if (type === 1) name = 'R-18'
      if (type === 2) name = 'R-18G'

      if (checked) {
        Dialog.confirm({
          message: `确定要开启${name}作品显示吗？请确保您的年龄已满18岁，且未违反当地法律法规所规定的内容`,
          confirmButtonColor: 'black',
          cancelButtonColor: 'blue',
          closeOnPopstate: true
        }).then(() => {
          if (type === 1) this.currentSETTING.r18 = checked
          if (type === 2) {
            this. currentSETTING.r18g = checked
            setTimeout(() => {
              Dialog.alert({
                message: `请注意，开启${name}开关可能会对您的身心健康造成不可逆的影响，如若感到不适，请立即关闭应用并寻求医学帮助`
              })
            }, 200)
          }
        }).catch(() => {
          console.log('随便输出点什么吧')
        })
      } else {
        if (type === 1) this.currentSETTING.r18 = checked
        if (type === 2) this.currentSETTING.r18g = checked
      }
    },
    ...mapActions(['saveSETTING'])
  },
  filters: {
    bytes (bytes) {
      bytes = Number(bytes)
      if (bytes === 0) return 'o B'

      const k = 1024
      const dm = 0
      const size = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + size[i]
    }
  },
  mounted() {
    this.currentSETTING = JSON.parse(JSON.stringify(this.SETTING))
    this.calCacheSize()
  },
  updated() {
    this.saveSETTING(JSON.parse(JSON.stringify(this.currentSETTING)))
  }
}
</script>

<style lang="stylus" scoped>

</style>
