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

  /**
   * 通过中药名称批量查询对应的药物信息
   * @param {*} list 
   */
  const getInfoByTCMname = async (list) => {
    let sql = "SELECT * FROM `zhongyao` WHERE ";
    for (let index = 0; index < list.length; index++) {
      const itemData = list[index];
      // sql += "`name` LIKE '%"+ itemData +"%'";
      sql += "`name` LIKE '"+ itemData +"'";
      if(index < list.length - 1) sql += " OR";
    }
    const allData = await getData(sql);

    let sql1 = "SELECT p_id,name,properties_flavor,attribution,functional_indications FROM `zhongyao_children` WHERE `p_id` in (";
    for (let index = 0; index < allData.length; index++) {
      const itemData = allData[index];
      sql1 += "'"+ itemData.id +"'";
      if(index < allData.length - 1) sql1 += ",";
    }
    sql1 += ")";

    const allData1 = await getData(sql1);
    const tempArr = [];
    for (let idx1 = 0; idx1 < allData.length; idx1++) {
      const itemAllData = allData[idx1];
      const tempObj = {
        ...itemAllData,
        children: [],
      }
      for (let idx2 = 0; idx2 < allData1.length; idx2++) {
        const itemAllData1 = allData1[idx2];
        if(tempObj.id === itemAllData1.p_id) {
          tempObj['children'].push(itemAllData1);
        }
      }
      tempArr.push(tempObj);
    }

    let writerStream = fs.createWriteStream('searchResult.json');
    writerStream.write(JSON.stringify(tempArr), 'UTF8');
    writerStream.end();
    return tempArr;
  }

  /**
   * 药物的气味转化成具体数字
   */
  const getPropertiesFlavorNum = (properties_flavor) => {
    if(properties_flavor.indexOf('大寒') > -1) return -4;
    if(properties_flavor.indexOf('寒') > -1 && properties_flavor.indexOf('大寒') === -1) return -3;
    if(properties_flavor.indexOf('微寒') > -1) return -2;
    if(properties_flavor.indexOf('凉') > -1) return -1;
    
    if(properties_flavor.indexOf('平') > -1) return 0;

    if(properties_flavor.indexOf('微温') > -1) return 1;
    if(properties_flavor.indexOf('温') > -1) return 2;
    if(properties_flavor.indexOf('热') > -1 && properties_flavor.indexOf('大热') === -1) return 3;
    if(properties_flavor.indexOf('大热') > -1) return 4;
  }
  /**
   * 根据药物组成查看药物的寒热温凉
   * @param {*} fangjizucheng
   * 气：大寒、寒、微寒、凉、平、微温、温、热、大热 (-4,-3,-2,-1,0,1,2,3,4)
   * 味：酸、苦、肝、辛、咸
   */
    const getFangXing = async (fangjizucheng) => {
      const allData = await getInfoByTCMname(fangjizucheng);
      
      for (let i = 0; i < allData.length; i++) {
        const ele = allData[i];
        const tempArr = [];
        for (let j = 0; j < ele.children.length; j++) {
          const item = ele.children[j];
          const properties_flavor = item.properties_flavor;
          if(properties_flavor) {
            tempArr.push(getPropertiesFlavorNum(properties_flavor));
          }
        }
        console.log(ele.name, tempArr);
      }

      let writerStream = fs.createWriteStream('searchResult.json');
      writerStream.write(JSON.stringify(allData), 'UTF8');
      writerStream.end();
    }

  /**
   * 根据主治方向查询对应药物
   * @param {*} list 主治功能列表 ls：['燥湿化痰']
   * @param {*} attribution 药物归经
   */
  const searchZhongYao = async (list, attribution = '') => {
    let sql1 = "SELECT * FROM `zhongyao_children` WHERE ";
    if(attribution) {
      sql1 += "`attribution` LIKE '%"+ attribution +"%' AND ";
    }
    for (let index = 0; index < list.length; index++) {
      const itemData = list[index];
      sql1 += "`functional_indications` LIKE '%"+ itemData +"%'";
      if(index < list.length - 1) sql1 += " AND";
    }
    const allData = await getData(sql1);
    let writerStream = fs.createWriteStream('searchResult.json');
    writerStream.write(JSON.stringify(allData), 'UTF8');
    writerStream.end();
  }

  /**
   * 根据药物列表，查询所有含有该药物的方剂
   * @param {*} list 
   */
  const getFangjiByName = async (list) => {
    let sql1 = `SELECT *
    FROM fangji_children
    WHERE `;
    for (let index = 0; index < list.length; index++) {
      if(index > 0) sql1 += ` AND `
      sql1 += `prescription LIKE '%${list[index]}%'`
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
  
  // 药物数组
  const fangjizucheng = ['芍药', '甘草', '大黄', '黄连', '半夏', '黄芩', '柴胡', '党参'];
  await getFangXing(fangjizucheng);

  // 批量查询药物信息
  // const arrList = ['芍药', '甘草', '大黄', '黄连', '半夏', '黄芩', '柴胡', '党参']
  // await getInfoByTCMname(arrList);

  // 根据治疗原则查询对应中药
  // const zhengzhuang = ['活血化瘀'];
  // await searchZhongYao(zhengzhuang);

  // 根据中药名称查询包含该中药的所有方剂
  // await getFangjiByName(['附子', '半夏']);

  connection.end();
})()
