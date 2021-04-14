var pg = require('pg');


function Accesodb(config) {
  this.config = config || {};
  this.micliente = {} ;

  this.g_consultas = {};
  
  this.execSelect = function( arg_info ) { // JAFF 20150315_1408   
    var that = this;
    this.micliente = new pg.Client(config.conString);

    this.micliente.connect( function(err)
      {
        if(err) {
          var data_error = {error: 1 , descr:"Error al conetarse al postgresql"};
          arg_info.error = 1;
          arg_info.descr ="Error al conetarse al postgresql";
          console.log(err); // JAFF 20150320_1521   
          arg_info.callback(data_error );
          return;
        }
        var query_pedidos = arg_info.query;
        that.micliente.query(query_pedidos,
        function(err, result) 
        {
          if(err) 
           {
			  that.micliente.end();
              var data_error = {error: 1 , descr:"Error en la consulta" };
              arg_info.error = 1;
              arg_info.descr = err;
              arg_info.callback(data_error );
              return;
           }
           that.micliente.end();
           arg_info.error = 0;
           if( result.command == 'UPDATE' )
           {
             arg_info.datos = {rowCount:1} 
           }
           else
           {
             arg_info.datos = result.rows;
           }
           arg_info.desc = "OK";
           arg_info.callback();
        });
     });
  }

  this.cerrarconexion = function() {
     this.micliente.end();
  }

  // Tomando como partida el id de sucursal
  // obtiene los pedidos
  this.getPedidosPorSucursal= function(req, res, asucursal,callback ) {
    var that = this;
    this.micliente = new pg.Client(config.conString);

    this.micliente.connect( function(err) {

        if(err) {
          callback( req,res, { } ,{ error:1,desc:err} );
			return;
        }
        var query_pedidosxsucursal= 'select ped.ticket, ped.direccion, ped.estado, usu.nombre  from pedido ped, repartidor rep, usuario usu where ped.fksucursal=' + asucursal +' and ped.fkrepartidor=rep.pkrepartidor and rep.fkusuario = usu.pkusuario ';
        // 20150329 var query_pedidosxsucursal= 'select test_usuariov4()';
        that.micliente.query(query_pedidosxsucursal,
          function(err, result) {
            if(err) {
				that.micliente.end();
             return console.error('error running query', err);
            }
            if( result.rows.length > 0 )
            that.micliente.end();

            if( res != null )
            {
              // JAFF 20150306_1628   res.render('er('monitor', {datos: result.rows} );monitor', {datos: result.rows} );
            callback( req,res, result.rows,{ error:0,desc:"OK" } );
            }
          }
          );
     });
  }

  // Tomando como partida el id de callcenter
  // obtiene los pedidos
  this.getPedidosDeCallcenter= function(req, res,acallcenter ,callback ) {
    var that = this;
    this.micliente = new pg.Client(config.conString);

    this.micliente.connect( function(err) {

        if(err) {
          callback( req,res, { } ,{ error:1,desc:err} );
			return;
        }

        //20140309 query_pedidos= 'select  suc.nombre as "sucursal", suc.pksucursal  , call.nombre as "callcenter" , ped.pkpedido, ped.ticket, ped.direccion, ped.estado, ped.fkrepartidor as "repartidor" from sucursal suc, callcenter call, pedido ped where call.pkcallcenter ='+ acallcenter +'  and call.pkcallcenter = suc.fkcallcenter and suc.pksucursal = ped.fksucursal';
        var query_pedidosxcallcenter = 'select  suc.nombre as "sucursal", suc.pksucursal , call.nombre as "callcenter" , ped.pkpedido, ped.ticket, ped.direccion, ped.estado, ped.fkrepartidor as "repartidor", (select usu.nombre from repartidor rep,  usuario usu where ped.fkrepartidor = rep.pkrepartidor and rep.fkusuario = usu.pkusuario ) as "nombre_repartidor" from sucursal suc, callcenter call, pedido ped where call.pkcallcenter ='+ acallcenter +  '  and call.pkcallcenter = suc.fkcallcenter and suc.pksucursal = ped.fksucursal'

        that.micliente.query(query_pedidosxcallcenter,
          function(err, result) {
            if(err) {
				that.micliente.end();
             return console.error('error running query', err);
            }
            if( result.rows.length > 0 )
            that.micliente.end();

            if( res != null )
            {
              // JAFF 20150306_1628   res.render('er('monitor', {datos: result.rows} );monitor', {datos: result.rows} );
              callback( req,res, result.rows,{ error:0,desc:"OK" } );
            }
          }
          );
     });
  }

  // Tomando como partidad el id call center
  // obtiene las sucursales con el total de pedidos.
  this.getSucursales = function(req, res, acallcenter, callback) {
    // select ped.ticket, ped.direccion, ped.estado, usu.nombre  from pedido ped, repartidor rep, usuario usu where ped.fksucursal=6 and ped.fkrepartidor=rep.pkrepartidor and rep.fkusuario = usu.pkusuario
    var that = this;
    this.micliente = new pg.Client(config.conString);

    this.micliente.connect( function(err) {

        if(err) {
          callback( req,res, { } ,{ error:1,desc:err} );
			return;
        }
        if( acallcenter == null ) acallcenter = 0;
        var query_sucursales = 'select  suc.pksucursal, suc.nombre, (select count(*) from pedido ped where ped.fksucursal = suc.pksucursal) as "Total", (select count(*) from pedido ped where ped.fksucursal = suc.pksucursal and ped.estado != 4 ) as "PorEntregar" from sucursal suc where suc.fkcallcenter = '+ acallcenter;

        that.micliente.query(query_sucursales,
          function(err, result) {
            if(err) {
			that.micliente.end();
             return console.error('error running query', err);
            }
            if( result.rows.length > 0 )
            that.micliente.end();

            if( res != null )
            {
              // JAFF 20150306_1628   res.render('er('monitor', {datos: result.rows} );monitor', {datos: result.rows} );
              callback( req,res, result.rows,{ error:0,desc:"OK" } );
            }
          }
          );
     });
  }

  function set_asignar_pedido() {
     
  }

}

/**@ inicio export @**/
 exports.Accesodb = Accesodb;
/**@ fin export @**/
