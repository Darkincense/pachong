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

function parseHerbString(inputString) {
  // 匹配中文字符、数字和单位的正则表达式
  // ([\u4e00-\u9fa5]+[\s（]*[\u4e00-\u9fa5]*[\s）]*) 字符串|字符串（字符串）
  // [\s(（]*
  // ([一|二|三|四|五|六|七|八|九|十|\d.]+) 中文数字|阿拉伯数字
  // \s*
  // ([克|g|两|半两|钱|半钱|分|斤|适量|片|枚]*) 量词
  // ?[)）]*

  // const regex1 = /([\u4e00-\u9fa5]+[\s（]*[\u4e00-\u9fa5]*[\s）]*)[\s(（]*([一|二|三|四|五|六|七|八|九|十|\d.]+)\s*([克|g|两|半两|两半|钱|半钱|分|斤|适量|片|枚]*)?[)）]*/g; // 该正则1\3\4\5都可提取

  const regex1 = /([\u4e00-\u9fa5]+[\s（]*[\u4e00-\u9fa5]*[\s）]*)[\s(（]*([一|二|三|四|五|六|七|八|九|十|\d.|\s*]+)\s*([克|g|两|半两|两半|钱|半钱|分|斤|适量|片|枚]*)?[)）]*/g;

  // [
  //   { a: '枸杞子', quantity: 15, unit: undefined },
  //   { a: '克 粳米', quantity: 50, unit: '克' }
  // ]

  // 使用lodash的flatMap进行字符串匹配
  const matches = Array.from(inputString.matchAll(regex1));

  // console.log(matches);

  // 通过flatMap和map进行字符串匹配结果的提取
  const herbs = _.flatMap(matches, match => {
      const [, a, b, c, d, input] = match;
      let tempQuanty = parseFloat(b) ? parseFloat(b) : b;

      if(c && parseFloat(c)) {
        tempQuanty = `${parseFloat(b)}~${parseFloat(c)}`
        return { name: a, quantity: tempQuanty, unit: d };
      }
      if(b && parseFloat(b)) {
        return { name: a, quantity: parseFloat(b), unit: c };
      }

      return { name: a, quantity: chineseToArabic(b), unit: c };
  });

  return herbs;
}


// module.exports.parseHerbString = parseHerbString;

// 示例用法
// const input1 = "枸杞25克，菊花20克，地黄15克，当归12克，赤芍9克，苏木15克，青葙子12克，丝瓜络15克，寸冬10克，珍珠母50克，丹参12克，生芪15克。黄芪三分";
// const input2 = "枸杞子15～20克 粳米50克 白糖适量";
// const input3 = "磁石二两(60克)、熟地黄八两(240克)、山茱萸四两(120克)、牡丹皮三两(90克)、山药四两(120克)、茯苓三两(90克)、泽泻三两(90克)、北五味子五钱(15克)、石菖蒲一两半(45克)。";
// const input4 = "磁石（煅）20g 熟地黄160g 山茱萸（制）80g 牡丹皮60g 山药80g 茯苓60g 泽泻60g 竹叶柴胡20g";
// const input5 = "磁石二两、熟地黄八两、山茱萸四两、牡丹皮三两、山药四两、茯苓三两、泽泻三两、北五味子五钱、石菖蒲一两半。";
// const input6 = "藜芦（净洗，焙）蛇床子（去土）红丹（火飞）各15克 硫黄 赤石脂 明矾 （火飞）五倍子（去内虫屑）黄柏（去粗皮）各6克 轻粉少许";
// const input7 = "大黄100g 牵牛子（炒）200g 槟榔100g 人参100g 朱砂30g";

// 枫香（别研）1两，荆芥穗1两，大黄2两，苦参2两，当归2两，升麻2两，白蒺藜2两，枳壳（去瓤，炒）2两，射干1两半。
// 苍术9克 陈皮6克 茯苓9克 泽泻9克 荆芥9克 防风9克 羌活9克 木香3克 乌药9克 生姜3片 大枣5枚
// "麻黄 僵蚕 防风 荆芥 薄荷 甘草各6克 苍术 桃仁 红花 归尾 赤芍各9克"
// "防风 川芎 当归 芍药 大黄 薄荷叶 麻黄 连翘 芒消各15克 石膏 黄芩 桔梗各30克 滑石90克 甘草60克 荆芥 白术 栀子各7.5克"

// const result1 = parseHerbString(input1);
// const result2 = parseHerbString(input2);
// const result3 = parseHerbString(input3);
// const result4 = parseHerbString(input4);
// const result5 = parseHerbString(input5);
// const result6 = parseHerbString(input6);
// const result7 = parseHerbString(input7);

// console.log(result1);
// console.log(result2);
// console.log(result3);
// console.log(result4);
// console.log(result5);
// console.log(result6);
// console.log(result7);

