var mconfig = {
    nombre: process.env.APP_NAME,
    version: process.env.APP_VERSION,
    puerto: process.env.APP_PUERTO,
    pgconexion: process.env.APP_PG_CONEXION

};
module.exports = mconfig;
