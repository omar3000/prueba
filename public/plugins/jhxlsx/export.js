/**
 * funcion encargada de exportar a excel los datos de un grid
 * 
 * INSTRUCCIONES DE USO;
 * 
 * 1.- Agregar un boton en el archivo pug con las siguientes caracteristicas
 * 
 *      A) id="exportToXLSX" 
 *      B) onclick="exportToXLSX()"
 * 
 *      EJEMPLO: 
 *          button#exportToXLSX.btn.indigo.accent-4(onclick='exportToXLSX()')
 *              i.material-icons.left filter_list
 *              | EXPORTAR
 * 
 * 2.- En el script donde se crea el jqxGrid agregar la siguiente funcion los parametros
 * 
 *      parametros: 
 *          columns = las columnas que se agregan en el jqxGrid
 *          sources = es el localdata del src del jqxGrid
 *          options = se configura el nombre del archivo ejem: {name: 'nombreArchivo'}
 * 
 *      excecExportToXLSX(columns, sources, {name: 'reporte-servicios' })
 * 
 */
function exportToXLSX() {

  // inicia variable data con toda la informacion del reporte
  var data = [];

  // recupera el json de options y carga los datos al json
  var options = $('#exportToXLSX').data('options');

  // recupera el json de options
  var columns = $('#exportToXLSX').data('columns');

  // recupera los datos de el excel
  var sources = JSON.parse($('#dataExportToXLSX').val());
  console.log(sources)


  // recorre columnas crea las columnas
  var datacolumns = [];

  // recorre las columnas
  for (let indexcol = 0; indexcol < columns.length; indexcol++) {
    const column = columns[indexcol];
    datacolumns.push({ text: column.text });
  }

  data.push(datacolumns);
  

  // recorre los servicios
  for (let indexsrcs = 0; indexsrcs < sources.length; indexsrcs++) {
    const source = sources[indexsrcs];

    // limpia la variable al hacer 
    var datasources = [];

    // recorre las columnas formadas para obtener los datos solo de esa columna
    for (var i in columns) {
      col = columns[i];
      if (source[col.datafield] != null && source[col.datafield] != undefined) {
        datasources.push({ text: source[col.datafield] });
      } else {
        datasources.push({ text: '' });
      }
    }

    // y lo agrega a los datos
    data.push(datasources);

  }


  var json = {
    "options": {
      "fileName": options.name || "exportNoName"
    },
    "tableData": [
      {
        "sheetName": options.sheet || "sheetNoName",
        "data": data
      }
    ]
  };

  // funcion encargada de genera el excel { name: "SERVICIOS" }
  Jhxlsx.export(json.tableData, json.options);

}

function excecExportToXLSX(columns = [], sources = [], options = {}) {

  $('#exportToXLSX').attr('data-columns', JSON.stringify(columns));
  $('#dataExportToXLSX').val(JSON.stringify(sources));
  console.log(sources);
  $('#exportToXLSX').attr('data-options', JSON.stringify(options));
}

function updateExportToXLSX(sources = []) {
  console.log('Se actualizo data', sources);
  $('#dataExportToXLSX').val(JSON.stringify(sources));
}