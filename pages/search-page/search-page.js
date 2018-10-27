const newsdata = require('../../libraries/newsdata.js');
const dealUrl = require('../../libraries/dealUrl.js');
const app = getApp();
Page({
    data: {
      news: {},
      loading: false,
      hasMore: true,
      subtitle: '',
      inputValue: '',
      keywords: [],
      userwords: [],
      searchBack: false, 
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
            loading: false,
        });
    },
    loadData(keyword) {
      let that = this
      try {//数据存储到本地
        let searchWords = [];
        let res = wx.getStorageSync('searchWords')
        if(res) {
          searchWords = res;
        }
        if(searchWords.indexOf(keyword) == -1)//本地存储中不存在这个关键字
        {
          searchWords.push(keyword);
          wx.setStorageSync('searchWords', searchWords)
          res = wx.getStorageSync('searchWords')
          that.setData({ userwords: res });
        }
      } catch (e) {
        console.log("调用本地数据失败")
      }
      // console.log("您输入的内容是:" + this.data.inputValue)
        newsdata.find('search.json.php', {
          query: keyword,
          page: 1
        })
        .then(res => {
           this.hideLoading();
          if (res.code == 200 && res.desc == 'ok') {
              //  console.log(d);
            if (res.data.length == 0) {
                  wx.showModal({
                      title: '提示',
                      content: `你查询的关键词：“${keyword}”没有搜索到任何内容，请输入其他关键词。`,
                      success: () => {},
                      fail: () => {}
                  });
                  // console.log('没有搜索到结果，请重新输入关键词')
              } else {
                  this.hideLoading();
                  this.setData({
                    news: res,
                    searchBack: true,
                    hasMore: res.page >= res.maxpage ? false : true
                  });
              }
            } else {
            // console.log(res.code, res.desc);
          }
        })
        .catch(e => {
          that.setData({
            subtitle: '获取数据异常',
          })
          console.error(e);
          that.hideLoading();
        })
    },
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
    bindKeyInput: function (event) {//获取输入的数据
      this.setData({
        inputValue: event.detail.value,
      })
    },
    bindSearch() {//输入框点击完成事件
      let searchValue = this.data.inputValue;
      if (searchValue != '') {
        this.loadData(searchValue)
      }
    },
    bindFocus() {
      this.setData({
        searchBack: false,
      })
  },
  cancelBtn(event) {//取消按钮事件
      wx.navigateBack({
        delta: 1, // 回退前 delta(默认为1) 页面
        success: function(res){
        },
        fail: function() {
        },
        complete: function() {
        }
      })
    },
    hotKeyBtn(event) {
      let myKeyWord = event.target.dataset.word;
      this.setData({
        inputValue: myKeyWord
      })
      this.loadData(this.data.inputValue)
    },
    clearBtn() {
      wx.setStorage({
        key: "searchWords",
        data: []
      });
      this.setData({ userwords: [] });
    },
    navToArticle(event) {
      let str = event.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../article-page/article-page?id=' + str,
        success: (res) => { },
        fail: (err) => {
          console.log(err)
        }
      });
    },
    onLoad(params) {
      //需要获取一些当前比较热门的关键字，用来显示热门搜索
      let that = this;
      newsdata.find('keywords.json.php', {})
        .then(d => {
          if(d.code == 200 && d.desc == 'ok') {
            this.setData({
              keywords: d.keywords
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
        })

      wx.getStorage({
        key: 'searchWords',
        success(res) {
          that.setData({ userwords: res.data})
        }
      })
        //this.loadData();
    },
    onPullDownRefresh() {
      this.bindSearch();
      wx.stopPullDownRefresh();
    },
    onReachBottom() {
      this.loadMore();
    }
})