// const https = require('https');
// const cheerio = require('cheerio');
// https.get('https://www.zysj.com.cn/lilunshuji/index___14.html',function(res){
//     // 分段返回的 自己拼接
//     let html = '';
//     // 有数据产生的时候 拼接
//     res.on('data',function(chunk){
//         html += chunk;
//     })
//     // 拼接完成
//     res.on('end',function(){
//         console.log(html);
//         const $ = cheerio.load(html);
//         let allFilms = [];
//         $('#nav-first li').each(function(){
//             // this 循环时 指向当前这个电影
//             // 当前这个电影下面的title
//             // 相当于this.querySelector 
//             const title = $('a', this).text();
//             // const star = $('.rating_num',this).text();
//             // const pic = $('.pic img',this).attr('src');
//             // console.log(title,star,pic);
//             // 存 数据库
//             // 没有数据库存成一个json文件 fs
//             console.log('title11111');
//             console.log(title);
//             console.log('title22222');
//             allFilms.push({
//                 title
//             })
//         })
//     })
// })

// 1111111111111111111111111111111111111111111111
(async () => {
  const puppeteer = require('puppeteer');
  const fs = require('fs');
  
  const browser = await puppeteer.launch({
    // ignoreHTTPSErrors: true,
    headless: true,
    // slowMo: 250,
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });
  const newPage = await browser.newPage();
  await newPage.goto('https://www.zysj.com.cn/lilunshuji/mingcicidian/index.html', {waitUntil: 'networkidle2'});
  await newPage.waitForSelector('#catalog-content');

  const itemsList = await newPage.$('#catalog-content'); // Using '.$' is the puppeteer equivalent of 'querySelector'
  // const elementsLi = await itemsList.$$('li'); // Using '.$$' is the puppeteer equivalent of 'querySelectorAll'

  const elementsData = await itemsList.evaluate(async (e) => {
    const songList = Array.from(e.childNodes);
    const mainData = [];
    for (let index = 0; index < songList.length; index++) {
      const itemSong = await songList[index];
      if(itemSong.getAttribute && itemSong.getAttribute('data-click') === 'bI') {
        const children = itemSong.childNodes;
        // console.log('children', children);
        const tempObj1 = {
          fenlei: children[0].innerText,
          children: [],
        }
        for (let idx = 0; idx < children[2].children.length; idx++) {
          const chilNode1 = children[2].children[idx].children[2].children;
          
          for (let idx1 = 0; idx1 < chilNode1.length; idx1++) {
            const finEle = chilNode1[idx1];
            const content = finEle.children[0];
            const tempObj2 = {
              name: content.innerHTML,
              href: content.href,
              detale: '',
            };
            tempObj1.children.push(tempObj2);
          }

        }


        mainData.push(tempObj1);
      }
    }

    // let writerStream = fs.createWriteStream('中医词典1.txt');
    // writerStream.write(JSON.stringify(mainData), 'UTF8');
    // writerStream.end();

    console.log('mainData', mainData)
    return mainData;
  })

  // console.log('elements');
  // console.log(elements);
  forEach1:
  for (let idx2 = 0; idx2 < elementsData.length; idx2++) {
    try {
      const elementData1 = elementsData[idx2];
      console.log(`运行中: ${idx2+1}/${elementsData.length}`);
      forEach2:
      for (let i = 0; i < elementData1.children.length; i++) {
        const element = elementData1.children[i];
        await new Promise((resolve) => setTimeout(resolve, 300));
        await newPage.goto(element.href);
        await new Promise((resolve) => setTimeout(resolve, 400));
        const constentDiv = await newPage.$('#content');
        const text = await constentDiv.evaluate((e) => {
          const songList = Array.from(e.childNodes);
          return songList[1].innerText;
        })
        elementData1.children[i]['detail'] = text;
        await newPage.goBack();
        // if(i === 1) break forEach2;
      }
      // if(idx2 === 3) break forEach1;
    } catch(error) { }
  }

  // let data = [];
  // elements.forEach(async (element) => {
  //   const ref = await element.evaluate((e) => {
  //     const songList = Array.from(e.childNodes);
  //     const tempObj = {
  //       name: songList[0].innerText,
  //       href: songList[0].href,
  //     }
  //     return tempObj;
  //   })
  //   data.push(ref);
  // });
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log('爬取结束');
  let writerStream = fs.createWriteStream('中医词典.txt');
  writerStream.write(JSON.stringify(elementsData), 'UTF8');
  writerStream.end();
  console.log('保存结束');
  await browser.close();
})();

// 22222222222222222222222222222222222
// const fs = require('fs');
// const puppeteer = require('puppeteer');

// (async () => {
//   // 启动浏览器
//   const browser = await puppeteer.launch({
//     headless: false, // 默认是无头模式，这里为了示范所以使用正常模式
//   })

//   // 控制浏览器打开新标签页面
//   const page = await browser.newPage()
//   // 在新标签中打开要爬取的网页
//   await page.goto('https://www.lagou.com/jobs/list_web%E5%89%8D%E7%AB%AF?px=new&city=%E5%B9%BF%E5%B7%9E')

