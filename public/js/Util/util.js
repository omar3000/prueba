
function getSession() {
  return new Promise((resolve) => {
    $.get("/getSession", function (session) {
      resolve(session);
    });
  });
}

function setValueInput(id, valueMember) {
  $('#' + id).jqxInput('val', (valueMember != undefined && valueMember != null) ? valueMember : null);
}

function setValueTextArea(id, valueMember) {
  $('#' + id).jqxTextArea('val', (valueMember != undefined && valueMember != null) ? valueMember : null);
}

function setSelectItemComboBox(id, valueMember) {
  $('#' + id).jqxComboBox('selectItem', (valueMember != undefined && valueMember != null) ? valueMember : null);
}

//valueMember es un array de llaves
function setValuesDropDownList(id, valueMember) {
  $('#' + id).jqxDropDownList('uncheckAll'); 
  if (valueMember != undefined && valueMember != null && valueMember.length > 0){
    for (var i=0; i<valueMember.length; i++){
      $('#' + id).jqxDropDownList('checkItem', valueMember[i]);
    }
  }
}

function getNow(selectDate = undefined) {
  var now;
  if (selectDate == undefined)
    now = new Date($.now());
  else
    now = selectDate;

  var year = now.getFullYear();

  var month = (now.getMonth() + 1).toString().length === 1 ? '0' + (now.getMonth() + 1).toString() : now.getMonth() + 1;
  var date = now.getDate().toString().length === 1 ? '0' + (now.getDate()).toString() : now.getDate();
  var hours = now.getHours().toString().length === 1 ? '0' + now.getHours().toString() : now.getHours();
  var minutes = now.getMinutes().toString().length === 1 ? '0' + now.getMinutes().toString() : now.getMinutes();
  var seconds = now.getSeconds().toString().length === 1 ? '0' + now.getSeconds().toString() : now.getSeconds();

  return year + '-' + month + '-' + date + 'T' + hours + ':' + minutes + ':' + seconds;
}

$.fn.setNow = function (selectDate) {
  $(this).val(getNow(selectDate));
  return this;
}

function dateAdd(date, interval, units) {
  var ret = new Date(date); //don't change original date
  var checkRollover = function () { if (ret.getDate() != date.getDate()) ret.setDate(0); };
  switch (interval.toLowerCase()) {
    case 'year': ret.setFullYear(ret.getFullYear() + units); checkRollover(); break;
    case 'quarter': ret.setMonth(ret.getMonth() + 3 * units); checkRollover(); break;
    case 'month': ret.setMonth(ret.getMonth() + units); checkRollover(); break;
    case 'week': ret.setDate(ret.getDate() + 7 * units); break;
    case 'day': ret.setDate(ret.getDate() + units); break;
    case 'hour': ret.setTime(ret.getTime() + units * 3600000); break;
    case 'minute': ret.setTime(ret.getTime() + units * 60000); break;
    case 'second': ret.setTime(ret.getTime() + units * 1000); break;
    default: ret = undefined; break;
  }
  return ret;
}

Date.prototype.withoutTime = function () {
  var d = new Date(this);
  d.setHours(0, 0, 0, 0);
  return d;
}

/*Obtiene el valor del combobox y lo asigna a la referencia del objeto. 
Si no hay objeto retorna uno nuevo con displayMember y valueMember.
propiedades es un array*/
function getValueComboBox(id, valueMember = 'valueMember', displayMember = 'displayMember', objeto = null, propiedades = null, propiedadesNombres = null) {
  if (objeto == undefined || objeto == null || typeof objeto !== 'object') {
    objeto = {};
  }
  objeto[valueMember] = '';
  objeto[displayMember] = '';
  var selectedItem = $('#' + id).jqxComboBox('getSelectedItem');
  if (selectedItem != null) {
    objeto[valueMember] = selectedItem.value;
    objeto[displayMember] = selectedItem.label;
    if (propiedades != null && propiedadesNombres != null && propiedades.length == propiedadesNombres.length) {
      for (var i = 0; i < propiedades.length; i++) {
        objeto[propiedadesNombres[i]] = selectedItem.originalItem[propiedades[i]];
      }
    }
  }
  return objeto;
}

/*Obtiene el valor del jqxDropDownList y lo asigna a la referencia del objeto. 
Si no hay objeto retorna un nuevo array un array*/
function getValueDropDownList(id, objeto = null) {
  if (objeto == undefined || objeto == null || typeof objeto !== 'object') {
    objeto = {};
  }
  objeto = $("#" + id).jqxDropDownList('getCheckedItems');
  return objeto;
}

function getValueInput(id, valueMember = "valueMember", objeto = null) {
  if (objeto == undefined || objeto == null || typeof objeto !== 'object') {
    objeto = {};
  }
  objeto[valueMember] = $('#' + id).jqxInput('val');
  return objeto;
}

function getValueTextArea(id, valueMember = "valueMember", objeto = null) {
  console.log($('#' + id).jqxTextArea('val'));
  if (objeto == undefined || objeto == null || typeof objeto !== 'object') {
    objeto = {};
  }
  objeto[valueMember] = $('#' + id).jqxTextArea('val');
  return objeto;
}

function cargarInput(id, placeHolder, cb) {
  $('#' + id).jqxInput({ theme: 'material-green', placeHolder: placeHolder, height: 30, width: '100%' });
  cb();
}

function cargarTextArea(id, placeHolder, cb) {
  $('#' + id).jqxTextArea({ theme: 'material-green', placeHolder: placeHolder, height: 30, width: '100%' });
  cb();
}

