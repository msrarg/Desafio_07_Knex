require('dotenv').config();
const express = require('express');
const ContenedorMariaDB = require('./model/contenedorMariaDB');
const ContenedorSQLite = require('./model/contenedorSQLite');

const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
const PORT = process.env.PORT || 8080;

const productos = new ContenedorMariaDB();
const mensajero = new ContenedorSQLite();

io.on('connection', async socket => {
    console.log('Nueva conexión');

    socket.emit('productos',await productos.getAll());

    socket.on('new-product', async producto => {
        await productos.save(producto);
        io.sockets.emit('productos', await productos.getAll());
    })

    socket.emit('mensajes', await mensajero.getAll());

    socket.on('new-message', async mensaje => {
        await mensajero.save(mensaje)
        io.sockets.emit('mensajes', await mensajero.getAll());
    })
});

server.listen(PORT, () => {
    console.log(`Servidor corriendo en el port: ${server.address().port}`); 
});

server.on('ERROR:', (err) => console.log(err));