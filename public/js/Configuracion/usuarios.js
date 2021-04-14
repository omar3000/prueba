function updatePageUsuarios(cbEnd) {
  var api = {
    usuarios: "/api/usuarios"
  };
  var $btnAlta = $("#AltaUsuarios");
  var $btnCambio = $("#CambioUsuarios");

  var $btnBaja = $("#BajaUsuarios");
  var $grid = $("#jqxgridUsuarios");
  var row_selected = null;
  var index_selected = -1;
  var usuariosDialog = new UsuariosDialog(cbAlta, cbCambio, cbCancelar);


  this.init = function () {
    
    $("#divPerfilUsuarios").hide();

    $('#' + perfilDefault).prop('selected', true);

    $("#encabezadoUsuarios").text('Contactos');
    getSession().then((session) => {
      updateGrid(session.user.perfil_id);
    });
  }

  function hideWindow() {
    $("#SecondaryWindowUsuarios").hide();
    $("#MainWindowUsuarios").show();
  }
  function showWindow() {
    $("#MainWindowUsuarios").hide();
    $("#SecondaryWindowUsuarios").show();
  }

  function cbAlta(newrow) {
    $("#botones").show();
    $grid.jqxGrid('addrow', newrow.id, newrow);
    hideWindow();
  }

  function cbCambio(rowdata) {
    $("#botones").show();
    console.log(rowdata);
    $grid.jqxGrid('updaterow', rowdata.id, rowdata);
    hideWindow();
  }

  function cbCancelar() {
    $("#botones").show();
    hideWindow();
  }

  function initButtons(cb){    
    $btnAlta.click(function () {
        console.log('Entro');
        usuariosDialog.init({ 
            id: null, 
            nombre: '',
            username: '',
            correo: '',
            pass: '',
            perfil_id: null,
            telefono: ''
        });
        setReadWindow(false);
        $("#botones").hide();
        showWindow();
    });          
    $btnBaja.click(function () {       
          if(index_selected < 0){
              alertify.alert('Usuarios','Para editar o borrar primero debe seleccionar un registro').show();
              return;
          }
          var rowdata = $grid.jqxGrid('getrowdata', index_selected);
          var mensaje = '¿Confirma borrar el usuario '+rowdata.nombre + '?';
          alertify.confirm('Borrar',mensaje, onokBorrar, onCancelBorrar).set('labels', {ok:'Aceptar', cancel:'Cancelar'});
    });
    $btnCambio.click(function (){
        var rowindex = $grid.jqxGrid('getselectedrowindex');    
        if(rowindex == -1){
            alertify.alert('Usuarios','Para editar o borrar primero debe seleccionar un registro').show();
            return;
        }
        var rowdata = $grid.jqxGrid('getrowdata', rowindex);
        usuariosDialog.init(rowdata);
        setReadWindow(false);
        $("#botones").hide();
        showWindow();
    });

    $('#RegresarUsuarios').click(function(){
        cbCancelar();
    });
    cb();
  }




  function onokBorrar() {
    var rowdata = {};
    rowdata.id = row_selected.id;
    $.ajax({
      url: api.usuarios + '/' + rowdata.id,
      data: rowdata,
      type: 'DELETE',
      success: function (data) {
        if (data.exito) {
          alertify.success('Registro eliminado');
          $grid.jqxGrid('deleterow', rowdata.id);
          $btnBaja.prop('disabled', true);
          $btnCambio.prop('disabled', true);
          return;
        }
        alertify.alert('Error', data.msg);
      },
      error: function (xhr, status, error) {
        alertify.alert('Error', 'Status: ' + status + ', Mensaje: ' + error);
      }
    });
  }
  function onCancelBorrar() {

  }
  function updateGrid(nombrePerfil) {
    var source = {
      datatype: "json",
      data: {nombrePerfil: nombrePerfil },
      datafields: [
        { name: 'id', type: 'string' },
        { name: 'perfil_id', type: 'string' },
        { name: 'nombre', type: 'string' },
        { name: 'username', type: 'string' },
        { name: 'correo', type: 'string' },
        { name: 'pass', type: 'string' },
        { name: 'perfil', type: 'string' },
        { name: 'telefono', type: 'string' },

      ],
      id: 'id',
      url: api.usuarios
    };
    var dataAdapter = new $.jqx.dataAdapter(source, {
      downloadComplete: function (data, status, xhr) {
        if (data.exito) {
          data = data.rows;
        } else {
          alertify.alert('Error', data.msg);
        }
      },
      loadComplete: function (data) { },
      loadError: function (xhr, status, error) {
        alertify.alert('Error', 'Status: ' + status + ', Mensaje: ' + error);
      }
    });
    $grid.jqxGrid({ source: dataAdapter });
  }




  function initGrid(cb) {
    var alto = window.innerHeight - 250;
    var rowsheight = 25;
    $grid.jqxGrid({
      width: '100%',
      height: alto,
      rowsheight: rowsheight,
      pageable: true,
      columnsresize: true,
      showfilterrow: true,
      filterable: true,
      columns: [
        { text: 'Nombre', datafield: 'nombre', minwidth: 200, width: '24%', align: 'center', cellsalign: 'left' },
        { text: 'Usuario', datafield: 'username', minwidth: 200, width: '24%', align: 'center', cellsalign: 'left' },
        { text: 'Correo', datafield: 'correo', minwidth: 200, width: '23%', align: 'center', cellsalign: 'left' },
        { text: 'Perfil', datafield: 'perfil', minwidth: 200, width: '23%', align: 'center', cellsalign: 'left' },
        {
          text: '',
          datafield: 'id',
          minwidth: 40, width: '6%',
          filterable: false,
          cellsalign: 'right',
          align: 'center',
          createwidget: function (row, column, value, htmlElement) {
            var id = row.bounddata.id;
            var button = $("<button id='" + id + "' class='btn-small btn-flat'><i class='material-icons'>visibility</i></button>");
            $(htmlElement).append(button);
            $('#' + id).click(function () {
              usuariosDialog.init(row.bounddata);
              $("#TituloUsuarios").text('Ver usuarios');
              $("#botones").hide();
              setReadWindow(true);
              showWindow();
            });
          },
          initwidget: function (row, column, value, cellElement) { }
        },
      ]
    });

    $grid.jqxGrid('localizestrings', localizationobj);
    $grid.bind('bindingcomplete', function (event) {
    });
    $grid.on('rowselect', function (event) {
      index_selected = event.args.rowindex;
      row_selected = event.args.row;
      $btnBaja.prop('disabled', false);
      $btnCambio.prop('disabled', false);
    });
    cb();
  }

  function setReadWindow(isRead) {
    $('#NombreUsuarios').prop('readonly', isRead);
    //$("#PerfilUsuarios").jqxComboBox({ disabled: isRead });
    $('#PerfilUsuarios').prop("disabled", isRead);
    $('#TelefonoUsuarios').prop('readonly', isRead);
    $('#CorreoUsuarios').prop('readonly', isRead);
    $('#CuentaUsuarios').prop('readonly', isRead);
    $('#PassUsuarios').prop('readonly', isRead);
    $('select').formSelect();
    if (isRead) {
      $('#SaveUsuarios').hide();
      $('#CancelUsuarios').hide();
    }
    else {
      $('#SaveUsuarios').show();
      $('#CancelUsuarios').show();
    }
  }


  function inicializarDialogo() {
    $('.modal').modal({
      dismissible: true
    });
  }

  initButtons(function () {
    initGrid(function () {
      getSession().then((session) => {
        updateGrid(session.user.perfil_id);
        inicializarDialogo();
      });
    });
  });
}