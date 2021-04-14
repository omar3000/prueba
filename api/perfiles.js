var GenericDAO = require('./genericDAO.js').GenericDAO;


class Perfiles {
    constructor() {
        this.genericDAO = new GenericDAO('Perfiles');
    }

    async find(params) {


        return this.genericDAO.find(
            "SELECT pk, perfil FROM perfiles WHERE borrado=false  ORDER BY perfil ASC",
            null
        );
    }

    async get(pk, params) {
        return null;
    }

    async create(data, params) {
        return this.genericDAO.create("INSERT INTO perfiles(pk,perfil) VALUES($1,$2)",
            [null, data.perfil]
        );
    }

    async update(pk, data, params) {
        return this.genericDAO.update("UPDATE perfiles SET perfil=$2 WHERE pk=$1",
            [pk, data.perfil]
        );
    }

    async patch(pk, data, params) {
        const usuario = await this.get(pk);
        return Object.assign(usuario, data);
    }

    async remove(pk, params) {
        return this.genericDAO.update("UPDATE perfiles SET borrado=true WHERE pk=$1", [pk]);
    }
}

module.exports = {
    Perfiles: Perfiles
}
