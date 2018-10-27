const newsdata = require('../../libraries/newsdata.js');
const dealUrl = require('../../libraries/dealUrl.js');
const app = getApp();
Page({
    data: {
      news: {},
      loading: false,
      hasMore: false,
      inputValue: '',
      keywords: [],
      searchBack: false, 
    },
    hideLoading() {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        this.setData({
            loading: false
        });
    },
    loadData(keyword) {
      let that = this
      console.log("您输入的内容是:" + this.data.inputValue)
        newsdata.find('search.json.php', {
          query: keyword,
          page: 1
        })
        .then(d => {
           that.hideLoading();
           if(d.code == 200 && d.desc == 'ok') {
               console.log(d);
               if(d.data.length == 0) {
                  wx.showModal({
                      title: '提示',
                    content: `你查询的关键词：“${keyword}”没有搜索到任何内容，请输入其他关键词。`,
                      success: () => {},
                      fail: () => {}
                  });
                  console.log('没有搜索到结果，请重新输入关键词')
              } else {
                  that.setData({
                      news: d,
                      searchBack: true,
                  });
              }
            } else {
            console.log(d.code, d.desc);
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
    bindKeyInput: function (event) {//获取输入的数据
      this.setData({
        inputValue: event.detail.value
      })
    },
    bindSearch() {//输入框点击完成事件
      let searchValue = this.data.inputValue;
      if (searchValue != '') {
        this.loadData(searchValue)
      }
    },
    cancelBtn(event) {//取消按钮事件
      // var pages = getCurrentPages()
      // var num = pages.length
      wx.navigateBack({
        delta: 1, // 回退前 delta(默认为1) 页面
        success: function(res){
          // success
        },
        fail: function() {
          // fail
        },
        complete: function() {

        }
      })
    },
    navToArticle(event) {
      //console.log(event.currentTarget.dataset.id);
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
      newsdata.find('keywords.json.php', {})
        .then(d => {
          if(d.code == 200 && d.desc == 'ok') {
            console.log(d);
            this.setData({
              keywords: d.keywords
            });
            // console.log(this.data.keywords)

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
        //this.loadData();
    },
    onPullDownRefresh() {
      this.bindSearch();
      wx.stopPullDownRefresh();
    },
})