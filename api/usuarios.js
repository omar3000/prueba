var GenericDAO = require('./genericDAO.js').GenericDAO;

class Usuarios {
  constructor() {
    this.genericDAO = new GenericDAO('Usuarios');
  }

  async find(params) {

    var sqlstring = `	WITH u AS (
        SELECT  u.nombre, u.borrado, u.id,u.perfil_id,  u.username,u.correo,u.pass,  u.telefono
        FROM public.usuarios u
      )
      SELECT u.* ,p.perfil from u as u
      LEFT JOIN perfiles as p ON u.perfil_id=p.id  
      WHERE u.borrado=false   ORDER BY u.nombre ASC `;



    return this.genericDAO.find(sqlstring, null);
  }

  async get(id, params) {
  
    var sqlstring = `SELECT u.id,u.nombre, u.perfil_id, u.username,u.correo,u.pass,p.perfil, u.telefono  FROM usuarios u LEFT JOIN perfiles as p ON u.perfil_id=p.id WHERE u.borrado=false AND u.id=$1`
    return this.genericDAO.get(sqlstring, [id]);
  }

  async create(data, params) {


    return this.genericDAO.create("INSERT INTO usuarios(id, nombre,perfil_id,username,correo,pass,  telefono) VALUES($1, $2, $3, $4, $5, $6, $7)",
      [null, data.nombre, data.perfil_id, data.username, data.correo, data.pass, data.telefono]
    );
  }

  async update(id, data, params) {


    if (data.change_pass != undefined && data.change_pass != null && data.change_pass != '') {
      return this.genericDAO.update("UPDATE usuarios SET pass=$2 WHERE id=$1", [id, data.change_pass]);
    }
    else {
      return this.genericDAO.update("UPDATE usuarios SET nombre=$2,perfil_id=$3,username=$4,correo=$5,pass=$6, telefono=$7 WHERE id=$1",
        [id, data.nombre, data.perfil_id, data.username, data.correo, data.pass, data.telefono]
      );

    }

  }

  async patch(id, data, params) {
    const usuario = await this.get(id);
    return Object.assign(usuario, data);
  }

  async remove(id, params) {
    return this.genericDAO.update("UPDATE usuarios SET borrado=true WHERE id=$1", [id]);
  }
}

module.exports = {
  Usuarios: Usuarios
}