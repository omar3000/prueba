

function UsuariosDialog(cbAlta, cbCambio, cbCancelar) {

  var row_selected;

  var api = {
    usuarios: "/api/usuarios",
    perfiles: "/api/perfiles",

  };

  var $btnAceptar = $("#SaveUsuarios");
  var $btnCancelar = $("#CancelUsuarios");


  
  async function datapopuptorow(cb) {

    var row = {};


    getValueInput('NombreUsuarios', 'nombre', row);
    getValueInput('CorreoUsuarios', 'correo', row);
    getValueInput('CuentaUsuarios', 'cuenta', row);
    getValueInput('TelefonoUsuarios', 'telefono', row);
    getValueInput('PassUsuariosConfirmacion', 'passConfirmacion', row);
    getValueInput('PassUsuarios', 'pass', row);
    getValueComboBox('PerfilUsuarios', 'fkperfil', 'perfil', row);

    

    if (tieneDatos(row.nombre, 'NombreUsuarios') && tieneDatos(row.fkperfil, 'Perfil')
      && tieneDatos(row.correo, 'Correo') && esCorreo(row.correo, 'Correo')
      && tieneDatos(row.cuenta, 'Cuenta') && tieneDatos(row.pass, 'Contraseña')
      //&& esPassword(row.pass, 'Contraseña') 
      ) {

        cb(row);
      }
      
    
    

  }

  function mostrarModal() {

    $('#passwordModal').modal('open');
    $("#AceptarCambio").unbind();
    $("#AceptarCambio").on("click", function () {
      var actualPassword = $("#PassUsuarios");

      var newPassword = $('#NewPassword');
      var confirmacion = $('#Confirmacion');

      if (newPassword.val() == confirmacion.val()) {
        if (esPassword(newPassword.val(), "Contraseña")) {
          actualPassword.val(newPassword.val());
          onokCambio();
          $('#passwordModal').modal('close');
          newPassword.val('');
          confirmacion.val('');
        }
      }
      else {
        alertify.error('No coinciden la nueva contraseña y la confirmación');
        newPassword.val('');
        confirmacion.val('');
      }

    });
  }


  function onokAlta() {
    datapopuptorow(function (newrow) {
      if (verificarPassword(newrow.pass, newrow.passConfirmacion)) {

        $.ajax({
          url: api.usuarios,
          data: newrow,
          type: 'POST',
          success: function (data) {
            if (data.exito) {
              alertify.success('Alta con &eacute;xito');
              newrow.pk = data.pk;
              row_selected = newrow;
              //Regresar el valor cliente a formato JSON
              cbAlta(row_selected);
              return;
            }
            alertify.alert('Error', data.msg);
          },
          error: function (xhr, status, error) {
            alertify.alert('Error', 'Status: ' + status + ', Mensaje: ' + error);
          }
        });
      }
    });
  }

  function onokCambio() {
    datapopuptorow(function (rowdata) {

      rowdata.pk = row_selected.pk;
    
      $.ajax({
        url: api.usuarios + '/' + rowdata.pk,
        data: rowdata,
        type: 'PUT',
        success: function (data) {
          if (data.exito) {
            alertify.success('Edici&oacute;n con &eacute;xito');
            row_selected = rowdata;
            cbCambio(row_selected);
            return;
          }
          alertify.alert('Error', data.msg);
        },
        error: function (xhr, status, error) {
          alertify.alert('Error', 'Status: ' + status + ', Mensaje: ' + error);
        }
      });
    });
  }

  cargarInput('NombreUsuarios', 'Nombre de usuario', function () {

      cargarInput('CorreoUsuarios', 'Correo de usuario', function () {
        cargarInput('CuentaUsuarios', 'Cuenta de usuario', function () {
          cargarInput('TelefonoUsuarios', 'Teléfono de usuario', function () {
            cargarInput('PassUsuarios', 'Password de usuario', function () {
              cargarInput('PassUsuariosConfirmacion', 'Password de usuario', function () {
                cargarComboBox('PerfilUsuarios', api.perfiles, 'perfil', 'pk', function () {
                
                                          
                    

         
             
              });
            });
          });
        });
      });
    });
  });


  this.init = function (row) {
    row_selected = row;

    if (row_selected.pk == null) {
      onokpopupwin = onokAlta;
      $("#TituloUsuarios").text('Alta de usuario');
      $("#esconder").show();
      $("#CambiarPassword").hide();
    } else {
      $("#esconder").hide();
      $("#CambiarPassword").show();
      onokpopupwin = onokCambio;
      $("#TituloUsuarios").text('Editar usuario');

      $("#CambiarPassword").on("click", function () {
        mostrarModal();
      });

    }


    setValueInput('NombreUsuarios', row_selected.nombre);

    setValueInput('CorreoUsuarios', row_selected.correo);
    setValueInput('CuentaUsuarios', row_selected.cuenta);
    setValueInput('TelefonoUsuarios', row_selected.telefono);
    setValueInput('PassUsuarios', row_selected.pass);
    setValueInput('PassUsuariosConfirmacion', row_selected.passConfirmacion);
    
    setSelectItemComboBox('PerfilUsuarios', row_selected.fkperfil);

    
    M.updateTextFields();

    $btnAceptar.unbind();
    $btnCancelar.unbind();

    $btnAceptar.click(function () {
      onokpopupwin();
    });

    $btnCancelar.click(function () {
      cbCancelar();
    });
  }

}