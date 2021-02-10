import { get} from "@/api/http"
import { SessionStorage } from "@/utils/storage";
import moment from 'moment'

const isSupportWebP = (() => {
  const elem = document.createElement('canvas')

  if (elem.getContext && elem.getContext('2d')) {
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0
  }

  return false
})()

const imgProxy = url => {
  let result = url.replace(/i.pximg.net/g,'pximg.pixiv-viewer.workers.dev')

  if (!isSupportWebP) {
    result = result.replace(/_10_webp/g, '_70')
    result = result.replace(/_webp/g, '')
  }
  return result
}

const parseUser = data => {
  const { user, profile, workspace } = data
  let { id, account, name, comment } = user
  let { background_image_url, birth, birth_day, gender, is_premium, is_using_custom_profile_image, job, total_follow_users, total_mypixiv_users, total_illust_bookmarks_public, total_illusts, twitter_account, twitter_url, webpage } = profile

  return {
    id,
    account,
    name,
    comment,
    avatar: imgProxy(user.profile_image_urls.medium),
    bgcover: background_image_url,
    birth: `${birth}-${birth_day}`,
    gender,
    is_premium,
    is_using_custom_profile_image,
    job,
    follow: total_follow_users,
    friend: total_mypixiv_users,
    bookmarks: total_illust_bookmarks_public,
    illusts: total_illusts,
    twitter_account,
    twitter_url,
    webpage,
    workspace
  }
}

const parseIllust = data => {
  let {id, title, caption, create_date, tags, tools, width, height, x_restrict, total_view, total_bookmarks, type} = data
  let images = []

  if (data.meta_single_page.original_image_url) {
    images.push({
      s: imgProxy(data.image_urls.square_medium),
      m: imgProxy(data.image_urls.medium),
      l: imgProxy(data.image_urls.large),
      o: imgProxy(data.meta_single_page.original_image_url)
    })
  } else {
    images = data.meta_pages.map(data => {
      return {
        s: imgProxy(data.image_urls.square_medium),
        m: imgProxy(data.image_urls.medium),
        l: imgProxy(data.image_urls.large),
        o: imgProxy(data.image_urls.original)
      }
    })
  }

  return {
    id,
    title,
    caption,
    author: {
      id: data.user.id,
      name: data.user.name,
      avatar: imgProxy(data.user.profile_image_urls.medium)
    },
    created: create_date,
    images,
    tags,
    tools,
    width,
    height,
    count: data.page_count,
    view: total_view,
    like: total_bookmarks,
    x_restrict,
    type
  }
}

const api = {
  /**
   *
   * @param {Number} id 作品ID
   * @param {Number} index 页数 0起始
   */
  url(id, index) {
    if (!index) {
      return `https://pixiv.cat/${id}.png`
    } else {
      return `https://pixiv.cat/${id}-${index}.png`
    }
  },
  /**
   *
   * @param {String} mode 排行榜类型  ['day', 'week', 'month', 'week_rookie', 'week_original', 'day_male', 'day_female', 'day_r18', 'week_r18', 'day_male_r18', 'day_female_r18', 'week_r18g']
   * @param {Number} page 页数
   * @param {String} date YYYY-MM-DD 默认为「前天」
   */
  async getRankList(mode = 'weekly', page = 1, date = moment().subtract(2, 'days').format('YYYY-MM-DD')) {
    let rankList
    date = moment(date).format('YYYY-MM-DD')
    if (!SessionStorage.has(`rankList_${mode}_${date}_${page}`)) {

      let res = await get('/pixiv/', {
        type: 'rank',
        mode,
        page,
        date
      })

      let data
      if (res.illusts) {
        data = res.illusts
      } else if (res.error) {
        return {
          status: -1,
          msg: res.error.user_message || res.error.message
        }
      } else {
        return {
          status: -1,
          msg: '未知错误'
        }
      }

      rankList = data.map(art => {
        return parseIllust(art)
      })

      SessionStorage.set(`rankList_${mode}_${date}_${page}`, rankList, 60 * 60 * 24)
    } else {
      rankList = SessionStorage.get(`rankList_${mode}_${date}_${page}`)
    }


    return { status: 0, data: rankList }
  },
}

export default api
