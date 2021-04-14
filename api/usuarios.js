var GenericDAO = require('./genericDAO.js').GenericDAO;

class Usuarios {
  constructor() {
    this.genericDAO = new GenericDAO('Usuarios');
  }

  async find(params) {

    var sqlstring = `	WITH u AS (
        SELECT  u.nombre, u.borrado, u.pk,u.fkperfil,  u.cuenta,u.correo,u.pass,  u.telefono
        FROM public.usuarios u
      )
      SELECT u.* ,p.perfil from u as u
      LEFT JOIN perfiles as p ON u.fkperfil=p.pk  
      WHERE u.borrado=false   ORDER BY u.nombre ASC `;



    return this.genericDAO.find(sqlstring, null);
  }

  async get(pk, params) {
  
    var sqlstring = `SELECT u.pk,u.nombre, u.fkperfil, u.cuenta,u.correo,u.pass,p.perfil, u.telefono  FROM usuarios u LEFT JOIN perfiles as p ON u.fkperfil=p.pk WHERE u.borrado=false AND u.pk=$1`
    return this.genericDAO.get(sqlstring, [pk]);
  }

  async create(data, params) {


    return this.genericDAO.create("INSERT INTO usuarios(pk, nombre,fkperfil,cuenta,correo,pass,  telefono) VALUES($1, $2, $3, $4, $5, $6, $7)",
      [null, data.nombre, data.fkperfil, data.cuenta, data.correo, data.pass, data.telefono]
    );
  }

  async update(pk, data, params) {


    if (data.change_pass != undefined && data.change_pass != null && data.change_pass != '') {
      return this.genericDAO.update("UPDATE usuarios SET pass=$2 WHERE pk=$1", [pk, data.change_pass]);
    }
    else {
      return this.genericDAO.update("UPDATE usuarios SET nombre=$2,fkperfil=$3,cuenta=$4,correo=$5,pass=$6, telefono=$7 WHERE pk=$1",
        [pk, data.nombre, data.fkperfil, data.cuenta, data.correo, data.pass, data.telefono]
      );

    }

  }

  async patch(pk, data, params) {
    const usuario = await this.get(pk);
    return Object.assign(usuario, data);
  }

  async remove(pk, params) {
    return this.genericDAO.update("UPDATE usuarios SET borrado=true WHERE pk=$1", [pk]);
  }
}

module.exports = {
  Usuarios: Usuarios
}