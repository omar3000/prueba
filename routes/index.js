const express = require('@feathersjs/express');

var path = require('path');
var router = express.Router();
var mlogin = require('../api/Login/login.js');
var mcfg = require('../lib/mconfig.js');


router.get('/api/env', function (req, res) {
  res.send({ env: mcfg });
});
router.get('/', function (req, res) {
  mlogin.defaultRequest(req, res);
});
router.get('/getSession', function (req, res) {
  mlogin.getSession(req, res);
});
router.post('/login', function (req, res) {
  mlogin.loginRequest(req, res);
});
router.get('/logout', function (req, res) {
  mlogin.logout(req, res);
});
router.get('/principal', function (req, res) {
  if (req.session.info_loggin) {
    res.render("principal", { info_loggin: req.session.info_loggin });
  } else {
    mlogin.defaultRequest(req, res);
  }
  // res.render("principal", { info_loggin: req.session.info_loggin });
});



////////////////////////////////////////////////////////////////////////////////////////////////
// SECCION: PERFILES
////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/perfiles/list', function (req, res) {
  res.render("Configuracion/perfiles", { info_loggin: req.session.info_loggin });
});

////////////////////////////////////////////////////////////////////////////////////////////////
// SECCION: USUARIOS
////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/usuarios/list', function (req, res) {
  res.render("Configuracion/usuarios", { info_loggin: req.session.info_loggin });
});




module.exports = router;