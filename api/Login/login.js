var mpg = require('../../lib/mpg.js');
// var g_tipospermisos = { menu: 'menu' };

// var archivos = require("../archivos.js");

function get_infologinDefault() {
  var login = {
    user: {
      nombre: '',
      pk: ''
    }
  };
  return login; 
}

function checkCredenciales(cuenta, pass, cb) {
  var r = { exito: false };
  var sqlstring = 'SELECT pk, nombre, fkperfil, correo, cuenta, pass FROM usuarios   WHERE (cuenta = $1 OR correo = $1) AND pass = $2 AND  borrado = false';
  var sqlvalues = [cuenta, pass];
  mpg.query(sqlstring, sqlvalues, function (err, result) {
    if (err) {
      r.msg = '' + err;
      // console.log('checkCredenciales', r);
      cb(r);
      return;
    }

    r.exito = true;
    r.acceso = false;
    if (result.rowCount == 0) {
      r.msg = 'Cuenta inv&aacute;lida';
      console.log('checkCredenciales', r);
      cb(r);
      return;
    }
    var row = result.rows[0];
    r.acceso = true;
    r.pk = row.pk;
    r.nombre = row.nombre;
    r.fkperfil = row.fkperfil;
    r.correo = row.correo;
    r.cuenta = row.cuenta;
    r.pass = row.pass;

    // console.log('checkCredenciales', r);

    cb(r);
  });
}
function leerPermisos(pkperfil, cb) {
  var r = { exito: false };
  var sqlstring = 'SELECT recurso,leer,crear,editar,borrar FROM permisos WHERE fkperfil = $1 AND borrado = false';
  var sqlvalues = [pkperfil];
  mpg.query(sqlstring, sqlvalues, function (err, result) {
    if (err) {
      r.msg = '' + err;
      // console.log('leerPermisos', r);
      cb(r);
      return;
    }
    if (result.rowCount == 0) {
      r.msg = 'Permisos de perfil ' + pkperfil + ' no encontrados';
      // console.log('leerPermisos', r);
      cb(r);
      return;
    }
    r.exito = true;
    r.permisos = result.rows;
    // console.log('leerPermisos', r);
    cb(r);
  });
}

exports.getSession = function (req, res) {
  res.send(req.session.info_loggin);
}

exports.loginRequest = function (req, res) {
  //console.log(req.body);
  var r_login = { exito: false };
  var g = req.body;
  var permisos = {};
  if (g.user == null) {
    r_login.msg = 'Falta el campo body.user';
    res.send(r_login);
    return;
  }
  if (g.user == "") {
    r_login.msg = 'Ingrese un usuario valido';
    res.send(r_login);
    return;
  }
  if (g.pass == null) {
    r_login.msg = 'Falta el campo body.pass';
    res.send(r_login);
    return;
  }
  if (g.pass == "") {
    r_login.msg = 'Ingrese un password valido';
    res.send(r_login);
    return;
  }
  checkCredenciales(g.user, g.pass, function (res_check) {

    if (!res_check.exito || !res_check.acceso) {
      res.send(res_check);
      return;
    }

    req.session.info_loggin = get_infologinDefault();
    req.session.info_loggin.user.pk = res_check.pk;
    req.session.info_loggin.user.nombre = res_check.nombre;
    req.session.info_loggin.user.fkperfil = res_check.fkperfil;
    req.session.info_loggin.user.correo = res_check.correo;
    req.session.info_loggin.user.cuenta = res_check.cuenta;
    req.session.info_loggin.user.pass = res_check.pass;

    var r = {
      exito: true,
      acceso: true,
      message: 'Bienvenido',
      redirect: '/principal'
    };
    // console.log('loginRequest', r);
    res.send(r);

   



  });

};
exports.defaultRequest = function (req, res) {
  res.render('Login/index', {});
};
exports.logout = function (req, res) {
  req.session.info_loggin = get_infologinDefault();
  req.session.destroy(function (err) {
    // cannot access session here
  })
  res.redirect('/');
};
