import sql from "mssql";
import config from "../config";

const dbSettings = {
    server: config.host,
    port: Number(config.port),
    database: config.database,
    user: config.user,
    password: config.password,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

async function getConnection(){
    try {
        console.log(`Conectando a la base de datos ${config.database} ...`);
        const pool = await sql.connect(dbSettings);
        console.log(`Conectado a la base de datos ${config.database}!`);
        return pool;
    } catch (error) {
        console.log('Error al conectarse con la base de datos');
        console.error(error);
    }    
}


const dbSettingsLocal = {
    server: 'localhost',
    port: 1433,
    database: 'webstore',
    user: 'rjimenez',
    password: 'root',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

async function getConnectionLocal(){
    try {
        console.log(`Conectando a la base de datos ${dbSettingsLocal.server} ...`);
        const pool = await sql.connect(dbSettingsLocal);
        console.log(`Conectado a la base de datos ${dbSettingsLocal.server}!`);
        return pool;
    } catch (error) {
        console.log('Error al conectarse con la base de datos');
        console.error(error);
    }    
}


// getConnection();
// getConnectionLocal();


module.exports = {
    //getConnectionLocal,
    getConnection,
    sql
}