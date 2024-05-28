var mysql = require('mysql');
import db_connetion from '../configs/db';

var con = mysql.createConnection(db_connetion);

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

export default con;