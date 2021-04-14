var fs = require('fs');
var mtime = require('../lib/mtime');


//var ruta_app = __dirname.substring(0, __dirname.length-4) + '/public';
var ruta_app = __dirname.substring(0, __dirname.length-4);

exports.debuglog = function (source, err, trace){
  var msg = {};
  msg.time = mtime.getUTCTimeStamp();
  msg.source = source;
  msg.err = err;
  if(trace){
    msg.tr = trace.stack;
    trace = null;    
  }
	fs.appendFile(ruta_app + '/log/sistema.log', JSON.stringify(msg,null,' '), function (err) {
		if (err) 
      console.log(err);  
	});  
}
exports.filelog = function (file, source, mensaje){
  var msg = {};
  msg.time = mtime.getUTCTimeStamp();
  msg.source = source;
  msg.msg = mensaje;
	fs.appendFile(ruta_app + '/log/'+file+'.log', JSON.stringify(msg,null,'')+'\n', function (err) {
		if (err) 
      console.log(err);  
	});  
}
exports.errorlog = function (source, mensaje){
  var msg = {};
  msg.time = mtime.getISOString();
  msg.source = source;
  msg.msg = mensaje;  
  var archivo = ruta_app + '/log/errores.log';
  console.log(archivo+': '+mensaje);
	fs.appendFile(archivo, JSON.stringify(msg,null,'')+'\n', function (err) {
		if (err) 
      console.log(err);  
	});  
}