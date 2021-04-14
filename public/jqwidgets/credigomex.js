//icono: {
//  nombre:'',
//  color:'',  
//}
//forma: pegado, separado 
function icoText(icono, row, column, value, cellElement, funcion, forma='pegado') {
    var button = null;
    switch(forma) {
        case 'pegado':
            var divContenido = '<div class="buttonValue"><p style="display: inline-block;">' + 
                value + '&nbsp;</p><p style="display: inline-block;"><i class="' + icono.nombre + '" style="font-size:18px; color:'+ icono.color +'; margin-right: 6px;"></i></p></div>';
            button = $("<div>" + divContenido + "</div>");
            break;
        case 'separado':
            var divTexto = "<div class='buttonValue' style='margin-top: 3px; float: left;'><p>" + value + "</p></div>";
            var divIcono = '<div style="float:right;">' + '<i class="' + icono.nombre + '" style="font-size:18px; color:'+ icono.color +'; margin-right: 6px;"></i></div>';
            button = $("<div>" + divTexto + divIcono + "</div>");
            break;
        default:
            ;
    }

    $(cellElement).append(button);
    button.jqxButton({ template: "link", height: '100%', width: '100%' });
    button.click(function (event) {
        funcion(row.bounddata);
    });

    function toString() {
        return "Icono: " + icono.nombre + " Texto: " + value;
    }
}

function enableIcoText(icono, enabled, row, column, value, cellElement, funcion) {

    var divTexto = "<div class='buttonValue' style='float: left;'><p class='value'>" + value + "</p></div>";
    var divIcono = '<div style="float:right;">' + '<i class="icono ' + icono.nombre + '" style="font-size:18px; color:'+ icono.color +'; margin-right: 10px;"></i></div>';
    var button = $("<div id='botonAccion' style='opacity: " + (enabled ? 1 : 0.5) + ";'>" + divTexto + divIcono +  "</div>");

    $(cellElement).append(button);
    button.jqxButton({ theme: "credigomex", height: '100%', width: '100%' });
    button.click(function (event) {
        if (enabled) 
            funcion(row.bounddata);
    });

    function toString() {
        return "Icono: " + icono.nombre + " Texto: " + value;
    }
}