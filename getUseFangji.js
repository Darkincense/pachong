const mysql = require('mysql');
const lodash = require('lodash');
const fs = require('fs');
const mainBigData = require('./dazhongyi.json');
const mainData = require('./mainDataFile.json');

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

(async () => {

  // 数据库查询
  const getData = async (sql) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, (err, result) => {
        if (err) {
          console.log('[SELECT ERROR] - ', err.message);
          reject('[SELECT ERROR] - ');
          return;
        }
        resolve(result);
      })
    })
  }

  // 检测字符串中包不包含数组中一半以上的值
  const testWordsNum = (str, arr) => {
    const allDataNumber = arr.length;
    let count = 0;
    for (let index = 0; index < arr.length; index++) {
      const arrItem = arr[index];
      if(lodash.includes(str, arrItem)) {
        count++
      }
    }
    if(count/allDataNumber >= 0.5) return true;
    if(allDataNumber.length === 0) return true;
    return false;
  }

  // 通过药物组成查看对应方剂
  const getFangjiByPre = async (fangjizucheng) => {
    const req_p_ids = []; // 所有符合条件的子集的父级id
    const finalArr = [];
    const sqlChildren = 'SELECT * FROM fangji_children';
    const allData = await getData(sqlChildren);
    // const fangjizucheng = ['雄精', '梅冰片', '胆矾'];
    for (let index = 0; index < allData.length; index++) {
      const allItem = allData[index];
      // 检测配方中有没有该药
      if(testWordsNum(allItem.prescription, fangjizucheng)) {
        req_p_ids.push(getData(`SELECT * FROM fangji WHERE id = ${allItem.p_id}`));
      }
    }
    const finalData = await Promise.allSettled(req_p_ids);
    for (let index = 0; index < finalData.length; index++) {
      const itemData = finalData[index];
      if(itemData.status === 'fulfilled') {
        finalArr.push(itemData.value[0]);
      }
    }

    // let writerStream = fs.createWriteStream('searchResult.json');
    // writerStream.write(JSON.stringify(finalArr), 'UTF8');
    // writerStream.end();
    return finalArr;
  }

  // 通过主治功能获取对应方剂
  const getFangjiBy = async (zhengzhuang) => {
    const req_p_ids = []; // 所有符合条件的子集的父级id
    const finalArr = [];
    const sqlChildren = 'SELECT * FROM fangji_children';
    const allData = await getData(sqlChildren);
    for (let index = 0; index < allData.length; index++) {
      const allItem = allData[index];
      // 检测配方中有没有该药
      if(testWordsNum(allItem.functional_indications, zhengzhuang)) {
        req_p_ids.push(getData(`SELECT * FROM fangji WHERE id = ${allItem.p_id}`));
      }
    }
    const finalData = await Promise.allSettled(req_p_ids);
    for (let index = 0; index < finalData.length; index++) {
      const itemData = finalData[index];
      if(itemData.status === 'fulfilled') {
        finalArr.push(itemData.value[0]);
      }
    }

    // let writerStream = fs.createWriteStream('searchResult.json');
    // writerStream.write(JSON.stringify(finalArr), 'UTF8');
    // writerStream.end();
    return finalArr;
  }

  // 获取最终汇总数据
  const getFinalData = async (zhengzhuang, fangjizucheng) => {
    const data1 = await getFangjiBy(zhengzhuang);
    const data2 = await getFangjiByPre(fangjizucheng);
    const finalArr =  lodash.uniqBy(lodash.concat(data1, data2), 'id');
    return finalArr;
  }

  // 症状数组
  const zhengzhuang = ['活血化瘀'];
  // await getFangjiBy(zhengzhuang);
  
  // 药物数组
  const fangjizucheng = ['人参', '附子'];
  // await getFangjiByPre(fangjizucheng);

  const allData1 = await getFinalData(zhengzhuang, fangjizucheng);

  const writerStream = fs.createWriteStream('searchResult.json');
  writerStream.write(JSON.stringify(allData1), 'UTF8');
  writerStream.end();
  
  connection.end();
})()
