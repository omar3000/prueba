var mpg = require('../lib/mpg.js');
var mlog = require('../lib/mlog.js');
var nodemailer = require('nodemailer');
var path = require('path');
var ejs = require('ejs');
var fs = require('fs');
var pug = require('pug');
var transporterRealfix;
var transporterGmail;
const servidorRealfix = '@realfix.net';

transporterRealfix = nodemailer.createTransport({
        // service: 'Gmail',
    host: 'mail.realfix.net',
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: 'no-reply@realfix.net',
        pass: 'Aaron20345'
    },
    tls: {
        rejectUnauthorized: false
    }
});

transporterGmail = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'noreply.realfix@gmail.com',
        pass: 'fufdij4749rfn33kl'
    },
    tls: {
        rejectUnauthorized: false
    }
});

//Regresa el transporter adecuado dependiendo del servidor del correo (Realfix o Google)
function dameTransporter(correo){
    return (correo.includes(servidorRealfix) ? transporterRealfix : transporterGmail);
}

// SI FUNCIONA
exports.procesar = function (titulo, para, mensaje, attach, cb) {
    var mailOptions = {
        from: 'REALFIX <noreply.realfix@gmail.com>',
        to: para,
        subject: titulo,
        html: mensaje
        //alternatives: [{ path: '/tmp/uploads/logo.png'}
        //],
    };
    if (attach != '')
        mailOptions.attachments = [{ path: attach }];
        dameTransporter(para).sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                if (cb) cb('ERROR', null);
                return;
            }
            console.log('Message sent: ' + info.response);
            if (cb) cb(null, 'OK');
        });
};
exports.procesar2 = function (titulo, para, mensaje, attach, cb) {
    var r = { exit: false };
    var mailOptions = {
        from: 'Web Realfix <noreply.realfix@gmail.com',
        to: para,
        subject: titulo,
        html: mensaje

    };
    if (attach != null)
        mailOptions.attachments = attach;
        dameTransporter(para).sendMail(mailOptions, function (error, info) {
            if (error) {
                r.msg = '' + error;
                console.log('mcorreo.procesar2', error);
                cb(r);
                return;
            }
            console.log('Message sent: ' + info.response);
            r.exito = true;
            cb(r);
        });
};
var cargarHtml = function (ruta, cb) {
    r = { exito: false };
    var archivo = path.join(__dirname, '..', ruta);
    fs.readFile(archivo, function (err, _html) {
        if (err) {
            r.msg = '' + err;
            console.log('cargarHtml', err);
            cb(r);
            return;
        }
        r.html = String.fromCharCode.apply(String, _html);
        r.exito = true;
        cb(r);
    });
};
exports.prepareInvitation = function (options, ruta, cb) {
    var r = { exito: false };
    cargarHtml(ruta, function (res) {
        if (!res.exito) {
            cb(res);
            return;
        }
        r.data_html = ejs.render(res.html, options);
        r.exito = true;
        cb(r);
    });
};

exports.prepareHtml = function (options, ruta, cb) {
    var r = { exito: false };
    cargarHtml(ruta, function (res) {
        if (!res.exito) {
            cb(res);
            return;
        }
        r.data_html = ejs.render(res.html, options);
        r.exito = true;
        cb(r);
    });
};

exports.renderFilePug = function (path_file, data, cb) {
    var r = { exito: false };
    try {
        r.data_html = pug.renderFile(path_file, data);
        r.exito = true;
    } catch (ex) {
        console.log('Exception', ex.message);
        r.msg = ex.message;
    }
    cb(r);
};
exports.renderPug = function (file, data, cb) {
    var archivo = path.join('views', 'partials', file);
    exports.renderFilePug(archivo, data, cb);
};

exports.renderPugFromCron = function (file, data, cb) {
    var dir = __dirname;
    var archivo = path.join(dir, '../', 'views', 'partials', file);
    exports.renderFilePug(archivo, data, cb);
};