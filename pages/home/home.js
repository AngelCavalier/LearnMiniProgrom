// pages/home/home.js
import {getMultiData, getGoodsData} from '../../service/home.js'

const types = ['pop', 'new', 'sell']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    recommends: [],
    titles: ['流行', '新款', '精选'],
    goods: {
      pop : {page: 0, list: []},
      new : {page: 0, list: []},
      sell : {page: 0, list: []}
    },
    currentType: 'pop',
    showBackTop: false,
    isTabFixed: false,
    tabScrollTop: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getMultiData()
    this._getGoodsData('pop')
    this._getGoodsData('new')
    this._getGoodsData('sell')
  },

  // ------------------网络请求函数----------------
  _getMultiData(){
    // 1.请求轮播图以及推荐数据
    getMultiData().then(res=>{
      // 2.取出轮播图和推荐的数据
      const banners = res.data.data.banner.list;
      const recommends = res.data.data.recommend.list;
      // 将banners和recomends放到data中
      this.setData({
        banners: banners,
        recommends: recommends
      })
    })
  },
  _getGoodsData(type){
    // 1.获取页码
    const page = this.data.goods[type].page + 1;
    // 2.发送网络请求
    getGoodsData(type, page).then(res => {
      // 2.1取出数据
      const list = res.data.data.list;
      // 2.2 将数据设置到对应type的list中
      const oldList = this.data.goods[type].list
      oldList.push(...list)
      // 2.3将数据设置到data中的goods中
      const typeKey = `goods.${type}.list`;
      const pageKey = `goods.${type}.page`
      this.setData({
        [typeKey]: oldList,
        [pageKey]: page,
      })
    })
  },
  // -----------------事件监听函数--------------
  handleTabClick(enent){
    // 取出index
    const index = enent.detail.index
    // 设置currentType
    this.setData({
      currentType: types[index]
    })
  },
  handleImageLoad(){
    console.log('图片加载完成');
    wx.createSelectorQuery().select('#tab-control').boundingClientRect(rect=>{
      this.data.tabScrollTop=rect.top
      console.log(this.data.tabScrollTop);
    }).exec()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getGoodsData(this.data.currentType)
  },

  onPageScroll(option){
    const flag1 = option.scrollTop >= 1000;
    if(flag1 != this.data.showBackTop){
      this.setData({
        showBackTop: flag1
      })
    }
    const flag2 =  option.scrollTop >= this.data.tabScrollTop;
    if(flag2 != this.data.isTabFixed){
      this.setData({
        isTabFixed: flag2
      })
    }
  }
})