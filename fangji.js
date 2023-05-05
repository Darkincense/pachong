const puppeteer = require('puppeteer');
const fs = require('fs');
const lodash = require('lodash');
const readline = require('readline');
const mysql = require('mysql');
const mainData = require('./mainDataFile.json');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root123456',
  database: 'test'
});
connection.connect();

(async () => {
  let allData = [
    {
      name: '半夏散',
      href: 'https://www.zysj.com.cn/zhongyaofang/banxiasan/index.html',
      index_id: 851
    },
    {
      name: '半夏散',
      href: 'https://www.zysj.com.cn/zhongyaofang/banxiasan/index.html',
      index_id: 852
    },
    {
      name: '半夏汤',
      href: 'https://www.zysj.com.cn/zhongyaofang/banxiatang/index.html',
      index_id: 867
    },
    {
      name: '槟榔丸',
      href: 'https://www.zysj.com.cn/zhongyaofang/binglangwan/index.html',
      index_id: 1281
    },
    {
      name: '槟榔散',
      href: 'https://www.zysj.com.cn/zhongyaofang/binglangsan/index.html',
      index_id: 1288
    },
    {
      name: '白术丸',
      href: 'https://www.zysj.com.cn/zhongyaofang/baishuwan/index.html',
      index_id: 1426
    },
    {
      name: '白术散',
      href: 'https://www.zysj.com.cn/zhongyaofang/baishusan/index.html',
      index_id: 1446
    },
    {
      name: '白术汤',
      href: 'https://www.zysj.com.cn/zhongyaofang/baishutang/index.html',
      index_id: 1450
    },
    {
      name: '鳖甲丸',
      href: 'https://www.zysj.com.cn/zhongyaofang/biejiawan/index.html',
      index_id: 2771
    },
    {
      name: '鳖甲散',
      href: 'https://www.zysj.com.cn/zhongyaofang/biejiasan/index.html',
      index_id: 2781
    },
    {
      name: '柴胡散',
      href: 'https://www.zysj.com.cn/zhongyaofang/chaihusan/index.html',
      index_id: 3682
    },
    {
      name: '柴胡汤',
      href: 'https://www.zysj.com.cn/zhongyaofang/chaihutang/index.html',
      index_id: 3703
    },
    {
      name: '沉香散',
      href: 'https://www.zysj.com.cn/zhongyaofang/chenxiangsan/index.html',
      index_id: 3948
    },
    {
      name: '赤茯苓散',
      href: 'https://www.zysj.com.cn/zhongyaofang/chifulingsan/index.html',
      index_id: 4699
    },
    {
      name: '丁香散',
      href: 'https://www.zysj.com.cn/zhongyaofang/dingxiangsan/index.html',
      index_id: 5151
    },
    {
      name: '地黄丸',
      href: 'https://www.zysj.com.cn/zhongyaofang/dihuangwan/index.html',
      index_id: 5519
    },
    {
      name: '大黄丸',
      href: 'https://www.zysj.com.cn/zhongyaofang/daihuangwan/index.html',
      index_id: 6252
    },
    {
      name: '大黄散',
      href: 'https://www.zysj.com.cn/zhongyaofang/daihuangsan/index.html',
      index_id: 6264
    },
    {
      name: '大黄汤',
      href: 'https://www.zysj.com.cn/zhongyaofang/daihuangtang/index.html',
      index_id: 6275
    },
    {
      name: '当归散',
      href: 'https://www.zysj.com.cn/zhongyaofang/dangguisan/index.html',
      index_id: 6716
    },
    {
      name: '当归散',
      href: 'https://www.zysj.com.cn/zhongyaofang/dangguisan/index.html',
      index_id: 6717
    },
    {
      name: '当归汤',
      href: 'https://www.zysj.com.cn/zhongyaofang/dangguitang/index.html',
      index_id: 6727
    },
    {
      name: '独活散',
      href: 'https://www.zysj.com.cn/zhongyaofang/duhuosan/index.html',
      index_id: 7117
    },
    {
      name: '阿胶散',
      href: 'https://www.zysj.com.cn/zhongyaofang/ejiaosan/index.html',
      index_id: 8079
    },
    {
      name: '茯苓汤',
      href: 'https://www.zysj.com.cn/zhongyaofang/fulingtang/index.html',
      index_id: 8917
    },
    {
      name: '防风散',
      href: 'https://www.zysj.com.cn/zhongyaofang/fangfengsan/index.html',
      index_id: 9112
    },
    {
      name: '防风汤',
      href: 'https://www.zysj.com.cn/zhongyaofang/fangfengtang/index.html',
      index_id: 9123
    },
    {
      name: '防风汤',
      href: 'https://www.zysj.com.cn/zhongyaofang/fangfengtang/index.html',
      index_id: 9124
    },
    {
      name: '附子散',
      href: 'https://www.zysj.com.cn/zhongyaofang/fuzisan/index.html',
      index_id: 9218
    },
    {
      name: '厚朴散',
      href: 'https://www.zysj.com.cn/zhongyaofang/houposan/index.html',
      index_id: 11133
    },
    {
      name: '寒凉降火汤',
      href: 'https://www.zysj.com.cn/zhongyaofang/hanliangjianghuotang/index.html',
      index_id: 11557
    },
    {
      name: '诃黎勒丸',
      href: 'https://www.zysj.com.cn/zhongyaofang/helilewan/index.html',
      index_id: 12713
    },
    {
      name: '诃黎勒散',
      href: 'https://www.zysj.com.cn/zhongyaofang/helilesan/index.html',
      index_id: 12715
    },
    {
      name: '黄耆丸',
      href: 'https://www.zysj.com.cn/zhongyaofang/huangqiwan/index.html',
      index_id: 12943
    },
    {
      name: '黄耆散',
      href: 'https://www.zysj.com.cn/zhongyaofang/huangqisan/index.html',
      index_id: 12982
    },
    {
      name: '黄耆汤',
      href: 'https://www.zysj.com.cn/zhongyaofang/huangqitang/index.html',
      index_id: 12992
    },
    {
      name: '黄芩汤',
      href: 'https://www.zysj.com.cn/zhongyaofang/huangqintang/index.html',
      index_id: 13079
    },
    {
      name: '黄连丸',
      href: 'https://www.zysj.com.cn/zhongyaofang/huanglianwan/index.html',
      index_id: 13158
    },
    {
      name: '黄连散',
      href: 'https://www.zysj.com.cn/zhongyaofang/huangliansan/index.html',
      index_id: 13191
    },
    {
      name: '加味四物汤',
      href: 'https://www.zysj.com.cn/zhongyaofang/jiaweisiwutang/index.html',
      index_id: 14564
    },
    {
      name: '羚羊角散',
      href: 'https://www.zysj.com.cn/zhongyaofang/lingyangjiaosan/index.html',
      index_id: 19142
    },
    {
      name: '羚羊角汤',
      href: 'https://www.zysj.com.cn/zhongyaofang/lingyangjiaotang/index.html',
      index_id: 19143
    },
    {
      name: '芦荟丸',
      href: 'https://www.zysj.com.cn/zhongyaofang/luhuiwan/index.html',
      index_id: 19239
    },
    {
      name: '鹿茸丸',
      href: 'https://www.zysj.com.cn/zhongyaofang/lurongwan/index.html',
      index_id: 19705
    },
    {
      name: '麦门冬汤',
      href: 'https://www.zysj.com.cn/zhongyaofang/maimendongtang/index.html',
      index_id: 20354
    },
    {
      name: '麦门冬汤',
      href: 'https://www.zysj.com.cn/zhongyaofang/maimendongtang/index.html',
      index_id: 20355
    },
    {
      name: '麻黄散',
      href: 'https://www.zysj.com.cn/zhongyaofang/mahuangsan/index.html',
      index_id: 20459
    },
    {
      name: '麻黄汤',
      href: 'https://www.zysj.com.cn/zhongyaofang/mahuangtang/index.html',
      index_id: 20480
    }
  ];
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });
  const newPage = await browser.newPage();
  // const urls = [
  //   'https://www.zysj.com.cn/zhongyaofang/index_1.html',
  //   'https://www.zysj.com.cn/zhongyaofang/index_2.html',
  //   'https://www.zysj.com.cn/zhongyaofang/index_3.html',
  //   'https://www.zysj.com.cn/zhongyaofang/index_4.html',
  //   'https://www.zysj.com.cn/zhongyaofang/index_5.html',
  //   'https://www.zysj.com.cn/zhongyaofang/index_6.html',
  //   'https://www.zysj.com.cn/zhongyaofang/index_7.html',
  //   'https://www.zysj.com.cn/zhongyaofang/index_8.html',
  //   'https://www.zysj.com.cn/zhongyaofang/index_10.html',
  //   'https://www.zysj.com.cn/zhongyaofang/index_11.html',
  //   'https://www.zysj.com.cn/zhongyaofang/index_12.html',
  //   'https://www.zysj.com.cn/zhongyaofang/index_13.html',
  //   'https://www.zysj.com.cn/zhongyaofang/index_14.html',
  //   'https://www.zysj.com.cn/zhongyaofang/index_15.html',
  //   'https://www.zysj.com.cn/zhongyaofang/index_16.html',
  //   'https://www.zysj.com.cn/zhongyaofang/index_17.html',
  //   'https://www.zysj.com.cn/zhongyaofang/index_18.html',
  //   'https://www.zysj.com.cn/zhongyaofang/index_19.html',
  //   'https://www.zysj.com.cn/zhongyaofang/index_20.html',
  //   'https://www.zysj.com.cn/zhongyaofang/index_23.html',
  //   'https://www.zysj.com.cn/zhongyaofang/index_24.html',
  //   'https://www.zysj.com.cn/zhongyaofang/index_25.html',
  //   'https://www.zysj.com.cn/zhongyaofang/index_26.html',
  // ]
  // for0:
  // for (let index = 0; index < urls.length; index++) {
  //   const urlItem = urls[index];
  //   await newPage.goto(urlItem);
  //   const itemUl = await newPage.waitForSelector('#list-content');
  //   const curData = await itemUl.evaluate(async (e) => {
  //     const songList = Array.from(e.children)[0].children;
  //     const tempArr = [];
  //     for (let idx = 0; idx < songList.length; idx++) {
  //       const songItem = songList[idx].children[0];
  //       tempArr.push({
  //         name: songItem.innerText,
  //         href: songItem.href,
  //         // prescription: '', // 处方
  //         // making: '',  // 制法
  //         // functional_indications: '',  // 功能主治
  //         // usage: '', // 用量
  //         // care: '', // 注意
  //         // excerpt: '',  // 摘录
  //       })
  //     }
  //     return tempArr;
  //   })
  //   allData = lodash.concat(allData, curData);
  // }
  // let writerStream = fs.createWriteStream('mainDataFile.txt');
  // writerStream.write(JSON.stringify(allData), 'UTF8');

  // 插入数据
  const insertData = (addSqlParams, index) => {
    const addSql = 'INSERT INTO fangji(index_id,name,href,children) VALUES(?,?,?,?)';
    connection.query(addSql, addSqlParams, (err, result) => {
      if (err) {
        console.log('插入数据库报错' + err.message + '----' + index);
        return;
      }
    });
  }
  for1:
  for (let index = 0; index < allData.length; index++) {
    try {
      const itemData = allData[index];
      console.log(`运行中: ${index + 1}/${allData.length}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await newPage.goto(itemData.href);
      await new Promise((resolve) => setTimeout(resolve, 300));
      const itemUl = await newPage.waitForSelector('#content');
      const curData = await itemUl.evaluate(async (e) => {

        const songList = Array.from(e.children);
        const tempArr = [];
        const includes = (clo, item) => {
          if (clo.indexOf(item) > -1) return true;
          return false;
        }

        const tempObj = {}
        for (let idx0 = 0; idx0 < songList.length; idx0++) {
          const itemSon = songList[idx0];
          // console.log('=================');
          // console.log(itemSon.childNodes);
          // console.log(itemSon.children[0].innerText);
          // console.log('=================');
          for (let idx1 = 0; idx1 < itemSon.children.length; idx1++) {
            const childItem = itemSon.children[idx1];
            // const childNode = itemSon.childNodes[idx1];
            const title = itemSon.children[0].innerText;

            const text = childItem.children.length > 1 && childItem.children[1] && childItem.children[1].innerText ? childItem.children[1].innerText : '';
            // console.log('title', title)
            if(title && title.indexOf('伤寒论') > -1 || idx1 <= 2 ) {
              if (includes(childItem.className, 'pinyin_name_phonetic')) {
                tempObj['pinyin_name_phonetic'] = text;
              }
              if (includes(childItem.className, 'alias')) {
                tempObj['alias'] = text;
              }
              if (includes(childItem.className, 'prescription') || includes(childItem.className, 'zucheng')) {
                tempObj['prescription'] = text;
              }
              if (includes(childItem.className, 'making') || includes(childItem.className, 'fangjie')) {
                tempObj['making'] = text;
              }
              if (includes(childItem.className, 'functional_indications') || includes(childItem.className, 'zhuzhi')) {
                tempObj['functional_indications'] = text;
              }
              if (includes(childItem.className, 'usage') || includes(childItem.className, 'fufa')) {
                tempObj['usage'] = text;
              }
              if (includes(childItem.className, 'care')) {
                tempObj['care'] = text;
              }
              if (includes(childItem.className, 'excerpt')) {
                tempObj['excerpt'] = text;
              }
              if (includes(childItem.className, 'pharmacological_action')) {
                tempObj['pharmacological_action'] = text;
              }
              if (includes(childItem.className, 'remark')) {
                tempObj['remark'] = text;
              }
            }
          }
        }
        if(Object.keys(tempObj).length > 0) tempArr.push(tempObj);
        return tempArr;
      })
      allData[index]['children'] = JSON.stringify(curData);
      // insertData([index + 1, allData[index]['name'], allData[index]['href'], allData[index]['children']]);
      insertData([allData[index]['index_id'], allData[index]['name'], allData[index]['href'], allData[index]['children']]);
      await new Promise((resolve) => setTimeout(resolve, 500));
      await newPage.goBack();
    } catch (error) { }
    // console.log(allData);
    // if(index === 8189) break for1;
  }

  console.log('保存结束');
  await browser.close();

})()