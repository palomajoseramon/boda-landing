/**
 * Recibe las confirmaciones de la web y las escribe en la hoja.
 *
 * Instalación:
 *   1. En la hoja de cálculo: Extensiones → Apps Script
 *   2. Pegar este archivo completo
 *   3. Cambiar TOKEN por una cadena larga inventada (la misma que se pondrá
 *      en la variable de entorno RSVP_TOKEN de la web)
 *   4. Implementar → Nueva implementación → Aplicación web
 *        · Ejecutar como: Yo
 *        · Quién tiene acceso: Cualquier usuario
 *   5. Copiar la URL que devuelve → variable RSVP_SHEET_URL de la web
 *
 * Al ser una URL pública, el token es lo que impide que un tercero escriba
 * filas falsas.
 */

const TOKEN = 'CAMBIA-ESTO-POR-UNA-CADENA-LARGA-Y-UNICA';

/** Cabeceras de la hoja. Se crean solas la primera vez. */
const CABECERAS = [
  'Fecha',
  'Nombre',
  'Menú vegano',
  'Autobús',
  'Vuelta',
  'Acompañante',
  'Menú vegano (acompañante)',
  'Autobús (acompañante)',
  'Vuelta (acompañante)',
  'Notas',
];

function doPost(e) {
  try {
    const datos = JSON.parse(e.postData.contents);

    if (datos.token !== TOKEN) {
      return respuesta({ error: 'No autorizado' });
    }

    const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Primera ejecución: deja la fila de cabeceras
    if (hoja.getLastRow() === 0) {
      hoja.appendRow(CABECERAS);
      hoja.getRange(1, 1, 1, CABECERAS.length).setFontWeight('bold');
      hoja.setFrozenRows(1);
    }

    const t = datos.titular || {};
    const a = datos.acompanante || {};

    hoja.appendRow([
      new Date(),
      t.nombre || '',
      t.vegano || '',
      t.bus || '',
      t.vuelta || '',
      a.nombre || '',
      a.vegano || '',
      a.bus || '',
      a.vuelta || '',
      datos.notas || '',
    ]);

    return respuesta({ ok: true });
  } catch (error) {
    return respuesta({ error: String(error) });
  }
}

function respuesta(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
