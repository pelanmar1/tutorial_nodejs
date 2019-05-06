const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require("fs");
var cors = require('cors')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.get('/', function (req, res) {
    let pelicula = req.query.pelicula

    const options = {
        uri: "https://www.imdb.com/find?ref_=nv_sr_fn&q="+ pelicula +"+&s=tt" ,
        transform: function (body) {
            return body;
        }
    };
    rp(options)
        .then(($) => {
            let peliculas = getPeliculas($)
            res.send(peliculas);
        })
        .catch((err) => {
            res.send("Error");
            console.log(err);
        });


});

let getPeliculas = function(html) {
    peliculas = []
    let $ = cheerio.load(html);
    $('#main > div > div.findSection > table > tbody').find("tr").each(function(i,elem){
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

app.listen(port, function () {
    console.log(`App escuchando en el puerto ${port}!`)
});