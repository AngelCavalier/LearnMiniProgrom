export default function (options) {
  const baseURL = 'http://152.136.185.210:7878/api/m5'
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseURL + options.url,
      method: options.method || 'get',
      data: options.data || {},
      success: resolve,
      fail: reject
    })
  })
}