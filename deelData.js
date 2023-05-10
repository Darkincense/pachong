const mysql = require('mysql');
const lodash = require('lodash');
const fs = require('fs');
const mainBigData = require('./dazhongyi.json');
const mainData = require('./mainDataFile.json');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root123456',
  database: 'test'
});

connection.connect();

const sql = 'SELECT * FROM fangji';
// const sql = 'SELECT * FROM zhongyao';
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

      // lodash.includes(item.children, '半夏') &&
      // lodash.includes(item.children, '食少')

      // lodash.includes(item.children, '利水') &&
      // lodash.includes(item.children, '活血化瘀')

      // lodash.includes(item.children, '肝胃不和')

      // lodash.includes(item.children, '呃逆') &&
      // '呃逆', '喜唾', '食少', '心下痞', '肠鸣', '肌肤甲错'

      // lodash.includes(item.children, '呃逆') ||
      // lodash.includes(item.children, '肌肤甲错') ||
      // lodash.includes(item.children, '肠鸣') ||
      // lodash.includes(item.children, '心下痞') ||
      // lodash.includes(item.children, '喜唾')

      // lodash.includes(item.children, '气血两亏') &&
      // lodash.includes(item.children, '肝') &&
      
      // lodash.includes(item.children, '胃') &&
      lodash.includes(item.children, '理中汤')
      // lodash.includes(item.children, '呃逆')

      // lodash.includes(item.children, '半夏') &&
      // lodash.includes(item.children, '活血化瘀')

      // lodash.includes(item.children, '困倦') &&
      // lodash.includes(item.children, '食少') &&
      // lodash.includes(item.children, '胃热')

      // lodash.includes(item.children, '腹中结块')

      // lodash.includes(item.children, '苍术') &&
      // lodash.includes(item.children, '白术') &&
      // lodash.includes(item.children, '茯苓') &&
      // lodash.includes(item.children, '陈皮') &&
      // lodash.includes(item.children, '厚朴') &&
      // lodash.includes(item.children, '泽泻') &&
      // lodash.includes(item.children, '人参') &&
      // lodash.includes(item.children, '麦门冬')
      
      
      
      // lodash.includes(item.children, '硫磺')
      // lodash.includes(item.children, '活血化瘀')
      
      // lodash.includes(item.children, '痔疮') &&
      // lodash.includes(item.children, '除')

    ) {
      newData.push(item);
    }
  }
  // console.log(JSON.stringify(newData))
  const writerStream = fs.createWriteStream('deelResult.json');
  writerStream.write(JSON.stringify(newData), 'UTF8');
  writerStream.end();

});

// ["变通血府通瘀汤","萆薢渗湿汤","萆薢渗湿汤","补阳还五汤","补阳还五汤","鳖甲煎丸","鳖甲煎丸","冲和膏","参附龙牡救逆汤","川芎止痛汤","柴胡蚤休汤","肠粘连缓解汤","肠粘连缓解汤","除痹逐瘀汤"," 丹参饮","代杖丹","地奥心血康","大黄(庶虫)虫丸","大黄牡丹汤","当归川芎汤","杜仲酒","疔痈方","复方丹参滴丸","复方丹参片","复方少腹化瘀汤","复方红藤煎","复方通窍活血汤","复肝丸","防风归芎汤","冠心丹参片","宫外孕Ⅱ号方","桂枝茯苓丸","桂枝茯苓丸","肝胃百合汤","膈下逐瘀汤","膈下逐瘀汤","骨痨散","会厌逐瘀汤","会厌逐瘀汤","化坚油","化症回生丹","化瘀止血方","化瘀止血汤","化肝煎","华佗再造丸","和营通络汤","回生丹","回阳通脉饮","活心丸","活瘀止痛洗药","活络丹","活肝汤","活血散瘀汤","活血润燥生津汤","活血膏","活血通经止痛散","活血顺气何首乌散","琥珀镇静汤加味","红藤煎","加减化瘀止痛汤","加减地黄汤","加减真武汤","加减紫癜方","加味利湿化瘀饮","加味桃红四物汤","加味瓜蒌汤","加味生化汤","急救回阳汤","接骨秘方","救产丸","救死活命丹","精制冠心片","结乳膏","蓟菜汤","解毒内消汤","解毒活血汤","解毒通脉汤","鸡香汤","凉血五花汤","凉血四物汤","凉血四物汤","凌霄花散","利湿化瘀汤","利胆化瘀汤","立马回疔丹","立马回疔丹","明目汤","马应龙麝香痔疮膏","宁心汤","脑得生丸","脑得生片","蟠葱散","前列腺增生丸","前列腺汤","清肝活瘀汤","茜草通脉汤","乳块消片","乳核饮","升葛二虫汤","四金化瘀排石汤","手拈散","散血葛根汤","生化汤","生化汤","疏肝解郁活血汤","神应丸","舒心口服液","桃仁散","桃仁芍药汤","桃红四物汤","桃红饮","桃红饮","脱花煎","脱花煎","通幽汤","通幽汤","通瘀煎","通瘀煎","通经止痛汤","通经甘露丸","通膈散","五虫四藤汤","外敷活化散","温经汤","温经汤","下瘀血汤","小续命汤","小续命汤","新清宁片","消栓通络片","消遗汤","血府逐瘀汤","血府逐瘀汤","血康口服液","血竭瓜蒌汤","血腑逐瘀汤加减","益心酮片","益肝汤","越鞠保和丸"," 中风回春片","助阳止痒汤","助阳止痒汤","增液汤","增液汤","泽黄英土汤","滋阴汤"]

