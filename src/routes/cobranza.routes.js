import { Router } from "express";
import { methods as cobranzaController } from "../controllers/cobranza.controller";
//import { validateSchema } from './../middlewares/validator.middleware.js'
//import { loginSchema } from './../schemas/auth.schema'
import { authRequired } from './../middlewares/validateToken.js'

const router = Router();

router.post("/verificar", authRequired, cobranzaController.Verificar);
router.get("/getAllQR", authRequired, cobranzaController.getAllQRByUser);
//router.get("/getAllQR", authRequired, cobranzaController.getAllQRByUser);
//router.post("/generarQR",authRequired, validateSchema(userGenerarQRSchema), (usersController.generarQR));

export default router;