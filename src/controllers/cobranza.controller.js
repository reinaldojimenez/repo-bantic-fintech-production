import { loginRequest } from './../api/auth.js'
import { getConnection, sql, fqueries } from "../database";
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)


const getAllQRByUser = async(req, res)=>{
    try { 
        // const { id } = req.params;
        const numeroParametros = 3;
        const queryParams = req.query;
        const { userName, fkCustomer, typeRequest } = queryParams;
        console.log("me esta llegando al servidor")
        console.log(userName)
        console.log(fkCustomer)
        console.log(typeRequest)

        var cantidadParametrosLlegada= Object.keys(queryParams).length;
        
        if (cantidadParametrosLlegada != numeroParametros){
            return res.status(400).json({message: `Peticion erronea. Por favor la query solo debe tener ${numeroParametros} parametros`});
        }

        if (userName == undefined || fkCustomer == undefined || typeRequest == undefined) {
            return res.status(400).json({message: "Peticion erronea. Por favor debe definir todos los campos"});
        }
        
        const pool = await getConnection();
        const result = await pool.request()
            .input('userName', sql.VarChar, userName)
            .input('fkCustomer', fkCustomer)
            .input('typeRequest', sql.VarChar, typeRequest)
            .query(fqueries.getAllQRByUser);
        res.json({ status: "ok", data: result.recordset });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
    
}


const Verificar = async(req, res)=>{
    try {        

        const { username, password } = req.body;

        console.log("me esta llegando al servidor")
        console.log(username, password);

        const user = {
            username,
            password,
            expiration: dayjs.utc(new Date()).add(2, 'days').format("YYYY-MM-DD")
            //expiration: dayjs.utc(new Date()).format("YYYY/MM/DD")
        }

        const respuesta = await loginRequest(user);

        if (respuesta.data.token == ""){
            //throw new Error("Datos incorrectos o token vencido");    
            console.log("No tiene data")    
            return res.status(500).send(['Datos incorrectos o token vencido']);
        }

        res.cookie("token", respuesta.data.token);
        console.log("el token tiene: ");
        console.log(respuesta.data.token);

        res.json({
            username
        });
    } catch (error) {  
        const errors = ['Datos invalidos']  
        res.status(500);
        res.send(errors);
    }
    
}


export const methods = {
    Verificar,
    getAllQRByUser
};
