var g_EventsManager = {};

function updateGridPerfiles(nombrePerfil, cbEnd) {
    var api = {
        recursos: "/api/recursos",
        perfiles: "/api/perfiles"
    };
    var $btnAlta = $("#Alta");
    var $btnCambio = $("#Cambio");
    var $btnBaja = $("#Baja");
    var $grid = $("#jqxgrid");
    var perfilesDialog = new PerfilesDialog(cbAlta, cbCambio, cbCancelar);

    var row_selected = null;
    var index_selected = -1;
    function hideWindow() {
        $("#SecondaryWindow").hide();
        $("#MainWindow").show();
    }
    function showWindow() {
        $("#MainWindow").hide();
        $("#SecondaryWindow").show();
    }

    function cbAlta(newrow) {
        $grid.jqxGrid('addrow', newrow.pk, newrow);
        hideWindow();
    }

    function cbCambio(rowdata) {
        $grid.jqxGrid('updaterow', rowdata.pk, rowdata);
        hideWindow();
    }

    function cbCancelar() {
        hideWindow();
    }
    function onokBorrar() {
        var rowdata = {};
        rowdata.pk = row_selected.pk;
        $.ajax({
            url: api.perfiles + '/' + rowdata.pk,
            data: rowdata,
            type: 'DELETE',
            success: function (data) {
                if (data.exito) {
                    alertify.success('Registro eliminado');
                    var commit = $grid.jqxGrid('deleterow', rowdata.pk);
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
    function updateGrid() {
        var source = {
            datatype: "json",
            datafields: [
                { name: 'pk', type: 'string' },
                { name: 'perfil', type: 'string' }
            ],
            addrow: function (rowid, rowdata, position, commit) {
                commit(true);
            },
            updaterow: function (rowid, rowdata, commit) {
                commit(true);
            },
            deleterow: function (rowid, commit) {
                commit(true);
            },
            id: 'pk',
            data: { nombrePerfil: nombrePerfil },
            url: api.perfiles
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
    function setReadWindow(isRead) {
        $('#Nombre').prop('readonly', isRead);
        if (isRead) {
            $('#Save').hide();
            $('#Cancel').hide();
        }
        else {
            $('#Save').show();
            $('#Cancel').show();
        }
    }
    function initButtons(cb) {
        $btnAlta.click(function () {
            perfilesDialog.init({
                pk: null,
                perfil: ''
            });
            setReadWindow(false);
            showWindow();
        });
        $btnBaja.click(function () {
            if (index_selected < 0) {
                alertify.alert('Grupos de usuarios', 'Para editar o borrar primero debe seleccionar un registro').show();
                return;
            }
            var rowdata = $grid.jqxGrid('getrowdata', index_selected);
            var mensaje = '¿Confirma borrar el grupo de usuarios ' + rowdata.perfil + '?';
            alertify.confirm('Borrar', mensaje, onokBorrar, onCancelBorrar).set('labels', { ok: 'Aceptar', cancel: 'Cancelar' });
        });
        $btnCambio.click(function () {
            var rowindex = $grid.jqxGrid('getselectedrowindex');
            if (rowindex == -1) {
                alertify.alert('Estados', 'Para editar o borrar primero debe seleccionar un registro').show();
                return;
            }
            var rowdata = $grid.jqxGrid('getrowdata', rowindex);
            perfilesDialog.init(rowdata);
            setReadWindow(false);
            showWindow();
        });
        $("#Regresar").click(function () {
            cbCancelar();
        });
        cb();
    }
    function initGrid(cb) {
        var alto = window.innerHeight - 216;
        var rowsheight = 25;
        $grid.jqxGrid({
       
            width: '100%',
            height: alto,
            rowsheight: rowsheight,
            columnsresize: true,
            filterable: true,
            showfilterrow: true,
            columns: [
                { text: 'Grupo de usuarios', datafield: 'perfil', align: 'center', cellsalign: 'left', width: '90%', },
                {
                    text: '',
                    datafield: 'pk',
                    width: '10%',
                    filterable: false,
                    cellsalign: 'right',
                    align: 'center',
                    createwidget: function (row, column, value, htmlElement) {
                        var id = row.bounddata.pk;
                        var button = $("<button id='" + id + "' class='btn-small btn-flat'><i class='material-icons'>visibility</i></button>");
                        $(htmlElement).append(button);
                        $('#' + id).click(function () {
                            perfilesDialog.init(row.bounddata);
                            $("#Titulo").text('Ver perfil');
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
            /*if(g_pkcliente_seguimiento != null){
                var numBoundIndex = $grid.jqxGrid('getrowboundindexbyid', g_pkcliente_seguimiento);
                $grid.jqxGrid('selectrow', numBoundIndex);
                $grid.jqxGrid('ensurerowvisible', numBoundIndex);
            }       */
        });
        $grid.on('rowselect', function (event) {
            index_selected = event.args.rowindex;
            row_selected = event.args.row;
            $btnBaja.prop('disabled', false);
            $btnCambio.prop('disabled', false);
        });
        cb();
    }

    initButtons(function () {
        initGrid(function () {
            updateGrid();
            cbEnd();
        });
    });
}
function updatePagePerfiles() {
    getSession().then((session) => {
        updateGridPerfiles(session.user.fkperfil, function () {
        });
    });
}