function PerfilesDialog(cbAlta, cbCambio, cbCancelar){
    var row_selected;  
    var api = {
        perfiles: "/api/perfiles",
    };
    var $btnAceptar  = $("#Save");
    var $btnCancelar = $("#Cancel");

    function datapopuptorow(cb){
      var row = {};
      getValueInput('Perfil', 'perfil', row);
      //row.perfil = $("#Perfil").val();
      if (tieneDatos(row.perfil, 'Perfil')){
        cb(row);
      }
    }

    function onokAlta(){      
        datapopuptorow(function(newrow){
            $.ajax({  
              url: api.perfiles,  
              data: newrow,
              type:'POST',
              success: function(data) {
                  if(data.exito){
                      alertify.success('Alta con &eacute;xito');
                      newrow.pk = data.pk;
                      row_selected = newrow;

                      //Insertar permisos
                      $.ajax({  
                        url: api.recursos,  
                        data: { fkperfil: newrow.pk },
                        type:'POST',
                        success: function(data) {
                            if(!data.exito){
                                alertify.alert('Error no se pudieron añadir permisos', data.msg);   
                            }  
                        },
                        error: function(xhr,status,error){
                            alertify.alert('Error','Status: '+status+', Mensaje: '+error);   
                        }        
                      });  
                      cbAlta(row_selected);
                  }
                  else
                      alertify.alert('Error',data.msg);  
              },
              error: function(xhr,status,error){
                  alertify.alert('Error','Status: '+status+', Mensaje: '+error);   
              }        
            });  
        });
    }
    function onokCambio(){
        datapopuptorow(function(rowdata){      
            rowdata.pk = row_selected.pk;
            $.ajax({  
                url: api.perfiles+'/'+rowdata.pk,  
                data: rowdata,
                type:'PUT',
                success: function(data) {
                    if(data.exito){
                        alertify.success('Edici&oacute;n con &eacute;xito');
                        row_selected = rowdata;
                        cbCambio(row_selected);
                    }
                    else
                        alertify.alert('Error',data.msg);   
                },
                error: function(xhr,status,error){
                    alertify.alert('Error','Status: '+status+', Mensaje: '+error);   
                }   
            });  
        });
    }
    
    cargarInput('Perfil', 'Inserte Perfil', function(){

    });

    this.init = function(row){
        row_selected = row;

        if(row_selected.pk == null){
            onokpopupwin = onokAlta;
            $("#Titulo").text('Alta de perfil');
        }
        else{
            onokpopupwin = onokCambio;
            $("#Titulo").text('Editar perfil');
        }

        setValueInput('Perfil', row_selected.perfil);
        //$("#Perfil").val(row_selected.perfil);
        M.updateTextFields();

        $btnAceptar.unbind();
        $btnCancelar.unbind();
        $btnAceptar.click(function () {      
            onokpopupwin();
        });  
        $btnCancelar.click(function (){
            cbCancelar();
        });
    }
}