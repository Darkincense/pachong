const _ = require('lodash');
const searchResult = require('../mainjs/searchResult.json');  // 引入搜索结果的方剂


function chineseToArabic(chineseNumber) {
  const chineseNumberMap = {
      一: 1,
      二: 2,
      三: 3,
      四: 4,
      五: 5,
      六: 6,
      七: 7,
      八: 8,
      九: 9,
      十: 10
  };

  let result = 0;
  let currentNumber = 0;

  for (let i = 0; i < chineseNumber.length; i++) {
      const char = chineseNumber.charAt(i);

      if (chineseNumberMap[char] !== undefined) {
          currentNumber = chineseNumberMap[char];
      } else if (char === '十') {
          currentNumber *= 10;
      }

      result += currentNumber;
  }

  return result;
}

// /([\u4e00-\u9fa5]+[\s（]*[\u4e00-\u9fa5]*[\s）]*)
// [\s(（]*
// ([一|二|三|四|五|六|七|八|九|十|\d.]+|[适量|少许])
// [\s～]*
// ([一|二|三|四|五|六|七|八|九|十\d.]+)?
// \s*
// ([克|g|两|半两|钱|适量]*)?
// [)）]*
function parseHerbString(inputString) {
  // 匹配中文字符、数字和单位的正则表达式
  // const regex = /([\u4e00-\u9fa5]+[\s（]*[\u4e00-\u9fa5]*[\s）]*)[\s(（]*([一|二|三|四|五|六|七|八|九|十|\d.]+)\s*([克g两半半两钱适量]*)?[)）]*/g;
  // const regex = /([\u4e00-\u9fa5]+)[\s（]*([一|二|三|四|五|六|七|八|九|十\d.]+)[\s～]*([一|二|三|四|五|六|七|八|九|十\d.]+)?\s*([克g两半半两钱]*)?[)）]*/g;

  const regex = /([\u4e00-\u9fa5]+[\s（]*[\u4e00-\u9fa5]*[，|,]*[\u4e00-\u9fa5]*[\s）]*)[\s(（]*([一|二|三|四|五|六|七|八|九|十|\d.]+|[适量|少许])?[\s～]*([一|二|三|四|五|六|七|八|九|十\d.]+)?\s*([克|g|两|半两|钱|分|适量]*)?[)）]*/g;

  // inputString.split(/各([一|二|三|四|五|六|七|八|九|十|\d.]+|[适量|少许])([克|g|两|半两|钱|分|适量]*)/)

  // 使用lodash的flatMap进行字符串匹配
  const matches = Array.from(inputString.matchAll(regex));
  // console.log(matches);
  // 通过flatMap和map进行字符串匹配结果的提取
  const herbs = _.flatMap(matches, match => {
      const [, a, b, c, d, input] = match;
      console.log(match);

      // let tempQuanty = parseFloat(b) ? parseFloat(b) : chineseToArabic(b);

      // if(c && parseFloat(c)) {
      //   tempQuanty = `${parseFloat(b)}~${parseFloat(c)}`
      //   return { a, quantity: tempQuanty, unit: d };
      // }

      return { a, quantity: b, unit: c };

  });

  return herbs;
}

// 示例用法
const input1 = "枸杞25克，菊花20克，地黄15克，当归12克，赤芍9克，苏木15克，青葙子12克，丝瓜络15克，寸冬10克，珍珠母50克，丹参12克，生芪15克。";
const input2 = "枸杞子15～20克 粳米50克 白糖适量";
const input3 = "磁石二两(60克)、熟地黄八两(240克)、山茱萸四两(120克)、牡丹皮三两(90克)、山药四两(120克)、茯苓三两(90克)、泽泻三两(90克)、北五味子五钱(15克)、石菖蒲一两半(45克)。";
const input4 = "磁石（煅）20g 熟地黄160g 山茱萸（制）80g 牡丹皮60g 山药80g 茯苓60g 泽泻60g 竹叶柴胡20g";
const input5 = "磁石二两、熟地黄八两、山茱萸四两、牡丹皮三两、山药四两、茯苓三两、泽泻三两、北五味子五钱、石菖蒲一两半。";
const input6 = "藜芦（净洗，焙）蛇床子（去土）红丹（火飞）各15克 硫黄 赤石脂 明矾 （火飞）五倍子（去内虫屑）黄柏（去粗皮）各6克 轻粉少许";

// const result1 = parseHerbString(input1);
// const result2 = parseHerbString(input2);
// const result3 = parseHerbString(input3);
// const result4 = parseHerbString(input4);
// const result5 = parseHerbString(input5);
const result6 = parseHerbString(input6);

console.log('==============');
// console.log(result1);
// console.log(result2);
// console.log(result3);
// console.log(result4);
// console.log(result5);
// console.log(result6);

// const regex1 = /([\u4e00-\u9fa5]+)适量/;
// const input9 = "白糖适量";
// const match = regex.exec(input);

// if (match) {
//   console.log(match);
//     const name = match[1];
    
//     console.log(`名称：${name}`);
// }
// const arr1 = input9.matchAll(regex1);
// console.log(arr1);


