const newsdata = require('../../libraries/newsdata.js');
const htmlToWxml = require('../../libraries/htmlToWxml.js');
Page({
	data: {
		title: '',
    logo: '',
    source: '',
    author: '',
    time: '',
    contents: [],
    imgs: [],
    loading: true,
	},

	onLoad(option) {
		let params = option;
    newsdata.find('article.json.php', params)
			.then(res => {
        if (res.code == 200 && res.desc == 'ok') {
          console.log(res.data);
          let imgsLen = res.data.imgs.length;
          let contentsLen = res.data.contents.length;
          let imgsCnt = 0, contentsCnt = 0;
          let selectArr = [];
          for(let i = 0; i < imgsLen + contentsLen; i++) {
            if(imgsLen >= contentsLen) {
              if((i / 2 != 0) && (contentsCnt < contentsLen)) {//奇数
                //selectArr[i] = res.data.contents[contentsCnt++];
                selectArr[i] = { 'txt': res.data.contents[contentsCnt]};
                contentsCnt++;
              } else {
                //selectArr[i] = res.data.imgs[imgsCnt++];
                selectArr[i] = { 'img': res.data.imgs[imgsCnt]};
                imgsCnt++;
              }
            } else {
              if((i/2 != 0) && (imgsCnt < imgsLen)) {
                //selectArr[i] = res.data.imgs[imgsCnt++];
                selectArr[i] = { 'img': res.data.imgs[imgsCnt]};
                imgsCnt++;
              } else {
                //selectArr[i] = res.data.contents[contentsCnt++];
                selectArr[i] = { 'txt': res.data.contents[contentsCnt]};
                contentsCnt++;
              }
            }
          }
          console.log(selectArr);
          this.setData({
            loading: false,
            title: res.data.title,
            source: res.data.source,
            author: res.data.author,
            time: res.data.pubdate,
            // contents: res.data.contents,
            // imgs: res.data.imgs,
            select: selectArr,//['img', 'tet', 'img','txt']
          });
          //console.log(this.data.select);
        } else {
          console.log(d.code, d.desc);
        }})
			.catch(err => {
				this.setData({ title: '获取数据异常', loading: false })
				console.log(err);
			})
	},
	dingyue() {
		wx.showModal({
			title: '提示',
			content: '点击也没用，这个功能根本就没做',
			success: () => {},
			fail: () => {}
		});
	},
	 /**
     * [onPullDownRefresh 下拉页面不做处理]
     * @return {[type]} [description]
     */
    onPullDownRefresh() {
        wx.stopPullDownRefresh();
    },
})