const options_sqlite = {
    client:'sqlite3',
    connection:{
        filename:'./DB/ecommerce.sqlite',
    },
    useNullAsDefault:true,
}

const options_mariadb = {
    client:'mysql',
    connection:{
        host: process.env.MARIADB_HOST || "127.0.0.1",
        user: process.env.MARIADB_USER || "root",
        password:process.env.MARIADB_PASSWORD || "MySQL@MySQL",
        database:process.env.MARIADB_DATABASE || "ecommerce"
    }
}

module.exports = {
    options_sqlite,
    options_mariadb,
}