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
      getValueInput('Descripcion', 'descripcion', row);
      //row.perfil = $("#Perfil").val();
      if (tieneDatos(row.perfil, 'Perfil') && tieneDatos(row.descripcion, 'Descripcion')  ){
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
                      newrow.id = data.id;
                      row_selected = newrow;
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
            rowdata.id = row_selected.id;
            $.ajax({  
                url: api.perfiles+'/'+rowdata.id,  
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
        cargarInput('Descripcion', 'Agrega Descripcion', function(){
        });

    });

    this.init = function(row){
        row_selected = row;

        if(row_selected.id == null){
            onokpopupwin = onokAlta;
            $("#Titulo").text('Alta de perfil');
        }
        else{
            onokpopupwin = onokCambio;
            $("#Titulo").text('Editar perfil');
        }

        setValueInput('Perfil', row_selected.perfil);
        setValueInput('Descripcion', row_selected.descripcion);
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