connection.end();

// 姜半夏:20g白芍:15g蒸附片:15g桂枝:10g （后下）生姜:20g （自备） （切片）
// 柴胡:12g栀子:10g （捣碎）黄芩:10g苍朮:10g厚朴:20g茯苓:20g猪苓:10g
// 泽泻:15g车前子:20g （包煎）陈皮:15g枳实:20g白茅根:60g益母草:60g
// 泽兰:40g生半夏:10g （捣碎）人参:20g （同煎）黄芪:60g白朮:10g大枣:30g （剪）

// 猪苓10克（去皮）泽泻15克 白术10克 茯苓10克 桂枝7克（去皮） （五苓散）

// 茯苓9克 芍药9克 白术6克 生姜（切）9克 附子5克（炮）  （真武汤）


// [
//   {
//     name: '半夏散',
//     href: 'https://www.zysj.com.cn/zhongyaofang/banxiasan/index.html',
//     index_id: 851
//   },
//   {
//     name: '半夏散',
//     href: 'https://www.zysj.com.cn/zhongyaofang/banxiasan/index.html',
//     index_id: 852
//   },
  // {
  //   name: '半夏汤',
  //   href: 'https://www.zysj.com.cn/zhongyaofang/banxiatang/index.html',
  //   index_id: 867
  // },
