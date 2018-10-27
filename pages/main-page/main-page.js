const newsdata = require('../../libraries/newsdata.js');
const dealUrl = require('../../libraries/dealUrl.js');
const app = getApp();
Page({
    data: {
        swiper: {},
        special: {},
        news: {},
        loading: true,
        hasMore: true,
        subtitle: '',
        scrollTop: 0,
        showGoTop: false,
        showSearch: true,
        inputValue: '',
    },
    
    showLoading() {
        wx.showNavigationBarLoading();
        this.setData({
            subtitle: '加载中...',
            loading: true,
        });
    },
    hideLoading() {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        this.setData({
            loading: false
        });
    },
    /**
     * [initLoad 初始化加载数据]
     * @return {[type]} [description]
     */
    initLoad() {
      this.showLoading();
      newsdata.find('carousel.json.php', {})
        .then(d => {
          if(d.code == 200 && d.desc == 'ok') {
            //console.log(d);
            this.setData({
              swiper : d.data
            });
            this.hideLoading();
          } else {
            console.log(d.code, d.desc);
          }
        })
        .catch(e => {
          this.setData({
            subtitle: '获取数据异常',
          })
          console.error(e);
          this.hideLoading();
        })
      newsdata.find('list.json.php', {})
      .then(d => {
        if(d.code == 200 && d.desc == 'ok') {
          //console.log(d);
          this.setData({
            news: d
          });
        } else {
          console.log(d.code, d.desc);
        }
      })
      .catch(e => {
        this.setData({
          subtitle: '获取数据异常',
        })
        console.error(e);
        this.hideLoading();
      })
            
    },

    /**
     * [loadMore 加载更多数据]
     * @return {[type]} [description]
     */
    loadMore() {
      this.showLoading();
      let currentPage = this.data.news.page;
      if (currentPage >= this.data.news.maxpage) {
          this.setData({
              hasMore: false,
          });
          this.hideLoading();
          return;
      }
      newsdata.find('list.json.php', {
          page: ++currentPage
        })
        .then(d => {
          //console.log(d);
            let newNews = d;
            let oldNewsItems = this.data.news.data;//[]
            newNews.data = oldNewsItems.concat(d.data);
            this.setData({
                news: newNews,
            });
            this.hideLoading();
        })
        .catch(e => {
            this.setData({
                subtitle: '获取数据异常',
            })
            //console.error(e);
            this.hideLoading();
        }) 
    },
    navToSpecial(event) {
        let str = dealUrl.getUrlTypeId(event);
        wx.navigateTo({
            url: '../special-page/special-page' + str ,
            success: (res) => {},
            fail: (err) => {
                console.log(err)
            }
        });
    },
    navToPicture(event) {
        let str = dealUrl.getUrlTypeId(event);
        wx.navigateTo({
            url: '../picture-page/picture-page' + str,
            success: (res) => {},
            fail: (err) => {
                console.log(err)
            }
        });
    },
    navToArticle(event) {
      //console.log(event.currentTarget.dataset.id);
      let str = event.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../article-page/article-page?id=' + str,
          success: (res) => {},
          fail: (err) => {
              console.log(err)
          }
      });
    },
    navToVideo(event) {
        let str = event.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../video-page/video-page?videoUrl=' + str,
            success: (res) => {},
            fail: (err) => {
                console.log(err)
            }
        });
    },
    navToDocLive(event) {
        let str = JSON.stringify(event.currentTarget.dataset.liveext);
        wx.navigateTo({
            url: '../doclive-page/doclive-page?option=' + str,
            success: (res) => {},
            fail: (err) => {
                console.log(err)
            }
        });
    },
    navToSearch(event) {
      wx.navigateTo({
        url: '../search-page/search-page',
        success: (res) => { },
        fail: (err) => {
          console.log(err)
        }
      })
    },
    toTop(event) {//点击返回顶部
      this.setData({
        scrollTop: 0,
      });
    },
    scroll(event) {//页面滚动时候触发
        //console.log(event)
        this.setData({
            showSearch: true,
        }); 
      // if (event.detail.scrollTop > 200) {
      //   this.setData({
      //     showGoTop: true,
      //   });
      // } else {
      //   this.setData({
      //     showGoTop: false,
      //   });
      // }
    },
    searchIcon() {
        // wx.navigateTo({ url: '../logs/logs' });
        this.setData({
            showSearch: false,
            inputValue: '',
        });    
    },


    /**
     * [onLoad 载入页面时执行的生命周期初始函数]
     * @return {[type]} [description]
     */
    onLoad() {
        this.initLoad();
    },

    /**
     * [onPullDownRefresh 下拉刷新数据]
     * @return {[type]} [description]
     */
    onPullDownRefresh() {
        this.initLoad();
    },

    /**
     * [onReachBottom 上拉加载更多]
     * @return {[type]} [description]
     */
    onReachBottom() {
        this.loadMore();
    }
})