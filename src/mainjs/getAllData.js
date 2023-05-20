const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'root123456',
  database : 'test'
});
connection.connect();
 
var  sql = 'SELECT * FROM fangji';
//查
connection.query(sql,function (err, result) {
    if(err){
      console.log('[SELECT ERROR] - ',err.message);
      return;
    }
    const newResult = result;
    for (let index = 0; index < newResult.length; index++) {
      const ele = newResult[index];
      ele.children = JSON.parse(ele.children);
    }
    result = newResult;
    console.log('--------------------------SELECT----------------------------');
    console.log(result);
    console.log('------------------------------------------------------------\n\n');  
});
 
connection.end();