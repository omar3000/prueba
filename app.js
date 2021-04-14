const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var session = require('express-session'); 
var routes = require('./routes/index');
var cron = require('node-cron');

const app = express(feathers());
//app.use(express.json({ limit: '50mb' }));
//app.use(express.urlencoded({ extended: true }));

var passport = require('passport');
var expressSession = require('express-session');
var strategy = require('passport-local');
app.use(expressSession({ secret: '680384hkfy302yi3209lj' }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new strategy.Strategy(
        {
            usernameField: 'user',
            passwordField: 'pass',
            passReqToCallback: true
        },
        function (req, username, password, res) {
            (mlogin.loginRequest(req, function (res_perm) {
                res(null, res_perm);
            }));
        }
    )
);

//Pasamos variables de la sesión al rest de feathers
app.configure(express.rest())
    .use(bodyParser.json({limit: '50mb'}))
    .use(bodyParser.urlencoded({limit: '50mb', extended: true}))
    .use(function(req, res, next) {
    req.feathers['session'] = {};
    Object.assign(req.feathers.session, req.session);
    next();
});

var cors = require('cors');
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



//Inicializar servicios
var Usuarios = require('./api/usuarios.js').Usuarios;
var Perfiles = require('./api/perfiles.js').Perfiles;




app.use('api/usuarios', new Usuarios());
app.use('api/perfiles', new Perfiles());

app.use(express.errorHandler());
var fs = require('fs');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join("/", 'postgres')));

app.use('/public', express.static('public')); // <-- This right here

app.use('/', routes);


app.use(function (req, res, next) {

    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    fs.appendFile(__dirname + '/log/requests.log', ip + ': ' + req.path + '\r\n', () => { });

    // console.log("Req.path:%s", req.path);
    if (!req.session.info_loggin) {
        // console.log('COLOCANDO INFOLOGIN DEFAULT');
        var info_loggin = {};
        info_loggin.user = "";
        info_loggin.iduser = -1;
        info_loggin.authenticated = false;
        info_loggin.id_callcenter = -1;
        info_loggin.perfil = -1;
        req.session.info_loggin = info_loggin;
    }
    if (req.path != '\/' && req.path != '\/login') {
        if (req.session.info_loggin.authenticated == false) {
            // console.log('ENVIANDO A INICIAR SESION');
            res.redirect('/');
            return;
        }
    }
    next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



module.exports = {
    app
};
