

var theme = 'dd';

var g_index_estatus_selected = -1;
var localizationobj = {};
localizationobj.pagergotopagestring = "Ir a:";
localizationobj.pagershowrowsstring = " Renglones:";
localizationobj.pagerrangestring = " de ";
localizationobj.pagernextbuttonstring = "Siguiente";
localizationobj.pagerpreviousbuttonstring = "Anterior";
localizationobj.sortascendingstring = "Ascendente";
localizationobj.sortdescendingstring = "Descendente";
localizationobj.sortremovestring = "Eliminar orden";
var formatter = new Intl.NumberFormat('es-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});
var g_EventsManager = {};
var g_index_rubro_selected = -1;    // Para mantener el indice del rubro de documentos seleccionado
var g_tiposMovimento = { creado: 0, deposito: 1, impago: 201 };
var getDateString = function (_d) {
  var d;
  if (typeof _d === 'string') {
    d = new Date(_d);
  } else {
    d = _d;
  }
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  var date = d.getDate();
  if (date < 10) {
    date = "0" + date;
  }
  if (month < 10) {
    month = "0" + month;
  }
  var ts = year + "-" + month + "-" + date;
  if (typeof _d === 'string')
     d=null;
  return ts;
};
var getDiffDays = function (_d1, _d2) {
  var d1 = new Date(_d1);
  var d2 = new Date(_d2);
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

function cfg_server() {
  var config = {};
  $.ajax({
    url: '/api/env',
    data: {},
    type: 'GET',
    success: function (data) {
      config = data;
    },
    error: function (xhr, status, error) { }
  });

  return config;
}

var cfg = cfg_server();
