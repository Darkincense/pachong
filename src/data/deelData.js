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
    // ([\u4e00-\u9fa5]+[\s（]*[\u4e00-\u9fa5]*[\s）]*)
    // [\s(（]*
    // ([一|二|三|四|五|六|七|八|九|十|\d.]+)
    // \s*
    // ([克g两半半两钱适量]*)
    // ?[)）]*
    const regex = /([\u4e00-\u9fa5]+[\s（]*[\u4e00-\u9fa5]*[\s）]*)[\s(（]*([一|二|三|四|五|六|七|八|九|十|\d.]+)\s*([克g两半半两钱适量]*)?[)）]*/g;
    // const regex = /([\u4e00-\u9fa5]+)[\s(（]*([\d.]+)\s*([克g两半半两钱]*)?[)）]*/g;

    // 使用lodash的flatMap进行字符串匹配
    const matches = Array.from(inputString.matchAll(regex));

    // 通过flatMap和map进行字符串匹配结果的提取
    const herbs = _.flatMap(matches, match => {
        const [, name, quantity, unit] = match;
        const tempQuanty = parseFloat(quantity) ? parseFloat(quantity) : chineseToArabic(quantity);
        return { name, quantity: tempQuanty, unit };
    });

    return herbs;
}





function parseIngredients(input) {
    // 正则表达式用于匹配名称和重量，包括范围值  
    const regex = /(\D+?)(?:\s*～\s*(\d+(\.\d+)?(?:克|两|钱|g)?))?(?:\s+(\d+(\.\d+)?(?:克|两|钱|g)?))?/g;
    const ingredients = [];

    let match;
    let name = '';
    let weightRange = '';
    let weightExact = '';

    while ((match = regex.exec(input)) !== null) {
        // 可能存在三种匹配情况：只有名称、名称+范围、名称+范围+精确值  
        // match[1] 是名称  
        // match[3] 是范围值（如果存在）  
        // match[5] 是精确值（如果存在）  

        if (match[1]) {
            name = match[1].trim();
        }

        if (match[3]) {
            // 处理范围值，转换为 '范围1~范围2' 的格式  
            weightRange = `${parseFloat(match[2].trim()) || 0}~${parseFloat(match[3].trim().replace(/克|两|钱|g/g, '')) || 0}克`;
        }

        if (match[5]) {
            // 处理精确值，转换为克为单位  
            weightExact = parseFloat(match[5].trim().replace(/克|两|钱|g/g, '')) || 0;
            weightExact = weightExact.toFixed(2) + '克'; // 保留两位小数  

            // 如果同时存在范围值和精确值，通常只取精确值  
            weightRange = '';
        }

        // 如果找到了名称和某个重量（范围或精确），则添加到结果数组中  
        if (name && (weightRange || weightExact)) {
            ingredients.push({
                name,
                weight: weightRange || weightExact
            });

            // 重置变量以便处理下一个成分  
            name = '';
            weightRange = '';
            weightExact = '';
        }
    }

    return JSON.stringify(ingredients, null, 2); // 转换为格式化的 JSON 字符串  
}function parseIngredients(input) {  
    // 正则表达式用于匹配名称和重量  
    // 假设名称不包含数字，且紧跟在数字后面的单位（如“克”）不是名称的一部分  
    const regex = /(\D+?)(\d+(\.\d+)?(?:克|两|钱|g)?)/g;  
    const ingredients = [];  
  
    let match;  
    while ((match = regex.exec(input)) !== null) {  
        // 匹配到的数组，index 0 是整个匹配项，index 1 是名称，index 2 是重量（可能包含小数点和单位）  
        const name = match[1].trim(); // 去除名称前后的空格  
        let weight = match[2].trim(); // 去除重量前后的空格  
  
        // 处理单位，转换为统一单位（克）  
        if (weight.endsWith('两')) {  
            weight = (parseFloat(weight.slice(0, -1)) * 50).toFixed(2) + '克'; // 1两 = 50克  
        } else if (weight.endsWith('钱')) {  
            weight = (parseFloat(weight.slice(0, -1)) * 3.75).toFixed(2) + '克'; // 1钱 = 3.75克  
        } else if (weight.endsWith('g')) {  
            weight = weight.slice(0, -1); // 去除'g'单位  
        }  
  
        // 添加到结果数组中  
        ingredients.push({ name, weight });  
    }  
  
    return JSON.stringify(ingredients, null, 2); // 转换为格式化的 JSON 字符串  
} 

// 示例用法
const input1 = "枸杞25克，菊花20克，地黄15克，当归12克，赤芍9克，苏木15克，青葙子12克，丝瓜络15克，寸冬10克，珍珠母50克，丹参12克，生芪15克。";
const input2 = "枸杞子15～20克 粳米50克 白糖适量";  // 无法适配
const input3 = "磁石二两(60克)、熟地黄八两(240克)、山茱萸四两(120克)、牡丹皮三两(90克)、山药四两(120克)、茯苓三两(90克)、泽泻三两(90克)、北五味子五钱(15克)、石菖蒲一两半(45克)。";
const input4 = "磁石（煅）20g 熟地黄160g 山茱萸（制）80g 牡丹皮60g 山药80g 茯苓60g 泽泻60g 竹叶柴胡20g";
const input5 = "磁石二两、熟地黄八两、山茱萸四两、牡丹皮三两、山药四两、茯苓三两、泽泻三两、北五味子五钱、石菖蒲一两半。";
const input6 = "藜芦（净洗，焙）蛇床子（去土）红丹（火飞）各15克 硫黄 赤石脂 明矾 （火飞）五倍子 （去内虫屑）黄柏（去粗皮）各6克 轻粉少许"; // 无法适配

const result1 = parseIngredients(input1);
const result2 = parseIngredients(input2);
const result3 = parseIngredients(input3);
const result4 = parseIngredients(input4);
const result5 = parseIngredients(input5);
const result6 = parseIngredients(input6);

console.log(result1);
console.log(result2);
console.log(result3);
console.log(result4);
console.log(result5);
console.log(result6);