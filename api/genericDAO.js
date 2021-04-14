var mpg = require('../lib/mpg.js');

class GenericDAO {

    constructor(nombreTabla) {
        this.nombreTabla = nombreTabla;
    }

    async find(sqlstring, sqlvalues){
        var nombreTabla = this.nombreTabla; //Necesario por inexistencia en el contexto promise
        let promise = new Promise((resolve) => { 
            var r = { exito: false };
            

                mpg.query(sqlstring, sqlvalues, function (err, result) {
                    if (err) {
                        r.msg = "" + err;
                        console.log(sqlstring);
                        console.log(nombreTabla + '.list', r);
                        resolve(r);
                    }
                    else {  
                        r.exito = true;
                        r.rows = result.rows;
                        resolve(r);
                    }
                });
            
           
        });
        return await promise;
    }

    async get(sqlstring, sqlvalues) {
        var nombreTabla = this.nombreTabla; //Necesario por inexistencia en el contexto promise
        let promise = new Promise((resolve) => { 
            var r = { exito: false };

                mpg.query(sqlstring, sqlvalues, function (err, result) {
                    if (err) {
                        r.msg = "" + err;
                        console.log(nombreTabla + '.get', r);
                        resolve(r);
                    }
                    else {
                        r.exito = true;
                        if(result.rows.length > 0)
                            r.row = result.rows[0];
                        else
                            r.row = null;
                        resolve(r);
                    }
                });
            

        });
        return await promise;
    }

    async create(sqlstring, sqlvalues) {
        var nombreTabla = this.nombreTabla; //Necesario por inexistencia en el contexto promise
        let promise = new Promise((resolve) => { 
            var r = { exito: false };
            mpg.query('select uuid_generate_v1mc() as id', null, function(err,result){
                if(err){
                    r.msg = "" + err;
                    console.log(nombreTabla + '.uuid', r);
                    resolve(r);
                }  
                else {

                        // Si requiere uuid
                        if (sqlvalues[0] == null) {
                            sqlvalues[0] = result.rows[0].id;
                        }
                        
                        mpg.query(sqlstring, sqlvalues, function (err, result) {
                            if (err) {
                                r.msg = "" + err;
                                console.log(nombreTabla + '.create', r);
                                resolve(r);
                            }
                            else if (result.rowCount == 0) {
                                r.msg = "No se insertó, inténtelo de nuevo";
                                console.log(nombreTabla + '.create: ', r);
                                resolve(r);
                            }
                            else {
                                r.exito = true;
                                r.id = sqlvalues[0];
                                
                                resolve(r);
                            }
                        });                        
                    
                }
            });
        });
        return await promise;
    }

    async update(sqlstring, sqlvalues) {
        var nombreTabla = this.nombreTabla; //Necesario por inexistencia en el contexto promise
        let promise = new Promise((resolve) => { 
            var r = { exito: false };
            mpg.query(sqlstring, sqlvalues, function (err, result) {
                if (err) {
                    r.msg = "" + err;
                    console.log(nombreTabla + '.update', r);
                    resolve(r);
                }
                else if (result.rowCount == 0) {
                    r.msg = "No se editó, intentelo de nuevo";
                    console.log(nombreTabla + '.update', r);
                    resolve(r);
                }
                else {
                    r.row = result.rows[0];
                    r.exito = true;
                    resolve(r);
                }
            });
        });
        return await promise;
    }

    async patch(sqlstring, sqlvalues) {
        var nombreTabla = this.nombreTabla; //Necesario por inexistencia en el contexto promise
        let promise = new Promise((resolve) => { 
            var r = { exito: false };
            mpg.query(sqlstring, sqlvalues, function (err, result) {
                if (err) {
                    r.msg = "" + err;
                    console.log(nombreTabla + '.patch', r);
                    resolve(r);
                }
                else if (result.rowCount == 0) {
                    r.msg = "No se editó parcialmente, intentelo de nuevo";
                    console.log(nombreTabla + '.patch', r);
                    resolve(r);
                }
                else {
                    r.exito = true;
                    resolve(r);
                }
            });
        });
        return await promise;
    }

    async remove(sqlstring, sqlvalues) {
        var nombreTabla = this.nombreTabla; //Necesario por inexistencia en el contexto promise
        let promise = new Promise((resolve) => { 
            var r = { exito: false };
            mpg.query(sqlstring, sqlvalues, function (err, result) {
                if (err) {
                    r.msg = "" + err;
                    console.log(nombreTabla + '.delete', r);
                    resolve(r);
                }
                else {
                    r.exito = true;
                    resolve(r);
                }
            });
        });
        return await promise;
    }
}
  
module.exports = {  
    GenericDAO: GenericDAO
}