const puppeteer = require('puppeteer');
const fs = require('fs');
const lodash = require('lodash');
const readline = require('readline');
const mysql = require('mysql');

const tableName = `yian`;
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
  let allData = [];
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

  const initData = async () => {
    for1:
    for (let index = 0; index < allData.length; index++) {
      // if([ 7746 ].indexOf(index+1) > -1) {
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
        await insertData(curData, `${curData.name}`, 'INSERT INTO '+ tableName +' SET ?');
        await newPage.goBack();
      } catch (error) { }
      // }
      
    }
  }



  /* 一个页面内爬取 */
  const onlyOnePage = async (url) => {
    await newPage.goto(url);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const itemUl = await newPage.waitForSelector('#content');
    const curData = await itemUl.evaluate(async (e) => {
      
      const tempArr = [];
      for (let idx = 0; idx < e.children.length; idx++) {
        const item = e.children[idx];
        const tempObj = {
          name: item.children[0].innerText,
        }

        if(item.children.length > 1) {
          let extractedArray = [];
          try {
            extractedArray = Array.from(item.children).slice(1);
          } catch(error) { }

          tempObj.explain = ``;
          for (let j = 0; j < extractedArray.length; j++) {
            const chilItem = extractedArray[j];
            tempObj.explain += `${chilItem.innerText}`;
            if(j < extractedArray.length - 1) tempObj.explain += ` | `;
          }

        }
        tempArr.push(tempObj);
      }

      return tempArr;
    })

    let writerStream = fs.createWriteStream('./yian_temp.json');
    writerStream.write(JSON.stringify(curData), 'UTF8');
    writerStream.end();

    // for (let index = 0; index < curData.length; index++) {
    //   const item = curData[index];
    //   // 插入子数据
    //   await insertData(item, `${item.name}`, 'INSERT INTO '+ tableName +' SET ?');
    // }

  }
  
  // await onlyOnePage(`https://www.zysj.com.cn/lilunshuji/yideji/quanben.html`);
  // await onlyOnePage(`https://www.zysj.com.cn/lilunshuji/yideji/quanben.html`);

  // await initData();

  await browser.close();

  connection.end();

})()