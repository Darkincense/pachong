const _ = require('lodash');
const searchResult = require('../mainjs/searchResult.json');  // 引入搜索结果的方剂


function chineseToArabic(chineseNumber) {
  const chineseNumberMap = {
    一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10
  };

  let result = 0;
  let currentNumber = 0;

  for (const char of chineseNumber) {
    if (chineseNumberMap[char] !== undefined) {
      currentNumber = chineseNumberMap[char];
    } else if (char === '十') {
      currentNumber *= 10;
    }

    result += currentNumber;
  }

  return result;
}

function containsChinese(str) {
  // 使用正则表达式匹配中文字符
  const chineseRegex = /[\u4e00-\u9fa5]/;
  return chineseRegex.test(str);
}

function parseHerbString(inputString) {
  // const regex = /([\u4e00-\u9fa5]+[\s（]*[\u4e00-\u9fa5]*[，,.。]*[\u4e00-\u9fa5]*[\s）]*)[\s(（]*([一二三四五六七八九十\d.]+)([克g两半两两半钱半钱分斤适量片枚]*)?[)）]*/g; // 适配input8
  // const regex = /([\u4e00-\u9fa5]+[\s（]*[\u4e00-\u9fa5]*[，,.。]*[\u4e00-\u9fa5]*[\s）]*)[\s(（]*([一二三四五六七八九十\d.|适]+[～[\d]*]*)([克g两半两两半钱半钱分斤片枚量]*)?[)）]*/g; // 适配input8和input2

  // TODO成功一小半
  const regex = /([\u4e00-\u9fa5]+[\s（]*[\u4e00-\u9fa5]*[，,.。]*[\u4e00-\u9fa5]*[\s）]*)[\s(（]*([一二三四五六七八九十\d.|适|各]+[～[\d]*]*)([克g两半两两半钱半钱分斤片枚量]*)?[)）]*/g;

  const regex1 = /([\u4e00-\u9fa5]+[\s（]*[\u4e00-\u9fa5]*[，,.。]*[\u4e00-\u9fa5]*[\s）]*)+[\s(（]*([各]+)([一二三四五六七八九十\d.|适|各]+[～[\d]*]*)([克g两半两两半钱半钱分斤片枚量]*)?[)）]*/g

  // 名称  克数       单位
  // 名称  克数~克数  单位   
  // 名称  中文描述重量

  const matches = Array.from(inputString.matchAll(regex1));
  console.log(matches);
  // const herbs = matches.flatMap(match => {
  //   const [, name, quantity, unit] = match;
  //   let tempQuantity;
    
  //   if (quantity && parseFloat(quantity) && quantity.indexOf('～') === -1) {
  //     tempQuantity = parseFloat(quantity);
      
  //   } else if (quantity && quantity.indexOf('～') === -1 && !(containsChinese(quantity) && containsChinese(unit))) {

  //     tempQuantity = `${parseFloat(quantity)}~${parseFloat(match[3])}`;

  //   } else if (containsChinese(quantity) && containsChinese(unit) && quantity.indexOf('～') === -1) {

  //     tempQuantity = `${quantity}${unit}`;
  //   } else if (quantity.indexOf('～') > -1) {

  //     tempQuantity = `${quantity}`;
  //   } else {
  //     tempQuantity = chineseToArabic(quantity);
  //   }

  //   return { name, quantity: tempQuantity, unit };
  // });
  const herbs = [];
  return herbs;
}


// module.exports.parseHerbString = parseHerbString;

const input2 = "枸杞子15～20克 粳米50克 白糖适量";
const input8 = "枫香（别研）1两，荆芥穗1两，大黄2两，苦参2两，当归2两，升麻2两，白蒺藜2两，枳壳（去瓤，炒）2两，射干1两半。"
const input6 = "藜芦（净洗，焙）蛇床子（去土）红丹（火飞）各15克 硫黄 赤石脂 明矾 （火飞）五倍子（去内虫屑）黄柏（去粗皮）各6克 轻粉少许";
// const input6 = "藜芦（净洗，焙）蛇床子（去土）红丹（火飞）各15克 硫黄 赤石脂 明矾 （火飞）五倍子（去内虫屑）黄柏（去粗皮）各6克 轻粉少许";
// // const input9 = "苍术9克 陈皮6克 茯苓9克 泽泻9克 荆芥9克 防风9克 羌活9克 木香3克 乌药9克 生姜3片 大枣5枚"
// const input10 = "麻黄 僵蚕 防风 荆芥 薄荷 甘草各6克 苍术 桃仁 红花 归尾 赤芍各9克"
// const input11 = "防风 川芎 当归 芍药 大黄 薄荷叶 麻黄 连翘 芒消各15克 石膏 黄芩 桔梗各30克 滑石90克 甘草60克 荆芥 白术 栀子各7.5克"

const result = parseHerbString(input6);
// const result8 = parseHerbString(input8);
console.log(result);

