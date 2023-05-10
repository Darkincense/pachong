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
  const getFangjiBy = async (zhengzhuang, type = 'OR') => {
    // 模糊查询
    // const sql1 = "SELECT * FROM `fangji_children` WHERE `functional_indications` LIKE '%气血两亏%' OR `functional_indications` LIKE '%气血瘀滞%' ORDER BY `p_id` LIMIT 0, 1000";

    // SELECT * FROM `fangji_children` WHERE `functional_indications` LIKE '%胃气%' AND `functional_indications` LIKE '%活血化瘀%' LIMIT 0, 1000
    // SELECT * FROM `fangji_children` WHERE `functional_indications` LIKE '%胃气%' AND `functional_indications` LIKE '%活血化瘀%' LIMIT 0, 1000

    
    // 根据某一项批量查询
    // const sql1 = "SELECT * FROM `huilaoye`.`fangji_children` WHERE `p_id` in ("+ '1' + ',2' +") ORDER BY `p_id` LIMIT 0, 1000";
    
    let sql1 = "SELECT * FROM `fangji_children` WHERE ";
    for (let index = 0; index < zhengzhuang.length; index++) {
      const itemData = zhengzhuang[index];
      sql1 += "`functional_indications` LIKE '%"+ itemData +"%'";
      if(index < zhengzhuang.length - 1) sql1 += ` ${type} `;
    }
    sql1 += " LIMIT 0, 1000";

    const allData = await getData(sql1);
    let sql2 = "SELECT * FROM `fangji` WHERE `id` in (";
    for (let index = 0; index < allData.length; index++) {
      const allItem = allData[index];
      if(index === 0) {
        sql2 += `${allItem.p_id}`;
      } else {
        sql2 += `,${allItem.p_id}`;
      }
      if(index === allData.length - 1) sql2 += ")";
    }

    const finalData = await getData(sql2);

    let writerStream = fs.createWriteStream('searchResult.json');
    writerStream.write(JSON.stringify(allData), 'UTF8');
    writerStream.end();

    return finalData;
  }

  // 查询药物药理作用
  // WHERE `attribution` LIKE '%肝%' AND `functional_indications` LIKE '%消肿%' ORDER BY `p_id` LIMIT 0, 1000
  const searchZhongYao = async (list, attribution) => {
    let sql1 = "SELECT * FROM `zhongyao_children` WHERE `attribution` LIKE '%"+ attribution +"%' AND ";
    for (let index = 0; index < list.length; index++) {
      const itemData = list[index];
      sql1 += "`functional_indications` LIKE '%"+ itemData +"%'";
      if(index < list.length - 1) sql1 += " OR";
    }
    const allData = await getData(sql1);

    let writerStream = fs.createWriteStream('searchResult.json');
    writerStream.write(JSON.stringify(allData), 'UTF8');
    writerStream.end();
  }

  // 根据方剂列表查询方性
  // properties_flavor  attribution functional_indications
  const getFangXing = async (list) => {
    let sql1 = "SELECT name,properties_flavor,attribution,functional_indications FROM `zhongyao_children` WHERE ";
    for (let index = 0; index < list.length; index++) {
      const itemData = list[index];
      sql1 += "`name` LIKE '%"+ itemData +"%'";
      if(index < list.length - 1) sql1 += " OR";
    }
    const allData = await getData(sql1);
    let writerStream = fs.createWriteStream('searchResult.json');
    writerStream.write(JSON.stringify(allData), 'UTF8');
    writerStream.end();
  }

  const getFangjiByName = async (list) => {
    let sql1 = "SELECT name,prescription,usage,functional_indications FROM `fangji_children` WHERE ";
    for (let index = 0; index < list.length; index++) {
      const itemData = list[index];
      sql1 += "`name` LIKE '%"+ itemData +"%'";
      if(index < list.length - 1) sql1 += " OR";
    }
    const allData = await getData(sql1);
    let writerStream = fs.createWriteStream('searchResult.json');
    writerStream.write(JSON.stringify(allData), 'UTF8');
    writerStream.end();
  }

  // 症状数组
  // const zhengzhuang = ['呃逆', '喜唾', '食少', '心下痞', '肠鸣', '肌肤甲错'];
  // const zhengzhuang = ['气血两亏', '气血瘀滞'];
  // const zhengzhuang = ['纳少', '呆滞', '食欲不振'];
  // await getFangjiBy(zhengzhuang);

  // 查询对应中药
  // const zhengzhuang = ['补'];
  // await searchZhongYao(zhengzhuang, '肾');
  
  // 药物数组
  // const fangjizucheng = [];
  // await getFangjiByPre(fangjizucheng);

  // 根据药物数组查询方性
  // const arrList = ['漂海藻','生甘草','木鳖子','醋鳖甲','蛇舌草','夏枯草','骚休','海蛤壳','黄药子','生半夏','生姜', '元参', '牡蛎', '大贝', '山茨菇', '山豆根', '全虫', '蜈蚣', '明雄黄'];
  // await getFangXing(arrList);

  // 根据名称查询方剂
  await getFangjiByName(['理中汤', '附子']);


  
  
  connection.end();
})()
