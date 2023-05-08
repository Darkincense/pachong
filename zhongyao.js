const puppeteer = require('puppeteer');
const fs = require('fs');
const lodash = require('lodash');
const readline = require('readline');
const mysql = require('mysql');
const mainData = require('./zhongyao.json');

const connection = mysql.createConnection({
  // host: '127.0.0.1',
  host: '124.222.84.37',
  user: 'root',
  // password: 'root123456',
  password: '123456!@#Qwe',
  database: 'huilaoye',
  multipleStatements: true
});
connection.connect();
const errorArr = [];
(async () => {
  let allData = mainData;
  // let allData = [
  //   {
  //     name: '栀子',
  //     href: 'https://www.zysj.com.cn/zhongyaocai/zhizi/index.html',
  //   }
  // ];
  // {
  //   name: '栀子',
  //   href: 'https://www.zysj.com.cn/zhongyaocai/zhizi/index.html',
  //   index_id: 10813
  // }
  // let allData = [
  //   {
  //     name: '柴胡',
  //     href: 'https://www.zysj.com.cn/zhongyaocai/chaihu/index.html',
  //     index_id: 885
  //   },
  //   {
  //     name: '蟾酥',
  //     href: 'https://www.zysj.com.cn/zhongyaocai/chansu/index.html',
  //     index_id: 1162
  //   },
  //   {
  //     name: '丹参',
  //     href: 'https://www.zysj.com.cn/zhongyaocai/danshen/index.html',
  //     index_id: 1335
  //   },
  //   {
  //     name: '大蒜',
  //     href: 'https://www.zysj.com.cn/zhongyaocai/dasuan/index.html',
  //     index_id: 1771
  //   },
  //   {
  //     name: '当归',
  //     href: 'https://www.zysj.com.cn/zhongyaocai/danggui/index.html',
  //     index_id: 1876
  //   },
  //   {
  //     name: '杜仲',
  //     href: 'https://www.zysj.com.cn/zhongyaocai/duzhong/index.html',
  //     index_id: 1895
  //   },
  //   {
  //     name: '茯苓',
  //     href: 'https://www.zysj.com.cn/zhongyaocai/fuling/index.html',
  //     index_id: 2357
  //   },
  //   {
  //     name: '附子',
  //     href: 'https://www.zysj.com.cn/zhongyaocai/fuzi/index.html',
  //     index_id: 2391
  //   },
  //   {
  //     name: '甘草',
  //     href: 'https://www.zysj.com.cn/zhongyaocai/gancao/index.html',
  //     index_id: 2688
  //   },
  //   {
  //     name: '黄柏',
  //     href: 'https://www.zysj.com.cn/zhongyaocai/huangbo/index.html',
  //     index_id: 3671
  //   },
  //   {
  //     name: '黄芩',
  //     href: 'https://www.zysj.com.cn/zhongyaocai/huangqin/index.html',
  //     index_id: 3753
  //   },
  //   {
  //     name: '黄连',
  //     href: 'https://www.zysj.com.cn/zhongyaocai/huanglian/index.html',
  //     index_id: 3826
  //   },
  //   {
  //     name: '绞股蓝',
  //     href: 'https://www.zysj.com.cn/zhongyaocai/jiaogulan/index.html',
  //     index_id: 4228
  //   },
  //   {
  //     name: '麻黄',
  //     href: 'https://www.zysj.com.cn/zhongyaocai/mahuang/index.html',
  //     index_id: 6221
  //   },
  //   {
  //     name: '牛舌草',
  //     href: 'https://www.zysj.com.cn/zhongyaocai/niushecao/index.html',
  //     index_id: 6416
  //   },
  //   {
  //     name: '三七',
  //     href: 'https://www.zysj.com.cn/zhongyaocai/sanqi/index.html',
  //     index_id: 7061
  //   },
  //   {
  //     name: '桑寄生',
  //     href: 'https://www.zysj.com.cn/zhongyaocai/sangjisheng/index.html',
  //     index_id: 7645
  //   },
  //   {
  //     name: '水黄',
  //     href: 'https://www.zysj.com.cn/zhongyaocai/shuihuang/index.html',
  //     index_id: 7851
  //   },
  //   {
  //     name: '麝香',
  //     href: 'https://www.zysj.com.cn/zhongyaocai/shexiang/index.html',
  //     index_id: 8263
  //   },
  //   {
  //     name: '五味子',
  //     href: 'https://www.zysj.com.cn/zhongyaocai/wuweizi/index.html',
  //     index_id: 8811
  //   },
  //   {
  //     name: '细辛',
  //     href: 'https://www.zysj.com.cn/zhongyaocai/xixin/index.html',
  //     index_id: 9498
  //   },
  //   {
  //     name: '血当归',
  //     href: 'https://www.zysj.com.cn/zhongyaocai/xuedanggui/index.html',
  //     index_id: 9567
  //   },
  //   {
  //     name: '香附',
  //     href: 'https://www.zysj.com.cn/zhongyaocai/xiangfu/index.html',
  //     index_id: 9769
  //   },
  //   {
  //     name: '栀子',
  //     href: 'https://www.zysj.com.cn/zhongyaocai/zhizi/index.html',
  //     index_id: 10813
  //   }
  // ];
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });
  const newPage = await browser.newPage();


  // const urls = [
  //   'https://www.zysj.com.cn/zhongyaocai/index__1.html',
  //   'https://www.zysj.com.cn/zhongyaocai/index__2.html',
  //   'https://www.zysj.com.cn/zhongyaocai/index__3.html',
  //   'https://www.zysj.com.cn/zhongyaocai/index__4.html',
  //   'https://www.zysj.com.cn/zhongyaocai/index__5.html',
  //   'https://www.zysj.com.cn/zhongyaocai/index__6.html',
  //   'https://www.zysj.com.cn/zhongyaocai/index__7.html',
  //   'https://www.zysj.com.cn/zhongyaocai/index__8.html',
  //   'https://www.zysj.com.cn/zhongyaocai/index__10.html',
  //   'https://www.zysj.com.cn/zhongyaocai/index__11.html',
  //   'https://www.zysj.com.cn/zhongyaocai/index__12.html',
  //   'https://www.zysj.com.cn/zhongyaocai/index__13.html',
  //   'https://www.zysj.com.cn/zhongyaocai/index__14.html',
  //   'https://www.zysj.com.cn/zhongyaocai/index__15.html',
  //   'https://www.zysj.com.cn/zhongyaocai/index__16.html',
  //   'https://www.zysj.com.cn/zhongyaocai/index__17.html',
  //   'https://www.zysj.com.cn/zhongyaocai/index__18.html',
  //   'https://www.zysj.com.cn/zhongyaocai/index__19.html',
  //   'https://www.zysj.com.cn/zhongyaocai/index__20.html',
  //   'https://www.zysj.com.cn/zhongyaocai/index__23.html',
  //   'https://www.zysj.com.cn/zhongyaocai/index__24.html',
  //   'https://www.zysj.com.cn/zhongyaocai/index__25.html',
  //   'https://www.zysj.com.cn/zhongyaocai/index__26.html',
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
  //       })
  //     }
  //     return tempArr;
  //   })
  //   allData = lodash.concat(allData, curData);
  // };

  // let writerStream = fs.createWriteStream('zhongyao.json');
  // writerStream.write(JSON.stringify(allData), 'UTF8');
  // writerStream.end();

  // 插入数据
  
  
  const insertData = async (addSqlParams, index, addSql) => {
    return new Promise(async (resove, reject) => {
      connection.query(addSql, addSqlParams, (err, result) => {
        if (err) {
          console.log('插入数据库报错');
          errorArr.push(('插入数据库报错--||' + err.message + '----||第' + index + '个||----time------||' + (+new Date())))
          let writerStream = fs.createWriteStream('zhongyao_error.txt');
          writerStream.write(JSON.stringify(errorArr), 'UTF8');
          writerStream.end();
          reject(err);
          return;
        }
        resove(addSqlParams.id);
      });
    })
  }

  const initData = async () => {
    for1:
    for (let index = 0; index < allData.length; index++) {
      try {
        // 数据库最后一个id的值
        if(
          index >= 3732
        ) 
        {
          const itemData = allData[index];
          lodash.set(itemData, 'id', `${index+1}`);
          // 方剂插入数据库
          await insertData(itemData, index, 'INSERT INTO zhongyao SET ?');
          console.log(`运行中: ${index + 1}/${allData.length}`);
          // await new Promise((resolve) => setTimeout(resolve, 400));
          // await newPage.goto(itemData.href);
          // await new Promise((resolve) => setTimeout(resolve, 500));
          // const itemUl = await newPage.waitForSelector('#content');
          // const curData = await itemUl.evaluate(async (e) => {
    
          //   const songList = Array.from(e.children);
          //   const tempArr = [];
          //   const includes = (clo, item) => {
          //     if (clo.indexOf(item) > -1) return true;
          //     return false;
          //   }
    
          //   for (let idx0 = 0; idx0 < songList.length; idx0++) {
          //     const itemSon = songList[idx0];
          //     const tempObj = {
          //       name: '',
          //       pinyin_name_phonetic: '',
          //       english_name: '',
          //       source: '',
          //       shape_properties: '',
          //       storage: '',
          //       processing: '',
          //       distinguish: '',
          //       attribution: '',
          //       properties_flavor: '',
          //       usage: '',
          //       remark: '',
          //       compound: '',
          //       discuss: '',
          //       excerpt: '',
          //       alias: '',
          //       provenance: '',
          //       habitat: '',
          //       prescription: '',
          //       making: '',
          //       functional_indications: '',
          //       care: '',
          //       pharmacological_action: '',
          //     }
          //     for (let idx1 = 0; idx1 < itemSon.children.length; idx1++) {
          //       const childItem = itemSon.children[idx1];
          //       const text = childItem.children.length > 1 && childItem.children[1] && childItem.children[1].innerText ? childItem.children[1].innerText : '';
                
          //       if(childItem['nodeName'] === 'H2') {
          //         tempObj['name'] = childItem.innerText;
          //       }
          //       if (includes(childItem.className, 'pinyin_name_phonetic')) {
          //         // 拼音
          //         tempObj['pinyin_name_phonetic'] = text;
          //       }
          //       if (includes(childItem.className, 'english_name')) {
          //         // 英文名称
          //         tempObj['english_name'] = text;
          //       }
          //       if (includes(childItem.className, 'source')) {
          //         // 来源
          //         tempObj['source'] = text;
          //       }
          //       if (includes(childItem.className, 'shape_properties')) {
          //         // 性状
          //         tempObj['shape_properties'] = text;
          //       }
          //       if (includes(childItem.className, 'storage')) {
          //         // 贮藏
          //         tempObj['storage'] = text;
          //       }
          //       if (includes(childItem.className, 'processing')) {
          //         // 炮制
          //         tempObj['processing'] = text;
          //       }
          //       if (includes(childItem.className, 'distinguish')) {
          //         // 鉴别
          //         tempObj['distinguish'] = text;
          //       }
          //       if (includes(childItem.className, 'attribution')) {
          //         // 归经
          //         tempObj['attribution'] = text;
          //       }
          //       if (includes(childItem.className, 'properties_flavor')) {
          //         // 性味
          //         tempObj['properties_flavor'] = text;
          //       }
          //       if (includes(childItem.className, 'usage') || includes(childItem.className, 'fufa')) {
          //         // 用法用量
          //         tempObj['usage'] = text;
          //       }
          //       if (includes(childItem.className, 'remark')) {
          //         // 备注
          //         tempObj['remark'] = text;
          //       }
          //       if (includes(childItem.className, 'compound')) {
          //         // 复方
          //         tempObj['compound'] = text;
          //       }
          //       if (includes(childItem.className, 'discuss')) {
          //         // 各家论述
          //         tempObj['discuss'] = text;
          //       }
          //       if (includes(childItem.className, 'excerpt')) {
          //         // 摘录
          //         tempObj['excerpt'] = text;
          //       }
          //       if (includes(childItem.className, 'alias')) {
          //         // 别名
          //         tempObj['alias'] = text;
          //       }
          //       if (includes(childItem.className, 'provenance')) {
          //         // 出处
          //         tempObj['provenance'] = text;
          //       }
          //       if (includes(childItem.className, 'habitat')) {
          //         // 生境分布
          //         tempObj['habitat'] = text;
          //       }
          //       if (includes(childItem.className, 'prescription') || includes(childItem.className, 'zucheng')) {
          //         tempObj['prescription'] = text;
          //       }
          //       if (includes(childItem.className, 'making') || includes(childItem.className, 'fangjie')) {
          //         tempObj['making'] = text;
          //       }
          //       if (includes(childItem.className, 'functional_indications') || includes(childItem.className, 'zhuzhi')) {
          //         // 功能主治
          //         tempObj['functional_indications'] = text;
          //       }
          //       if (includes(childItem.className, 'care')) {
          //         // 注意
          //         tempObj['care'] = text;
          //       }
          //       if (includes(childItem.className, 'pharmacological_action')) {
          //         // 药理作用
          //         tempObj['pharmacological_action'] = text;
          //       }
          //     }
          //     tempArr.push(tempObj)
          //   }
          //   return tempArr;
          // })
          
          // 插入子数据
          // for (let index1 = 0; index1 < curData.length; index1++) {
          //   const itemChildren = curData[index1];
          //   if(!itemChildren.name) {
          //     lodash.set(itemChildren, 'name', itemData.name);
          //   }
          //   lodash.set(itemChildren, 'id', `${index+1}_${index1+1}`);
          //   lodash.set(itemChildren, 'p_id', `${index+1}`);
          //   await insertData(itemChildren, `${index+1}_${index1+1}`, 'INSERT INTO zhongyao_children SET ?');
          //   console.log('插入子项成功'+`${index+1}-${index1+1}`);
          // }
          await newPage.goBack();
        }
      } catch (error) { }
      
    }
  }
  
  await initData();

  await browser.close();

  connection.end();

})()