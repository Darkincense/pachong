// 给定的字符串
var inputString = "藜芦（净洗，焙）蛇床子（去土）红丹（火飞）各15克 硫黄 赤石脂 明矾 （火飞）五倍子（去内虫屑）黄柏（去粗皮）各6克 轻粉少许";

// 将字符串按空格分割成数组
var ingredientsArray = inputString.split(" ");

// 创建对象数组
var objectArray = [];

// 遍历分割后的数组
for (var i = 0; i < ingredientsArray.length; i++) {
    // 通过正则表达式匹配中文和数字
    var matches = ingredientsArray[i].match(/[\u4e00-\u9fa5\d]+/g);

    // 如果匹配到中文和数字
    if (matches && matches.length === 2) {
        var ingredientObject = {
            name: matches[0], // 中文部分作为名称
            amount: parseInt(matches[1]), // 数字部分作为数量，转换为整数
        };

        // 将对象添加到数组中
        objectArray.push(ingredientObject);
    }
}

// 打印结果
console.log(objectArray);