function cargarComboBox(id, endPoint, displayMember, valueMember, cb, esSelector = false, esEstado = false) {
  $('#' + id).jqxComboBox({
    placeHolder: "Selecciona " + id,
    searchMode: 'containsignorecase',
    autoComplete: true,
    theme: 'darkblue',
    height: 30,
    width: '100%',
  });
  if (endPoint != '') {
    $.ajax({
      url: endPoint,
      data: { esSelector: esSelector, esEstado: esEstado },
      type: 'GET',
      success: function (data) {
        if (data.exito) {
          var sourceinfo =
          {
            localdata: data.rows,
            datatype: "json"
          };
          var dataAdapterInfo = new $.jqx.dataAdapter(sourceinfo);
          $('#' + id).jqxComboBox({
            source: dataAdapterInfo,
            displayMember: displayMember,
            valueMember: valueMember
          });
          cb();
        }
        else {
          alertify.alert('Error al cargar ', data.msg);

          cb();
        }
      },
      error: function (xhr, status, error) {
        alertify.alert('Error', 'Status: ' + status + ', Mensaje: ' + error);

        cb();
      }
    });
  }
  else {
    cb();
  }
}

function cargarDropDownList(id, endPoint, displayMember, valueMember, cb, esSelector = false, esEstado = false, key='') {
  $("#" + id).jqxDropDownList({ 
    width: '100%', 
    height: 36, 
    checkboxes: true, 
  });
  if (endPoint != '') {
    $.ajax({
      url: endPoint,
      data: { esSelector: esSelector, esEstado: esEstado },
      type: 'GET',
      success: function (data) {
        if (data.exito) {
          var sourceinfo =
          {
            localdata: data.rows,
            datatype: "json",
          };
          if (key != ''){
            sourceinfo['id'] = key;
          }
          var dataAdapterInfo = new $.jqx.dataAdapter(sourceinfo);
          $('#' + id).jqxDropDownList({
            source: dataAdapterInfo,
            displayMember: displayMember,
            valueMember: valueMember
          });
          cb();
        }
        else {
          alertify.alert('Error al cargar ', data.msg);

          cb();
        }
      },
      error: function (xhr, status, error) {
        alertify.alert('Error', 'Status: ' + status + ', Mensaje: ' + error);

        cb();
      }
    });
  }
  else {
    cb();
  }
}

function tieneDatos(valor, nombreCampo){
  var tieneDatos = true;
  if (valor == undefined || valor == null || valor == ''){
      alertify.alert('Error','El campo "' + nombreCampo + '" está vacío.').show();
      tieneDatos=false;
  }
  return tieneDatos;
}

function tieneLogitudNecesaria(valor, nombreCampo, min, max){
  var tieneLogitudNecesaria = true;
  if (!(valor.length > min && valor.length <= max)){
      alertify.alert('Error','El campo "' + nombreCampo + '" debe tener mínimo '+min+' caracteres y máximo '+max+'.').show();
      tieneLogitudNecesaria=false;
  }
  return tieneLogitudNecesaria;
} 

function esCorreo(valor, nombreCampo){
  var esCorreo = true;
  var filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!filter.test(valor)) {
      alertify.alert('Error','El campo "' + nombreCampo + '" no es válido.').show();
      esCorreo = false;
  }
  return esCorreo;
}

function esHorario(valor){
  var esHorario = true;
  var filter = /^[0-9]{2}[:][0-9]{2}$/;
  if (!filter.test(valor)) {
      esHorario = false;
  }
  else{
      if(valor.slice(-2) > 59 ){
          esHorario = false;
      }
      else if(valor.substring(0,2) > 23){
          esHorario = false;
      }
  }
  return esHorario;

} 

function esPassword(valor, nombreCampo){
  var esPassword = true;
  var regularExpression = /^(?=\w*[A-Za-z0-9])\S{8,16}$/;
  if (!regularExpression.test(valor)) {
      alertify.error('El campo "' + nombreCampo + '" debe tener minimo 8 caracteres y maximo 16.').show();
      esPassword = false;
  }
  return esPassword;
}

function verificarPassword(pass1, pass2){
 let passwordVerificar = true;
 if(!(pass1 == pass2)){
  alertify.alert('Error', 'Las dos contraseñas no coinciden verifíque y vuelva intentarlo');
  passwordVerificar = false;
 }
 return passwordVerificar;
}

function esNumerico(valor, nombreCampo){
  var esNumerico = true;
  if (isNaN(valor)){
      alertify.alert('Error','El campo "' + nombreCampo + '" solo acepta números.').show();
      esNumerico=false;
  }
  return esNumerico;
}

function esTiempo(valor, nombrecampo){
  var esTiempo = true;
  var regex = /^((\d+)w)?(\s)*((\d+)d)?(\s)*((\d+)h)?(\s)*((\d+)m)?(\s)*$/;
  if (valor.match(regex) == null){
      alertify.alert('Error','El campo "' + nombrecampo + '" no tiene el formato correcto. Ejemplo: 4w 3d 6h 55m').show();
      esTiempo=false;
  }
  return esTiempo;
}

function dameTiempo(valorRegex){
  var regex = /^(?:(\d+)w)?(?:\s)*(?:(\d+)d)?(?:\s)*(?:(\d+)h)?(?:\s)*(?:(\d+)m)?(?:\s)*$/;
  var matches = regex.exec(valorRegex);
  tiempo = []; //semanas, dias, horas, minutos
  for (var i=1; i<matches.length; i++){
      if (matches[i] != undefined)
          tiempo.push(parseInt(matches[i]));
      else
          tiempo.push(0);
  }
  return tiempo;
}

function esCodigoPostal(value, nombreCampo, longitud){
  var esCodigoPostal = true;
  if (value.length != longitud){
      alert('El campo "' + nombreCampo + '" debe tener '+longitud+' dígitos');
      esCodigoPostal=false;
  }
  return esCodigoPostal;
}
