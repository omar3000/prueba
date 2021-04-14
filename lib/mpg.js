// SECCION: LIBRERIAS
var fs = require('fs');
var pgsql = require("pg");
const { Client } = require('pg');
var mlog = require('../lib/mlog.js');
var mconfig = require('../lib/mconfig.js');
console.log('Conexion: ' + mconfig.pgconexion);

var query_prv = function (sqlstring, sqlvalues, cb) {
  var client = new Client({
    connectionString: mconfig.pgconexion
  });
  client.connect((err) => { 
    if (err) {
      err.sqlstring = sqlstring;
      mlog.debuglog('pgsql.connect', err, new Error());
      if (cb)
        cb(err, null);
      return;
    }
  });

  client.query(sqlstring, sqlvalues, function (err, result) {
    client.end();
    if (err) {
      err.sqlstring = sqlstring;
      err.sqlvalues = sqlvalues;
      mlog.debuglog('pgsql.connect', err, new Error());
      if (cb)
        cb(err, null);
      return;
    }
    if (cb)
      cb(null, result);
    return;
  });
};



var query_act = function (sqlstring, sqlvalues, cb) {
  var client = new Client({
    connectionString: mconfig.pgconexion,
  });
  client.connect();

  client.query(sqlstring, sqlvalues, function (err, result) {
    client.end();
    if (err) {
      err.sqlstring = sqlstring;
      err.sqlvalues = sqlvalues;
      mlog.debuglog('pgsql.connect', err, new Error());
      if (cb)
        cb(err, null);
      return;
    }
    if (cb)
      cb(null, result);
    return;
  });

};

exports.query = function (sqlstring, sqlvalues, cb) {
  if (process.env.QRY_ACT != null && process.env.QRY_ACT == "true") {
    query_act(sqlstring, sqlvalues, cb);
  }
  else {
    query_prv(sqlstring, sqlvalues, cb);
  } 
}; 