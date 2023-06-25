const mysql = require('mysql');
const lodash = require('lodash');
const fs = require('fs');

const connection = mysql.createConnection({
  // host: '127.0.0.1',
  host: '124.222.84.37',
  user: 'root',
  // password: 'root123456',
  password: '123456!@#Qwe',
  database: 'huilaoye',
  multipleStatements: true
});

connection.connect();
const sql = 'SELECT id FROM cidian';
connection.query(sql, function (err, result) {
  if (err) {
    console.log('[SELECT ERROR] - ', err.message);
    return;
  }
  const newData = [];
  const allLength = 21955
  const allArr = Array.from(new Array(allLength).keys());
  const id_arr = [];
  for1:
  for (let idx = 0; idx < result.length; idx++) {
    const item2 = result[idx];
    id_arr.push(item2.id);
  }
  
  for (let index = 0; index < allArr.length; index++) {
    if(id_arr.indexOf(index+1) == -1) {
      
      newData.push(index+1);
    }
  }
  console.log(newData);
});

connection.end();