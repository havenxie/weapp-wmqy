const newsdata = require('../../libraries/newsdata.js');
const dealUrl = require('../../libraries/dealUrl.js');
const app = getApp();
Page({
    data: {
      news: {},
      loading: false,
      hasMore: false,
      navTitle: [],
      toTitle: 'to',
      showGoTop: false,
      scrollTop: 0,
      winHeight: 0,
      localParams: {},
      inputValue: '',
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
                      news: d
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
      } else {
        // wx.showModal({
        //   title: '提示',
        //   content: `你输入的数据：${this.data.inputValue != '' ? this.data.inputValue : '无效'}。`,
        //   success: () => { },
        //   fail: () => { }
        // });
      }
    },
    ensureBtn(event) {//确定按钮事件
      this.bindSearch();
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
        // let that = this; //获取设备信息
        // wx.getSystemInfo({
        //     success: function(res) {
        //         that.setData({
        //             winHeight: res.windowHeight
        //         });
        //     }
        // });
        // this.setData({//存储数据留着给刷新用
        //     localParams: params,
        // });
        console.log('进入搜索页')
        //this.loadData();
    },
    onPullDownRefresh() {
      this.bindSearch();
      wx.stopPullDownRefresh();
    },
})