//   {
//     name: '槟榔丸',
//     href: 'https://www.zysj.com.cn/zhongyaofang/binglangwan/index.html',
//     index_id: 1281
//   },
//   {
//     name: '槟榔散',
//     href: 'https://www.zysj.com.cn/zhongyaofang/binglangsan/index.html',
//     index_id: 1288
//   },
//   {
//     name: '白术丸',
//     href: 'https://www.zysj.com.cn/zhongyaofang/baishuwan/index.html',
//     index_id: 1426
//   },
//   {
//     name: '白术散',
//     href: 'https://www.zysj.com.cn/zhongyaofang/baishusan/index.html',
//     index_id: 1446
//   },
//   {
//     name: '白术汤',
//     href: 'https://www.zysj.com.cn/zhongyaofang/baishutang/index.html',
//     index_id: 1450
//   },
//   {
//     name: '鳖甲丸',
//     href: 'https://www.zysj.com.cn/zhongyaofang/biejiawan/index.html',
//     index_id: 2771
//   },
//   {
//     name: '鳖甲散',
//     href: 'https://www.zysj.com.cn/zhongyaofang/biejiasan/index.html',
//     index_id: 2781
//   },
//   {
//     name: '柴胡散',
//     href: 'https://www.zysj.com.cn/zhongyaofang/chaihusan/index.html',
//     index_id: 3682
//   },
//   {
//     name: '柴胡汤',
//     href: 'https://www.zysj.com.cn/zhongyaofang/chaihutang/index.html',
//     index_id: 3703
//   },
//   {
//     name: '沉香散',
//     href: 'https://www.zysj.com.cn/zhongyaofang/chenxiangsan/index.html',
//     index_id: 3948
//   },
//   {
//     name: '赤茯苓散',
//     href: 'https://www.zysj.com.cn/zhongyaofang/chifulingsan/index.html',
//     index_id: 4699
//   },
//   {
//     name: '丁香散',
//     href: 'https://www.zysj.com.cn/zhongyaofang/dingxiangsan/index.html',
//     index_id: 5151
//   },
//   {
//     name: '地黄丸',
//     href: 'https://www.zysj.com.cn/zhongyaofang/dihuangwan/index.html',
//     index_id: 5519
//   },
//   {
//     name: '大黄丸',
//     href: 'https://www.zysj.com.cn/zhongyaofang/daihuangwan/index.html',
//     index_id: 6252
//   },
//   {
//     name: '大黄散',
//     href: 'https://www.zysj.com.cn/zhongyaofang/daihuangsan/index.html',
//     index_id: 6264
//   },
//   {
//     name: '大黄汤',
//     href: 'https://www.zysj.com.cn/zhongyaofang/daihuangtang/index.html',
//     index_id: 6275
//   },
//   {
//     name: '当归散',
//     href: 'https://www.zysj.com.cn/zhongyaofang/dangguisan/index.html',
//     index_id: 6716
//   },
//   {
//     name: '当归散',
//     href: 'https://www.zysj.com.cn/zhongyaofang/dangguisan/index.html',
//     index_id: 6717
//   },
//   {
//     name: '当归汤',
//     href: 'https://www.zysj.com.cn/zhongyaofang/dangguitang/index.html',
//     index_id: 6727
//   },
//   {
//     name: '独活散',
//     href: 'https://www.zysj.com.cn/zhongyaofang/duhuosan/index.html',
//     index_id: 7117
//   },
//   {
//     name: '阿胶散',
//     href: 'https://www.zysj.com.cn/zhongyaofang/ejiaosan/index.html',
//     index_id: 8079
//   },
//   {
//     name: '茯苓汤',
//     href: 'https://www.zysj.com.cn/zhongyaofang/fulingtang/index.html',
//     index_id: 8917
//   },
//   {
//     name: '防风散',
//     href: 'https://www.zysj.com.cn/zhongyaofang/fangfengsan/index.html',
//     index_id: 9112
//   },
//   {
//     name: '防风汤',
//     href: 'https://www.zysj.com.cn/zhongyaofang/fangfengtang/index.html',
//     index_id: 9123
//   },
//   {
//     name: '防风汤',
//     href: 'https://www.zysj.com.cn/zhongyaofang/fangfengtang/index.html',
//     index_id: 9124
//   },
//   {
//     name: '附子散',
//     href: 'https://www.zysj.com.cn/zhongyaofang/fuzisan/index.html',
//     index_id: 9218
//   },
//   {
//     name: '厚朴散',
//     href: 'https://www.zysj.com.cn/zhongyaofang/houposan/index.html',
//     index_id: 11133
//   },
//   {
//     name: '寒凉降火汤',
//     href: 'https://www.zysj.com.cn/zhongyaofang/hanliangjianghuotang/index.html',
//     index_id: 11557
//   },
//   {
//     name: '诃黎勒丸',
//     href: 'https://www.zysj.com.cn/zhongyaofang/helilewan/index.html',
//     index_id: 12713
//   },
//   {
//     name: '诃黎勒散',
//     href: 'https://www.zysj.com.cn/zhongyaofang/helilesan/index.html',
//     index_id: 12715
//   },
//   {
//     name: '黄耆丸',
//     href: 'https://www.zysj.com.cn/zhongyaofang/huangqiwan/index.html',
//     index_id: 12943
//   },
//   {
//     name: '黄耆散',
//     href: 'https://www.zysj.com.cn/zhongyaofang/huangqisan/index.html',
//     index_id: 12982
//   },
//   {
//     name: '黄耆汤',
//     href: 'https://www.zysj.com.cn/zhongyaofang/huangqitang/index.html',
//     index_id: 12992
//   },
//   {
//     name: '黄芩汤',
//     href: 'https://www.zysj.com.cn/zhongyaofang/huangqintang/index.html',
//     index_id: 13079
//   },
//   {
//     name: '黄连丸',
//     href: 'https://www.zysj.com.cn/zhongyaofang/huanglianwan/index.html',
//     index_id: 13158
//   },
//   {
//     name: '黄连散',
//     href: 'https://www.zysj.com.cn/zhongyaofang/huangliansan/index.html',
//     index_id: 13191
//   },
//   {
//     name: '加味四物汤',
//     href: 'https://www.zysj.com.cn/zhongyaofang/jiaweisiwutang/index.html',
//     index_id: 14564
//   },
//   {
//     name: '羚羊角散',
//     href: 'https://www.zysj.com.cn/zhongyaofang/lingyangjiaosan/index.html',
//     index_id: 19142
//   },
//   {
//     name: '羚羊角汤',
//     href: 'https://www.zysj.com.cn/zhongyaofang/lingyangjiaotang/index.html',
//     index_id: 19143
//   },
//   {
//     name: '芦荟丸',
//     href: 'https://www.zysj.com.cn/zhongyaofang/luhuiwan/index.html',
//     index_id: 19239
//   },
//   {
//     name: '鹿茸丸',
//     href: 'https://www.zysj.com.cn/zhongyaofang/lurongwan/index.html',
//     index_id: 19705
//   },
//   {
//     name: '麦门冬汤',
//     href: 'https://www.zysj.com.cn/zhongyaofang/maimendongtang/index.html',
//     index_id: 20354
//   },
//   {
//     name: '麦门冬汤',
//     href: 'https://www.zysj.com.cn/zhongyaofang/maimendongtang/index.html',
//     index_id: 20355
//   },
//   {
//     name: '麻黄散',
//     href: 'https://www.zysj.com.cn/zhongyaofang/mahuangsan/index.html',
//     index_id: 20459
//   },
//   {
//     name: '麻黄汤',
//     href: 'https://www.zysj.com.cn/zhongyaofang/mahuangtang/index.html',
//     index_id: 20480
//   }
// ];