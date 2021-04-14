var GenericDAO = require('./genericDAO.js').GenericDAO;


class Perfiles {
    constructor() {
        this.genericDAO = new GenericDAO('Perfiles');
    }

    async find(params) {


        return this.genericDAO.find(
            "SELECT id, perfil, descripcion FROM perfiles WHERE borrado=false  ORDER BY perfil ASC",
            null
        );
    }

    async get(id, params) {
        return null;
    }

    async create(data, params) {
        return this.genericDAO.create("INSERT INTO perfiles(id,perfil, descripcion) VALUES($1,$2,$3)",
            [null, data.perfil, data.descripcion]
        );
    }

    async update(id, data, params) {
        return this.genericDAO.update("UPDATE perfiles SET perfil=$2, descripcion=$3 WHERE id=$1",
            [id, data.perfil, data.descripcion]
        );
    }

    async patch(id, data, params) {
        const usuario = await this.get(id);
        return Object.assign(usuario, data);
    }

    async remove(id, params) {
        return this.genericDAO.update("UPDATE perfiles SET borrado=true WHERE id=$1", [id]);
    }
}

module.exports = {
    Perfiles: Perfiles
}
