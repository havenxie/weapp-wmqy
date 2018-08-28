const newsdata = require('../../libraries/newsdata.js');
const dealUrl = require('../../libraries/dealUrl.js');
const app = getApp();
Page({
    data: {
    	content: {},//存放说明、分享链接等信息
    	subjects: {},//主体内容，这里将他分为几个部分
    	head: {},
        loading: true,
        hasMore: true,
        navTitle: [],
        toTitle: 'to',
        showGoTop: false,
        scrollTop: 0,
        winHeight: 0,
        localParams: {}
    },
    hideLoading() {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        this.setData({
            loading: false
        });
    },
    loadData(option) {
        let that = this
        console.log(option)
          newsdata.find('search.json.php', {
            query: option.key,
            page: 1
          })
          .then(d => {
            that.hideLoading();
            if(d.code == 200 && d.desc == 'ok') {
                console.log(d);
                
                if(d.data.length == 0) {
                    wx.showModal({
                        title: '提示',
                        content: `你查询的关键词：“${option.key}”没有搜索到任何内容，请输入其他关键词。`,
                        success: () => {},
                        fail: () => {}
                    });
                    console.log('没有搜索到结果，请重新输入关键词')
                } else {
                    that.setData({
                
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
    navToPicture(event) {
        let str = dealUrl.getUrlTypeId(event);
            wx.navigateTo({
            url: '../picture-page/picture-page' + str,
            success: (res) => {},
            fail: (err) => {console.log(err)}
        });
    },
    navToArticle(event) {
        let str = dealUrl.getUrlTypeId(event);
        wx.navigateTo({
            url: '../article-page/article-page' + str,
            success: (res) => {},
            fail: (err) => {console.log(err)}
        });
    },
    navToVideo(event) {
        let str = event.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../video-page/video-page?videoUrl=' + str,
            success: (res) => {},
            fail: (err) => {console.log(err)}
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
    moveTo(event) {//导航标签快速定位
        console.log(event.currentTarget.dataset.id)
        this.setData({
            toTitle: event.currentTarget.dataset.id,
        });
    },
    refesh() {
        this.loadData(this.data.localParams);
    },
    toTop(event) {//点击返回顶部
        this.setData({
            scrollTop: 0,
        });
    },
    bindScroll(event) {//页面滚动时候触发
        if(event.detail.scrollTop > 300) {
            this.setData({
                showGoTop: true,
            });
        } else {
            this.setData({
                showGoTop: false,
            });            
        }
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
        this.setData({//存储数据留着给刷新用
            localParams: params,
        });
        this.loadData(this.data.localParams);
    },
    onPullDownRefresh() {
        this.loadData(this.data.localParams);
        wx.stopPullDownRefresh();
    },
})