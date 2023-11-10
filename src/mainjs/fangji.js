const puppeteer = require('puppeteer');
const fs = require('fs');
const lodash = require('lodash');
const readline = require('readline');
const mysql = require('mysql');
// const mainData = require('./fangjireq.json');
const mainData = require('./allfangji.json');

const connection = mysql.createConnection({
  // host: '127.0.0.1',
  host: '124.222.84.37',
  user: 'root',
  // password: 'root123456',
  password: '123456!@#Qwe',
  database: 'huilaoye',
  multipleStatements: true
});
try {
  connection.connect();
  console.log('连接成功');
} catch(err) { }
const errorArr = [];
(async () => {
  let allData = mainData['RECORDS'];
  // let allData = [  {
  //   name: '安体散',
  //   href: 'https://www.zysj.com.cn/zhongyaofang/antisan/index.html',
  //   index_id: 867
  // },];
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
  // let writerStream = fs.createWriteStream('fangjireq.json');
  // writerStream.write(JSON.stringify(allData), 'UTF8');

  // 插入数据
  
  const insertData = async (addSqlParams, index, addSql) => {
    return new Promise(async (resove, reject) => {
      connection.query(addSql, addSqlParams, (err, result) => {
        if (err) {
          console.log('插入数据库报错');
          errorArr.push(('插入数据库报错--||' + err.message + '----||第' + index + '个||----time------||' + (+new Date())))
          let writerStream = fs.createWriteStream('fangji_error.txt');
          writerStream.write(JSON.stringify(errorArr), 'UTF8');
          writerStream.end();
          reject(err);
          return;
        }
        resove(addSqlParams.id);
      });
    })
  }

  // 修改数据
  const changeData = (changeSqlParams) => {
    const modSql = 'UPDATE fangji SET children = ? WHERE index_id = ?';
    //改
    connection.query(modSql, changeSqlParams, (err, result) => {
      if(err){
        console.log('[UPDATE ERROR] - ',err.message);
        return;
      }
    });
  }

  // 查询数据
  const searchData = () => {
    const sql = 'SELECT * FROM fangji WHERE index_id = 850';
    //查
    connection.query(sql, (err, result) => {
      if(err){
        console.log('[SELECT ERROR] - ',err.message);
        return;
      }
      console.log(JSON.stringify(result));
    });
  }

  // searchData();

  const initData = async () => {
    for1:
    for (let index = 0; index < allData.length; index++) {
      try {
        // 数据库最后一个id的值
        // if(index+1 === 24504) {
        const itemData = allData[index];
        lodash.set(itemData, 'id', `${index+1}`);
        // 方剂插入数据库
        // await insertData(itemData, index, 'INSERT INTO fangji SET ?');
        console.log(`运行中: ${index + 1}/${allData.length}`);
        await new Promise((resolve) => setTimeout(resolve, 600));
        await newPage.goto(itemData.href);
        await new Promise((resolve) => setTimeout(resolve, 300));
        const itemUl = await newPage.waitForSelector('#content');
        // 详细数据
        const curData = await itemUl.evaluate(async (e) => {
  
          const songList = Array.from(e.children);
          const tempArr = [];
          const includes = (clo, item) => {
            if (clo.indexOf(item) > -1) return true;
            return false;
          }
          for (let idx0 = 0; idx0 < songList.length; idx0++) {
            const itemSon = songList[idx0];
            const tempObj = {
              name: "",
              pinyin_name_phonetic: "",
              alias: "",
              prescription: "",
              making: "",
              functional_indications: "",
              usage: "",
              care: "",
              excerpt: "",
              pharmacological_action: "",
              remark: "",
            };
            lalala:
            for (let idx1 = 0; idx1 < itemSon.children.length; idx1++) {
              const childItem = itemSon.children[idx1];
              const text = childItem.children.length > 1 && childItem.children[1] && childItem.children[1].innerText ? childItem.children[1].innerText : '';

              if(childItem['nodeName'] === 'H2') {
                tempObj['name'] = childItem.innerText;
              }
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
              
            tempArr.push(tempObj);
          }
          return tempArr;
        })
        // 插入子数据
        for (let index1 = 0; index1 < curData.length; index1++) {
          const itemChildren = curData[index1];
          // if(index1+1 === 6) {
            if(!itemChildren.name) {
              lodash.set(itemChildren, 'name', itemData.name);
            }
            lodash.set(itemChildren, 'id', `${index+1}_${index1+1}`);
            lodash.set(itemChildren, 'p_id', `${index+1}`);
            await insertData(itemChildren, `${index+1}_${index1+1}`, 'INSERT INTO fangji_children SET ?');
            console.log('插入子项成功'+`${index+1}-${index1+1}`);
          // }
        }
        await newPage.goBack();
        // };
      } catch (error) { 
        console.log('error');
        console.log(error);
      }
    }
  }

  const setInitData = async () => {
    for1:
    for (let index = 0; index < allData.length; index++) {
      try {
        // 数据库最后一个id的值
        if(index >= 90) {
          const itemData = allData[index];
          // 方剂插入数据库
          console.log(`运行中: ${index + 1}/${allData.length}`);
          await new Promise((resolve) => setTimeout(resolve, 500));
          await newPage.goto(itemData.href);
          await new Promise((resolve) => setTimeout(resolve, 200));
          const itemUl = await newPage.waitForSelector('#content');
          // 详细数据
          const curData = await itemUl.evaluate(async (e) => {
    
            const songList = Array.from(e.children);
            const tempArr = [];
            const includes = (clo, item) => {
              if (clo.indexOf(item) > -1) return true;
              return false;
            }
            for (let idx0 = 0; idx0 < songList.length; idx0++) {
              const itemSon = songList[idx0];
              const tempObj = {
                linchuangyingyong: '',
              };
              lalala:
              for (let idx1 = 0; idx1 < itemSon.children.length; idx1++) {
                const childItem = itemSon.children[idx1];
                const text = childItem.children.length > 1 && childItem.children[1] && childItem.children[1].innerText ? childItem.children[1].innerText : '';
                if(includes(childItem.className, 'linchuangyingyong')) {
                  tempObj['linchuangyingyong'] = text;
                }
              }
              tempArr.push(tempObj);
            }
            return tempArr;
          })
          // 插入子数据
          const updateQuery = "UPDATE fangji_children SET linchuangyingyong = ? WHERE id = ?";
          for (let index1 = 0; index1 < curData.length; index1++) {
            const itemChildren = curData[index1];
            
            if(itemChildren.linchuangyingyong && itemChildren.linchuangyingyong.length > 0) {
              lodash.set(itemChildren, 'id', `${index+1}_${index1+1}`);
              try {
                await insertData([itemChildren.linchuangyingyong, itemChildren.id], `${index+1}_${index1+1}`, updateQuery);
                console.log('插入子项成功'+`${index+1}_${index1+1}`);
                console.log(`${itemChildren.linchuangyingyong}`);
              } catch(error) {
                console.log(error);
              }
            }
          }
          await newPage.goBack();
        }
      } catch (error) { 
        console.log('error');
        console.log(error);
      }
    }
  }

  await setInitData();

  await browser.close();

  connection.end();

})()
