const puppeteer = require('puppeteer');
const fs = require('fs');
const lodash = require('lodash');
const readline = require('readline');
const mysql = require('mysql');
const mainData = require('./cidian.json');

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
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });
  const newPage = await browser.newPage();

  // const urls = [
  //   'https://www.zysj.com.cn/lilunshuji/zhongyicidian2050/index.html',
  //   'https://www.zysj.com.cn/lilunshuji/zhongyicidian2051/index.html',
  //   'https://www.zysj.com.cn/lilunshuji/zhongyicidian2052/index.html',
  //   'https://www.zysj.com.cn/lilunshuji/zhongyicidian2053/index.html',
  //   'https://www.zysj.com.cn/lilunshuji/zhongyicidian2054/index.html',
  //   'https://www.zysj.com.cn/lilunshuji/zhongyicidian2055/index.html',
  //   'https://www.zysj.com.cn/lilunshuji/zhongyicidian2056/index.html',
  //   'https://www.zysj.com.cn/lilunshuji/zhongyicidian2057/index.html',
  //   'https://www.zysj.com.cn/lilunshuji/zhongyicidian2058/index.html',
  //   'https://www.zysj.com.cn/lilunshuji/zhongyicidian2059/index.html',
  // ]
  // for0:
  // for (let index = 0; index < urls.length; index++) {
  //   const url = urls[index];
  //   await newPage.goto(url);
  //   const itemUl = await newPage.waitForSelector('#catalog-content');
  //   const curData = await itemUl.evaluate(async (e) => {
  //     const tempArr = [];
  //     const songList = Array.from(e.children)
  //     for (let idx = 0; idx < songList.length; idx++) {

  //       const songItem = songList[idx].children[1].children;
        
  //       for (let idx1 = 0; idx1 < songItem.length; idx1++) {
  //         const ele1 = songItem[idx1];
  //         const ele2 = ele1.children[2].children;

  //         for (let idx = 0; idx < ele2.length; idx++) {
  //           const ele = ele2[idx];
  //           tempArr.push({
  //             name: ele.children[0].innerHTML,
  //             href: ele.children[0].href,
  //           })
  //         }

  //       }

  //     }
  //     return tempArr;
  //   })
  //   allData = lodash.concat(allData, curData);
  // };

  // let writerStream = fs.createWriteStream('cidian.json');
  // writerStream.write(JSON.stringify(allData), 'UTF8');
  // writerStream.end();

  // 插入数据
  const insertData = async (addSqlParams, name, addSql) => {
    return new Promise(async (resove, reject) => {
      connection.query(addSql, addSqlParams, (err, result) => {
        if (err) {
          console.log('插入数据库报错');
          errorArr.push(('插入数据库报错--||' + err.message + '----||名词：' + name + '||----time------||' + (+new Date())))
          let writerStream = fs.createWriteStream('./cidian_error.txt');
          writerStream.write(JSON.stringify(errorArr), 'UTF8');
          writerStream.end();
          reject(err);
          return;
        }
        resove(addSqlParams.name);
      });
    })
  }

  const initData = async () => {
    for1:
    for (let index = 0; index < allData.length; index++) {
      if([7746, 10766, 10767, 10783, 10844, 10845, 10849, 10850,
        10851, 10856, 10981,
        11131, 11193, 11545,
        11548, 15874].indexOf(index+1) > -1) {
        try {
          const itemData = allData[index];
          lodash.set(itemData, 'id', `${index+1}`);
          console.log(`运行中: ${index + 1}/${allData.length}`);
          await new Promise((resolve) => setTimeout(resolve, 100));
          await newPage.goto(itemData.href);
          await new Promise((resolve) => setTimeout(resolve, 500));
          const itemUl = await newPage.waitForSelector('#content');
          const curData = await itemUl.evaluate(async (e) => {
            const tempArr = {
              explain: `${e.innerText}`
            };
            
            return tempArr;
          })
          lodash.set(curData, 'name', `${itemData.name}`);
          lodash.set(curData, 'id', `${itemData.id}`);
          // 插入子数据
          await insertData(curData, `${curData.name}`, 'INSERT INTO cidian SET ?');
          await newPage.goBack();
        } catch (error) { }
      }
      
    }
  }
  
  await initData();

  await browser.close();

  connection.end();

})()