//   // 使用evaluate方法在浏览器中执行传入函数（完全的浏览器环境，所以函数内可以直接使用window、document等所有对象和方法）
//   let data = await page.evaluate(() => {
//     let list = document.querySelectorAll('.s_position_list .item_con_list li')
//     let res = []
//     for (let i = 0; i < list.length; i++) {
//       res.push({
//         name: list[i].getAttribute('data-positionname'),
//         company: list[i].getAttribute('data-company'),
//         salary: list[i].getAttribute('data-salary'),
//         require: list[i].querySelector('.li_b_l').childNodes[4].textContent.replace(/ |\n/g, ''),
//       })
//     }
//     return res
//   })
//   let writerStream = fs.createWriteStream('歌词1.txt');
//   writerStream.write(JSON.stringify(data), 'UTF8');
//   writerStream.end();
//   // console.log(data)
// })()

// 33333333333333333333333333333333333333333333333333333
// const fs = require('fs');
// const puppeteer = require('puppeteer');

// (async () => {
//   const browser = await (puppeteer.launch({ headless: false }));
//   const page = await browser.newPage();
//   // 进入页面
//   await page.goto('https://music.163.com/#');

//   // 点击搜索框拟人输入 鬼才会想起
//   const musicName = '鬼才会想';
//   await page.type('.txt.j-flag', musicName, {delay: 0});

//   // 回车
//   await page.keyboard.press('Enter');

//   // 获取歌曲列表的 iframe
//   // await page.waitFor(2000);
//   await new Promise((resolve) => setTimeout(resolve, 2000));
//   let iframe = await page.frames().find(f => f.name() === 'contentFrame');
//   const SONG_LS_SELECTOR = await iframe.$('.srchsongst');

//   // 获取歌曲 鬼才会想起 的地址
//   const selectedSongHref = await iframe.evaluate(e => {
//     const songList = Array.from(e.childNodes);
//     const idx = songList.findIndex(v => v.childNodes[1].innerText.replace(/\s/g, '') === '鬼才会想起');
//     return songList[idx].childNodes[1].firstChild.firstChild.firstChild.href;
//   }, SONG_LS_SELECTOR);

//   // 进入歌曲页面
//   await page.goto(selectedSongHref);

//   // 获取歌曲页面嵌套的 iframe
//   // await page.waitFor(2000);
//   await new Promise((resolve) => setTimeout(resolve, 2000));
//   iframe = await page.frames().find(f => f.name() === 'contentFrame');

//   // 点击 展开按钮
//   const unfoldButton = await iframe.$('#flag_ctrl');
//   await unfoldButton.click();

//   // 获取歌词
//   const LYRIC_SELECTOR = await iframe.$('#lyric-content');
//   const lyricCtn = await iframe.evaluate(e => {
//     return e.innerText;
//   }, LYRIC_SELECTOR);

//   console.log(lyricCtn);

//   // 截图
//   await page.screenshot({
//     path: '歌曲.png',
//     fullPage: true,
//   });

//   // 写入文件
  // let writerStream = fs.createWriteStream('歌词.txt');
  // writerStream.write(lyricCtn, 'UTF8');
  // writerStream.end();

//   // 获取评论数量
//   const commentCount = await iframe.$eval('.sub.s-fc3', e => e.innerText);
//   console.log(commentCount);

//   // 获取评论
//   const commentList = await iframe.$$eval('.itm', elements => {
//     const ctn = elements.map(v => {
//       return v.innerText.replace(/\s/g, '');
//     });
//     return ctn;
//   });
//   console.log(commentList);
// })();

// 4444444444444444444444444444444444444444444
// const puppeteer = require('puppeteer');

// (async () => {
//   const browser = await puppeteer.launch({
//     // ignoreHTTPSErrors: true,
//     headless: false,
//     // slowMo: 250,
//     defaultViewport: {
//       width: 1920,
//       height: 1080,
//     },
//     // timeout: 0,
//   });
//   const newPage = await browser.newPage();
//   await newPage.goto('https://www.zysj.com.cn/lilunshuji/mingcicidian/index.html');

//   await newPage.waitForSelector('#catalog-content', {
//     visible: true
//   });

//   // const itemsList = await newPage.$('#si5580 ul'); // Using '.$' is the puppeteer equivalent of 'querySelector'
//   // const elements = await itemsList.$$('li'); // Using '.$$' is the puppeteer equivalent of 'querySelectorAll'

//   // elements.forEach(async (element) => {
//   //   const elementsa = await element.$$('a');
//   //   const title = await newPage.$eval('#si5580 > ul > a', el => el.textContent.trim());
//   //   await elementsa[0].click();
//   //   // Get the data you want here and push it into the data array
//   //   // await new Promise((resolve) => setTimeout(resolve, 5000));
//   //   await newPage.goBack();
//   // });
//   const itemsList1 = await newPage.$('#catalog-content');
//   const itemsListli = await itemsList1.$$('li');
//   // const itemsLista = await itemsListli.$$('li');
//   console.log('111111111111111');
//   console.log(itemsListli);
//   console.log('22222222222222');
//   // await browser.close();
// })();
