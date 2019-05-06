
/*
===================================================
1. SE IMPORTAN PAQUETES
===================================================
*/
const express = require('express');
const rp = require('request-promise');
const cheerio = require('cheerio');
var cors = require('cors')
/*
===================================================
2. CONFIGURACIÓN DEL SERVICIO WEB
===================================================
*/
// Se inicializa una aplicación con Express
const app = express();
// En qué puerto escuchará el servidor
const port = 3000;
// Configuración adicional de la app
app.use(cors());

/*
===================================================
3. DEFINICIÓN DE RUTAS REST
===================================================
*/
// Ruta GET: http://localhost:3000?pelicula=titanic
app.get('/', function (req, res) {
    // Leemos parámetro de url
    let nombrePelicula = req.query.pelicula
    consultarIMDb(nombrePelicula,
        // Si no hay error ->
        function (html) {
            let peliculas = getPeliculas(html)
            res.send(peliculas);
        },
        // Si sí hay error ->
        function (err) {
            console.log(err);
            res.send("Hubo un error.");
        })

});

/*
===================================================
4. EJECUCIÓN DE LA APLICACIÓN
===================================================
*/
// La aplicación se ejecuta, escuchando en el puerto especificado.
app.listen(port, function () {
    console.log(`App escuchando en el puerto ${port}!`)
});

/*
===================================================
SCRAPING
===================================================
*/
let consultarIMDb = function (nombrePelicula, callback, err) {
    // Construimos url para consultar IMDb
    url = "https://www.imdb.com/find?ref_=nv_sr_fn&q=" + nombrePelicula + "+&s=tt"
    console.log("Solicitud para IMDb: " + url);

    // Objeto de para realizar una petición HTTP 
    const opciones = {
        uri: url,
        transform: function (body) {
            return body;
        }
    };
    // Realizamos la petición
    rp(opciones)
        .then((html) => {
            return callback(html)
        })
        .catch((e) => {
            return err(e)
        });
}

//Método para extraer la lista de películas del documento HTML
let getPeliculas = function (html) {
    peliculas = []
    let $ = cheerio.load(html);
    $('#main > div > div.findSection > table > tbody').find("tr").each(function (i, elem) {
        let p = {}
        img = $(this).find("td.primary_photo > a > img").attr("src");
        detalles = $(this).find("td.result_text").text();
        url = $(this).find("td.result_text > a").attr("href");
        p["img"] = img;
        p["detalles"] = detalles
        p["url"] = "https://www.imdb.com/" + url
        peliculas.push(p)
    })
    return peliculas;
}