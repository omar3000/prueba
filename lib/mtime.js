// FUNCIONES PARA PROCESAR FECHAS Y TIEMPOS
var mpg = require('../lib/mpg.js');
var difhoras = 0;
exports.getDiffDays = function(_d1,_d2){
  d1 = new Date(_d1);
  d2 = new Date(_d2);
  d1.setHours(0);
  d1.setMinutes(0);
  d1.setSeconds(0);
  d1.setMilliseconds(0);
  d2.setHours(0);
  d2.setMinutes(0);
  d2.setSeconds(0);
  d2.setMilliseconds(0);
  var timeDiff = Math.abs(d2.getTime() - d1.getTime());
  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
  return diffDays;
};
var getLocalTime = function() {
  var d = new Date();
  var offset = (new Date().getTimezoneOffset() / 60) * -1;
  var n = new Date(d.getTime() + offset);
  d = null;
  return n;
};
exports.getLocalDateTime = function(){
	var d = new Date();
	var curr_date = d.getDate();
	var curr_month = d.getMonth() + 1; //Months are zero based
	var curr_year = d.getFullYear();
	var curr_hr = d.getHours();
	var curr_min = d.getMinutes();
	var curr_seg = d.getSeconds();
	var curr_ts = curr_year + "-" + curr_month + "-" + curr_date + " " + curr_hr + ":" + curr_min + ":" + curr_seg;	
	delete d;	
	return curr_ts;
};
exports.getUTCTimeStamp = function(){
	var d = new Date();
	var curr_date = d.getUTCDate();
	var curr_month = d.getUTCMonth() + 1; //Months are zero based
	var curr_year = d.getUTCFullYear();
	var curr_hr = d.getUTCHours();
	var curr_min = d.getUTCMinutes();
	var curr_seg = d.getUTCSeconds();
	var curr_ts = curr_year + "-" + curr_month + "-" + curr_date + " " + curr_hr + ":" + curr_min + ":" + curr_seg;	
	delete d;	
	return curr_ts;
};
exports.getISOString = function(){
	var d = new Date();	
  var ts = d.toISOString();
	delete d;	
	return ts;
};
exports.getUTCDate = function(){
	var now = new Date(); 
  var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());	
	return now_utc;	
};
exports.getLOCDateString = function(ds){
  var d;
  if(ds)
    d = new Date(ds);
  else
    d = getLocalTime();
	var date = d.getDate();
	var month = d.getMonth() + 1; //Months are zero based
	var year = d.getFullYear();	
  if (date   < 10) {date   = "0"+date;}
  if (month   < 10) {month   = "0"+month;}  
	var curr_ts = year + "-" + month + "-" + date;	
	delete d;	
	return curr_ts;
};
exports.getUTCDateString = function(ds){
  var d = new Date(ds);
  var d_utc = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(),  d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());	
  var year = d_utc.getUTCFullYear();
  var month = d_utc.getUTCMonth() + 1;
  var date = d_utc.getUTCDate();
  if (date   < 10) {date   = "0"+date;}
  if (month   < 10) {month   = "0"+month;}  
	var ts = year + "-" + month + "-" + date;	
  d = null;
  d_utc = null;
  return ts;	
};
exports.convertLocToUTCDate = function(loc){
	//var now = new Date(); 
  var now_utc = new Date(loc.getUTCFullYear(), loc.getUTCMonth(), loc.getUTCDate(),  loc.getUTCHours(), loc.getUTCMinutes(), loc.getUTCSeconds());	
  delete loc;
	return now_utc;	
};
exports.SECtoHHMMSS = function(sec_num){    
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  var time    = hours+':'+minutes+':'+seconds;
  return time;
};
exports.SECtoHHMM = function(sec_num){    
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);  

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}  
  var time    = hours+':'+minutes;
  return time;
};
exports.getDate = function(){
	var utc = this.getUTCDate();
  var now_sis = new Date(utc.valueOf() + (3600000*difhoras));
	return now_sis;	
};
exports.updateZonaHoraria = function(){
  var sqlstring = "SELECT valor FROM config where pkconfig = $1";
  var sqlvalues = [1];
	mpg.query(sqlstring, sqlvalues, function(err,result){
    if(!err){
      if(result.rowCount == 1){
        difhoras = parseInt(result.rows[0].valor);
      }
    }
  });	
};
exports.getNowISOString = function(){
  var d = new Date();
  var s = d.toISOString();
  d = null;
  return s;
};
exports.fixStrDate = function(strdate,caracter){
    if(strdate == null || strdate == "" || strdate.length == 0){
        return "1970-01-01";
    }
    var str = strdate.split(caracter);
    var dia = parseInt(str[0]);
    var mes = parseInt(str[1]);
    var anio = parseInt(str[2]);
    if(anio < 1970){
        mes = parseInt(str[0]);
        dia = parseInt(str[1]);
        anio = anio + 2000;
    }
    if (dia   < 10) {dia   = "0"+dia;}
    if (mes   < 10) {mes   = "0"+mes;}
    var d = anio + '-' + mes + '-' + dia;
    return d;
};
exports.getDateString = function(){
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var ts = year + "-" + month + "-" + date;	
    d = null;
    return ts;
};