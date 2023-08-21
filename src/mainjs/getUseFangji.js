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

  /**
   * 通过治疗原则获取对应的方剂
   * @param {*} zhengzhuang 
   * @param {*} type 
   * @returns 
   */
  const getFangjiBy = async (zhengzhuang, type = 'OR') => {
    let sql1 = "SELECT * FROM `fangji_children` WHERE ";
    for (let index = 0; index < zhengzhuang.length; index++) {
      const itemData = zhengzhuang[index];
      sql1 += "`functional_indications` LIKE '%"+ itemData +"%'";
      if(index < zhengzhuang.length - 1) sql1 += ` ${type} `;
    }
    sql1 += " LIMIT 0, 10000";
    const allData = await getData(sql1);
    let writerStream = fs.createWriteStream('searchResult.json');
    writerStream.write(JSON.stringify(allData), 'UTF8');
    writerStream.end();
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
  
  // 根据药物数组获取方性
  // const fangjizucheng = ['肉苁蓉'];
  // await getFangXing(fangjizucheng);

  // 批量查询药物信息
  // const arrList = ['鸡血藤']
  // await getInfoByTCMname(arrList);

  // 根据治疗原则查询对应中药
  // const zhengzhuang = ['活血化瘀', '清热解毒'];
  // await searchZhongYao(zhengzhuang);

  // 根据症状数组获取对应方剂
  // const zhengzhuang = ['脾不统血'];
  // const zhengzhuang = ['吼'];
  // const zhengzhuang = ['补血', '活血'];
  // const zhengzhuang = ['气滞血瘀'];
  // await getFangjiBy(zhengzhuang, 'AND');

  // 根据中药名称查询包含该中药的所有方剂
  await getFangjiByName(['山茱萸', '黄芪', '蕤仁', '三七', '大黄', '葛根', '生地黄']);

  connection.end();
})()

// 归脾汤治疗脾不统血
// 白术、当归、白茯苓、炒黄芪、龙眼肉、远志、炒酸枣仁各一钱(各30克)，木香五分(15克) ，人参一钱(30克)，炙甘草三分(10克)。

// 蒸附片(去皮)(42克)、白术(42克)、白茯苓(去皮)(42克)、炮干姜(42克)、厚朴(42克)、木瓜(去瓤)(42克)、草果仁(42克)、大腹子(42克)、当归42g、龙眼肉42g、炒酸枣仁42g、远志42g、木香(21克)；

// 生姜15g、大枣15g。

// 桂枝茯苓丸+四逆散+清半夏
// 牡丹（去心），炒桃仁（去皮），桂枝，茯苓，赤芍，炙甘草，枳实，柴胡，清半夏，当归，川芎，
// 三棱、莪术、水蛭（炒）、海藻、醋鳖甲
