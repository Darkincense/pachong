const puppeteer = require('puppeteer');
const fs = require('fs');
const lodash = require('lodash');
const readline = require('readline');
const mysql = require('mysql');
const mainData = require('./allDatamulu.json');
const allAllPageArr = require('./allPageArr.json');

const tableName = `books`;
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
  const tempBigTextArr = [];
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });
  const newPage = await browser.newPage();

  // 插入数据
  const insertData = async (addSqlParams, name, addSql) => {
    return new Promise(async (resove, reject) => {
      connection.query(addSql, addSqlParams, (err, result) => {
        if (err) {
          console.log('插入数据库报错');
          errorArr.push(('插入数据库报错--||' + err.message + '----||名词：' + name + '||----time------||' + (+new Date())))
          let writerStream = fs.createWriteStream('./yian_error.txt');
          writerStream.write(JSON.stringify(errorArr), 'UTF8');
          writerStream.end();
          reject(err);
          return;
        }
        resove(addSqlParams.name);
      });
    })
  }


  /* 一个页面内爬取 */
  const onlyOnePage = async (Bigitem, idx) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await newPage.goto(Bigitem.href);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const itemUl = await newPage.waitForSelector('#content');
    const curData = await itemUl.evaluate(async (e) => {

      const tempArr = [];

      try {
        aa:
        for (let idx = 0; idx < e.children.length; idx++) {
          const item = e.children[idx];
          const tempObj = {
            sub_title: item.children[0].innerText,
          }
  
          if (item.children.length > 1) {
            let extractedArray = [];
            try {
              extractedArray = Array.from(item.children).slice(1);
            } catch (error) { }
  
            tempObj.content = ``;
            for (let j = 0; j < extractedArray.length; j++) {
              const chilItem = extractedArray[j];
              
              tempObj.content += `${chilItem.innerHTML}`;
              if (j < extractedArray.length - 1) tempObj.content += ` | `;
            }
          }
          tempArr.push(tempObj);
        }
      } catch(error) {
        tempArr.push({
          content: `${e.innerHTML}`
        });
      }
      return tempArr;
    })

    for (let index = 0; index < curData.length; index++) {
      const item = curData[index];
      const timestep = (+new Date()).toString().slice(-6);
      const id = lodash.toNumber(`${idx + 1}${timestep}`);
      lodash.set(item, 'book_name', `${Bigitem.book_name}`);
      lodash.set(item, 'id', `${id}`);
      lodash.set(item, 'p_id', `${idx + 1}`);
      // 插入子数据
      try {
        if(item.content && item.content.length > 16000) {
          // console.log(item.content.length);
          lodash.set(item, 'big_content', item.content);
          delete item.content;
          await insertData(item, `${id}`, 'INSERT INTO ' + tableName + ' SET ?');
        } else {
          await insertData(item, `${id}`, 'INSERT INTO ' + tableName + ' SET ?');
        }
      } catch(error) {
        console.log(`报错：${id}`);
        console.log(error);
      }
    }
  }

  /* 获取每个页面的全部展开的页面链接 */
  const getAllPageUrl = async (lists) => {
    const allPageArr = [];
    for (let index = 0; index < lists.length; index++) {
      const item = lists[index];
      console.log(`运行中: ${index + 1}/${lists.length}`);
      for(let keyName in item) {
        const keyValue = item[keyName];
        await new Promise((resolve) => setTimeout(resolve, 200));
        try {
          await newPage.goto(keyValue);
          await new Promise((resolve) => setTimeout(resolve, 200));
          const itemUl = await newPage.waitForSelector('#catalog-info');
          const curData = await itemUl.evaluate(async e => {
            return {
              href: e.children[0].href
            };
          })
          lodash.set(curData, 'book_name', keyName);
          allPageArr.push(curData);
        } catch(error) {
          const itemUl = await newPage.waitForSelector('#catalog-content');
          const curData = await itemUl.evaluate(async e => {
            return {
              href: e.children[0].children[0].href
            };
          })
          console.log('错误');
          console.log(curData);
          lodash.set(curData, 'book_name', keyName);
          allPageArr.push(curData);
        }
        
        await newPage.goBack();
      }
      
      let writerStream = fs.createWriteStream('./allPageArr.json');
      writerStream.write(JSON.stringify(allPageArr), 'UTF8');
      writerStream.end();
    }

  }

  const initData = async () => {
    const bigUrls = [
      `https://www.zysj.com.cn/lilunshuji/index___1.html`,
      `https://www.zysj.com.cn/lilunshuji/index___2.html`,
      `https://www.zysj.com.cn/lilunshuji/index___3.html`,
      `https://www.zysj.com.cn/lilunshuji/index___4.html`,
      `https://www.zysj.com.cn/lilunshuji/index___5.html`,
      `https://www.zysj.com.cn/lilunshuji/index___6.html`,
      `https://www.zysj.com.cn/lilunshuji/index___7.html`,
      `https://www.zysj.com.cn/lilunshuji/index___8.html`,
      `https://www.zysj.com.cn/lilunshuji/index___9.html`,
      `https://www.zysj.com.cn/lilunshuji/index___10.html`,
      `https://www.zysj.com.cn/lilunshuji/index___11.html`,
      `https://www.zysj.com.cn/lilunshuji/index___12.html`,
      `https://www.zysj.com.cn/lilunshuji/index___13.html`,
      `https://www.zysj.com.cn/lilunshuji/index___14.html`,
      `https://www.zysj.com.cn/lilunshuji/index___15.html`,
      `https://www.zysj.com.cn/lilunshuji/index___16.html`,
    ]

    let allUrls = [];
    for1:
    for (let index = 0; index < bigUrls.length; index++) {
      try {
        const itemUrl = bigUrls[index];
        // lodash.set(itemData, 'id', `${index + 1}`);
        // console.log(`运行中: ${index + 1}/${allData.length}`);
        await new Promise((resolve) => setTimeout(resolve, 100));
        await newPage.goto(itemUrl);
        await new Promise((resolve) => setTimeout(resolve, 500));
        const itemUl = await newPage.waitForSelector('#list-content');
        const curData = await itemUl.evaluate(async (e) => {
          console.log(e.children[0].children);
          const tempObj = {};
          
          for (let idx = 0; idx < e.children[0].children.length; idx++) {
            const element = e.children[0].children[idx];
            const key = element.children[0].innerText;
            const value = element.children[0].href;
            tempObj[key] = value;
          }
          return tempObj;
        })
        allUrls.push(curData);
        await newPage.goBack();
      } catch (error) { }

      let writerStream = fs.createWriteStream('./allDatamulu.json');
      writerStream.write(JSON.stringify(allUrls), 'UTF8');
      writerStream.end();
    }
  }


  const getPageData = async () => {
    bb:
    for (let index = 0; index < allAllPageArr.length; index++) {
      if(index+1 > 805) {
        const itemPage = allAllPageArr[index];
        console.log(itemPage);
        console.log(`运行中: ${index + 1}/${allAllPageArr.length}`);
        // https://www.zysj.com.cn/lilunshuji/maijue/101.html
        // console.log(itemPage);
        await onlyOnePage(itemPage, index);
        // break bb;
      }
    }
  }


  // await onlyOnePage(`https://www.zysj.com.cn/lilunshuji/yideji/quanben.html`);
  // await onlyOnePage(`https://www.zysj.com.cn/lilunshuji/dingganrenyian/quanben.html`);

  // await initData();
  
  // await getAllPageUrl(allData);

  await getPageData();

  await browser.close();

  connection.end();

})()