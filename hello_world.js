const http = require("http")

const servidor = http.createServer(function(request,response){
    console.log("Recibí una petición!")
    response.write("Hola mundo!")
    response.end()
})

console.log("Esuchando en el puerto 5000...")
servidor.listen(5000)