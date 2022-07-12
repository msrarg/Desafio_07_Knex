require('dotenv').config();

if (!process.env.MARIADB_DATABASE) {
    console.error("**VARIABLES DE ENTONRNO NO DEFINIDAS. UTILIZAR ARCHIVO .env.sample como referencia**");
    return process.exit(1);
}

const {options_sqlite,options_mariadb} = require("./config/db")
const sqlite = require('knex')(options_sqlite);
const mariadb = require('knex')(options_mariadb);

(async() =>{
    try {
        const exists_mensajes = await sqlite.schema.hasTable('mensajes')
        if (!exists_mensajes) {
            console.log('Se crea la tabla mensajes')
            await sqlite.schema.createTable('mensajes', table => {
                table.increments('id').primary().notNull(),
                table.string('usermail',250).notNull(),
                table.string('mensaje',300).notNull(),
                table.string('fecha',100)
            })
        }

        await mariadb.raw('CREATE DATABASE IF NOT EXISTS ??', options_mariadb.connection.database)

        const exists_productos = await mariadb.schema.hasTable('productos')
        if (!exists_productos) {
            console.log('Se crea la tabla productos')
            await mariadb.schema.createTable('productos', table => {
                table.increments('id').primary().notNull(),
                table.string('nombre',100).notNull(),
                table.float('precio').notNull(),
                table.string('foto',200)
            })
        }
        await sqlite.destroy();
        await mariadb.destroy();
    } catch (error) {
        console.log(error)
    }

})();
