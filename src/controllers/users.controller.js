import { getConnectionLocal, sql, fqueries } from "../database";
import { encrypt, compare } from './../helpers/handleBcrypt.js';
//import { fqueries } from "./../database/queries.js";
//import { generarQRRequest } from './../api/auth.js'
import axios from 'axios'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)


const getAllUsers = async(req, res)=>{
    try {        
        const { usuario, clave } = req.body;
        const pool = await getConnectionLocal();
        const result = await pool.request().query(fqueries.getAllUser); 
        res.json({ status: "ok", data: result.recordset });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
    
}

const getOneUser = async(req, res)=>{
    try {        
        const { id } = req.params;
        const pool = await getConnectionLocal(); 
        const result = await pool.request()
            .input('id', id)
            .query(fqueries.getUserById)
        res.json({ status: "OK", data: result.recordset[0] });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
    
}

const createNewUser = async(req, res)=>{
    try {        
        const { usuario, clave } = req.body;

        if ( usuario==undefined || clave == undefined ) {
            return res.status(400).json({message: "Peticion erronea. Por favor debe definir todos los campos"})
        }
        const passwordHash = await encrypt(clave);
        const pool = await getConnectionLocal();        
        const result = await pool.request()
            .input('usuario', sql.VarChar, usuario)
            .input('clave', sql.VarChar, passwordHash)
            .query(fqueries.createNewUser); 
        res.json({ status: "ok", data: {usuario, passwordHash} });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
    
}

const updateOneUser = async(req, res) => { // no esta completo
    try {
        const { usuario, clave } = req.body;
        const { id } = req.params;

        if ( usuario==undefined || clave == undefined ) {
            return res.status(400).json({message: "Peticion erronea. Por favor debe definir todos los campos"})
        }

        const pool = await getConnectionLocal(); 
        const result = await pool.request()
            .input('id', id)
            .query(fqueries.deleteUserById)
        res.json({ status: "OK", data: result });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const deleteOneUser = async(req, res) => {
    try {
        const { id } = req.params;
        const pool = await getConnectionLocal(); 
        const result = await pool.request()
            .input('id', id)
            .query(fqueries.deleteUserById)
        res.json({ status: "OK", data: result });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}


const generarQR = async(req, res) => {
    try {
        const { token } = req.cookies;
        const { glosa, amount, user } = req.body;
        console.log('esta entrando al metodo generar qr')
        console.log(token)
        console.log(amount)  
        console.log(user)

        const usuario = {
            "accountCode": "123456", //opcional
            "currency": "BOB", //por defecto
            "amount": amount,
            "codClient": 1, //es el login
            "subCodCliente": "0", //opcional
            "singleUse": true, //por defecto
            //"expirationDate": dayjs.utc(new Date()).format("YYYY/MM/DD"), //fecha por defecto de hoy (por lo pronto 1 mes)
            "expirationDate": "2023-11-30", //fecha por defecto de hoy (por lo pronto 1 mes)
            "clientNote": glosa,
            "codBank": 1,
            "codTransaction": "111222333", //opcional
            "user": user == undefined ? 'invitado' : user
            //pantalla de configuracion
        }

        const API = process.env.API_MIDDLEWARE
        const respuesta = await axios.post(`${API}/api/MixQR//getQRImage`, usuario, {
            headers: {
                 Authorization: `Bearer ${token}`
            }
        });

        //console.log(respuesta.data)

        res.json(respuesta.data);
    } catch (error) {
        console.log(error)
        res.status(500);
        res.send(error.message);
    }
}

const verificarQR = async(req, res) => {
    try {

        const { token } = req.cookies;
        const { qrId, codBank, user } = req.body;
        console.log("me esta llegando al servidor")
        console.log(qrId)
        console.log(codBank)
        console.log(user)

        const inputReceiveNotificationBNB = {
            "qrId":qrId, 
            "gloss":"Prueba", 
            "sourceBankId": 1, 
            "originName":"JUAN PEREZ", 
            "voucherId":"1258s85s4ba", 
            "transactionDateTime":"2023-08-24T02:03:02.684Z",
            "additionalData":"notificado" 
        }    

        const API = process.env.API_MIDDLEWARE
        const respuestaReceiveNotificationBNB = await axios.post(`${API}/api/MixQR/ReceiveNotificationBNB`, inputReceiveNotificationBNB, {
            headers: {
                 Authorization: `Bearer ${token}`
            }
        });

        if (respuestaReceiveNotificationBNB.data.success == true){

            const inputGetNotification = {
                "qrId": qrId,
                "accountCode": "11111",
                "codClient": 1,
                "codBank": codBank,
                "codTransaction": "11111",
                "user": user
            }

            const respuestaGetNotification = await axios.post(`${API}/api/MixQR/GetNotification`, inputGetNotification, {
                headers: {
                    Authorization: `Bearer ${token}`
                }                
            });
            return res.json(respuestaGetNotification.data);
        }

        res.json(['ha ocurrido un error en la solicitud']);
    } catch (error) {
        console.log(error)
        res.status(500);
        res.send(error.message);
    }
}

export const methods = {
    getAllUsers,
    getOneUser,
    createNewUser,
    updateOneUser,
    deleteOneUser,
    generarQR,
    verificarQR,
};
