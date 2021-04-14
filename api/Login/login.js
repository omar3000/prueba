var mpg = require('../../lib/mpg.js');
// var g_tipospermisos = { menu: 'menu' };

// var archivos = require("../archivos.js");

function get_infologinDefault() {
  var login = {
    user: {
      nombre: '',
      id: ''
    }
  };
  return login; 
}

function checkCredenciales(username, pass, cb) {
  var r = { exito: false };
  var sqlstring = 'SELECT id, nombre, perfil_id, correo, username, pass FROM usuarios   WHERE (username = $1 OR correo = $1) AND pass = $2 AND  borrado = false';
  var sqlvalues = [username, pass];
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
    r.id = row.id;
    r.nombre = row.nombre;
    r.perfil_id = row.perfil_id;
    r.correo = row.correo;
    r.username = row.username;
    r.pass = row.pass;

    // console.log('checkCredenciales', r);

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
    req.session.info_loggin.user.id = res_check.id;
    req.session.info_loggin.user.nombre = res_check.nombre;
    req.session.info_loggin.user.perfil_id = res_check.perfil_id;
    req.session.info_loggin.user.correo = res_check.correo;
    req.session.info_loggin.user.username = res_check.username;
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
