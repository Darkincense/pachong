var mysql = require('mysql');
const lodash = require('lodash');
const mainBigData = require('./dazhongyi.json');
const mainData = require('./mainDataFile.json');

var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root123456',
  database: 'test'
});

connection.connect();

var sql = 'SELECT * FROM fangji';
// var sql = 'SELECT * FROM zhongyao';
//查
connection.query(sql, function (err, result) {
  if (err) {
    console.log('[SELECT ERROR] - ', err.message);
    return;
  }

  const newData = [];
  // allLength = 25427
  // const allArr = Array.from(new Array(25427).keys());
  // const index_id_arr = [];
  // for1:
  // for (let idx = 0; idx < result.length; idx++) {
  //   const item2 = result[idx];
  //   index_id_arr.push(item2.index_id);
  // }
  // for (let index = 0; index < allArr.length; index++) {
  //   if(index_id_arr.indexOf(index+1) == -1) {
  //     // console.log(index+1);
  //     mainData[index]['index_id'] = index+1;
  //     newData.push(mainData[index]);
  //   }
  // }
  // console.log(newData);

  for (let index = 0; index < result.length; index++) {
    const item = result[index];
    if(
      // lodash.includes(item.children, '胃热') &&
      // lodash.includes(item.children, '食少')
      // lodash.includes(item.children, '伤寒论')

      // lodash.includes(item.children, '心下痞硬')
      // lodash.includes(item.children, '食少')

      // lodash.includes(item.children, '利水') &&
      // lodash.includes(item.children, '消肿')

      lodash.includes(item.children, '半夏') &&
      lodash.includes(item.children, '食少')

      // lodash.includes(item.children, '困倦') &&
      // lodash.includes(item.children, '食少') &&
      // lodash.includes(item.children, '胃热')

      // lodash.includes(item.children, '腹中结块')
    ) {
      newData.push(item.name);
    }
  }
  console.log(JSON.stringify(newData))

});

// ["变通血府通瘀汤","萆薢渗湿汤","萆薢渗湿汤","补阳还五汤","补阳还五汤","鳖甲煎丸","鳖甲煎丸","冲和膏","参附龙牡救逆汤","川芎止痛汤","柴胡蚤休汤","肠粘连缓解汤","肠粘连缓解汤","除痹逐瘀汤"," 丹参饮","代杖丹","地奥心血康","大黄(庶虫)虫丸","大黄牡丹汤","当归川芎汤","杜仲酒","疔痈方","复方丹参滴丸","复方丹参片","复方少腹化瘀汤","复方红藤煎","复方通窍活血汤","复肝丸","防风归芎汤","冠心丹参片","宫外孕Ⅱ号方","桂枝茯苓丸","桂枝茯苓丸","肝胃百合汤","膈下逐瘀汤","膈下逐瘀汤","骨痨散","会厌逐瘀汤","会厌逐瘀汤","化坚油","化症回生丹","化瘀止血方","化瘀止血汤","化肝煎","华佗再造丸","和营通络汤","回生丹","回阳通脉饮","活心丸","活瘀止痛洗药","活络丹","活肝汤","活血散瘀汤","活血润燥生津汤","活血膏","活血通经止痛散","活血顺气何首乌散","琥珀镇静汤加味","红藤煎","加减化瘀止痛汤","加减地黄汤","加减真武汤","加减紫癜方","加味利湿化瘀饮","加味桃红四物汤","加味瓜蒌汤","加味生化汤","急救回阳汤","接骨秘方","救产丸","救死活命丹","精制冠心片","结乳膏","蓟菜汤","解毒内消汤","解毒活血汤","解毒通脉汤","鸡香汤","凉血五花汤","凉血四物汤","凉血四物汤","凌霄花散","利湿化瘀汤","利胆化瘀汤","立马回疔丹","立马回疔丹","明目汤","马应龙麝香痔疮膏","宁心汤","脑得生丸","脑得生片","蟠葱散","前列腺增生丸","前列腺汤","清肝活瘀汤","茜草通脉汤","乳块消片","乳核饮","升葛二虫汤","四金化瘀排石汤","手拈散","散血葛根汤","生化汤","生化汤","疏肝解郁活血汤","神应丸","舒心口服液","桃仁散","桃仁芍药汤","桃红四物汤","桃红饮","桃红饮","脱花煎","脱花煎","通幽汤","通幽汤","通瘀煎","通瘀煎","通经止痛汤","通经甘露丸","通膈散","五虫四藤汤","外敷活化散","温经汤","温经汤","下瘀血汤","小续命汤","小续命汤","新清宁片","消栓通络片","消遗汤","血府逐瘀汤","血府逐瘀汤","血康口服液","血竭瓜蒌汤","血腑逐瘀汤加减","益心酮片","益肝汤","越鞠保和丸"," 中风回春片","助阳止痒汤","助阳止痒汤","增液汤","增液汤","泽黄英土汤","滋阴汤"]

connection.end();

// 姜半夏:20g白芍:15g蒸附片:15g桂枝:10g （后下）生姜:20g （自备） （切片）
// 柴胡:12g栀子:10g （捣碎）黄芩:10g苍朮:10g厚朴:20g茯苓:20g猪苓:10g
// 泽泻:15g车前子:20g （包煎）陈皮:15g枳实:20g白茅根:60g益母草:60g
// 泽兰:40g生半夏:10g （捣碎）人参:20g （同煎）黄芪:60g白朮:10g大枣:30g （剪）

// 猪苓10克（去皮）泽泻15克 白术10克 茯苓10克 桂枝7克（去皮） （五苓散）

// 茯苓9克 芍药9克 白术6克 生姜（切）9克 附子5克（炮）  （真武汤）


