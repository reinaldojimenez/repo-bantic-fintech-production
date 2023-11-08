import { getConnectionLocal } from "../database/database.js";
import { encrypt, compare } from './../helpers/handleBcrypt.js'
import { loginRequest, whoamiRequest } from './../api/auth.js'

import axios from 'axios'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { json } from "express";
dayjs.extend(utc)


const AutenticarUsuario = async(req, res)=>{
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
            return res.status(400).send(['Datos incorrectos o token vencido']);
        }        

        //whoami
        const respuestaWhoami = await whoamiByToken(respuesta.data.token);
        console.log(respuestaWhoami)
        let { codError } = respuestaWhoami;

        if (codError == "1"){
            // return res.json({ ...respuestaWhoami });
            return res.status(400).send(['Servicio deshabilitado temporalmente']);                   
        }
        
        res.cookie("token", respuesta.data.token);
        console.log("el token tiene: ");
        console.log(respuesta.data.token);

        return res.json({ ...respuestaWhoami }); 
    } catch (error) {  
        console.log(error)
        const errors = ['el usuario o la contraseña son invalidos']  
        res.status(500);
        res.send(errors);
    }
    
}


const whoami = async(req, res) => {
    try {
        const { token } = req.cookies

        const usuario = {
            user: "",
            password: "",
            token
        }        
        
        const API = process.env.API_MIDDLEWARE
        const respuesta = await axios.post(`${API}/api/MixQR/getFBUserData`, usuario, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        // console.log(respuesta.data)
        let { idUser, nameUser, typeUser, idCustomer, customer, idBank, codBank, bank, codError } = respuesta.data;

        if (codError == "0"){  
            return res.json({ idUser, nameUser, typeUser, idCustomer, customer, idBank, codBank, bank });                     
        } 
        
        //return res.json({ idUser, nameUser, typeUser, idCustomer, customer, idBank, codBank, bank });   
        return res.status(400).send([respuesta.descError]);
    } catch (error) {
        console.log(error);
        res.status(401).json({message: "No esta habilitado el cliente"})
    }
}


const whoamiByToken = async(token) => {
    try {

        const usuario = {
            user: "",
            password: "",
            token
        }       
        
        const API = process.env.API_MIDDLEWARE
        const respuesta = await axios.post(`${API}/api/MixQR/getFBUserData`, usuario, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        let { idUser, nameUser, typeUser, idCustomer, customer, idBank, codBank, bank, codError } = respuesta.data;

        if (codError == "0"){  
            return { idUser, nameUser, typeUser, idCustomer, customer, idBank, codBank, bank, codError };                     
        } 
         
        return { codError: 1, message: respuesta.descError };
    } catch (error) {
        console.log(error);
        return {codError: 1, message: "No esta habilitado el cliente"};
    }
}


function prueba(){
    return new Promise( (resolve, reject) => {
        let isDone = true
        if (isDone){
            const user = {
                id: 1,
                username: "Reinaldo"
            }
            resolve(user);
        }
        reject("No esta hecho")        
    });
}


export const methods = {
    AutenticarUsuario,
    whoami
};
