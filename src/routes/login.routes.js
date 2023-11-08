import { Router } from "express";
import { methods as loginController } from "../controllers/login.controller";
import { validateSchema } from './../middlewares/validator.middleware.js'
import { loginSchema } from './../schemas/auth.schema'
import { authRequired } from './../middlewares/validateToken.js'

const router = Router();

router.post("/signin", validateSchema(loginSchema), (loginController.AutenticarUsuario));
router.post("/whoami", authRequired, loginController.whoami);

export default router;