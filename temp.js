process.on('SIGINT', () => {
  // 我们通过 readline 来简单地实现命令行里面的交互
  // const rl = readline.createInterface({
  //   input: process.stdin,
  //   output: process.stdout
  // });
  // rl.question('任务还没执行完，确定要退出吗？', answer => {
  //   if (answer === 'yes') {
  //     console.log('任务执行中断，退出进程');
  //     process.exit(0);
  //   } else {
  //     console.log('任务继续执行...');
  //   }
  //   rl.close();
  // });
  console.log('推出')
});
