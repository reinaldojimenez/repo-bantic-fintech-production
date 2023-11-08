import { Router } from "express";
import { methods as usersController } from "../controllers/users.controller";
import {validateSchema} from './../middlewares/validator.middleware.js'
import { userGenerarQRSchema } from './../schemas/user.schema'
import { authRequired } from './../middlewares/validateToken.js'

const router = Router();

router.get("/", (usersController.getAllUsers));
router.post("/generarQR", authRequired, validateSchema(userGenerarQRSchema), (usersController.generarQR));
router.post("/verificarQR", authRequired, (usersController.verificarQR));
router.get("/:id", (usersController.getOneUser));
router.post("/", (usersController.createNewUser));
router.put("/:id", (usersController.updateOneUser));
router.delete("/:id", (usersController.deleteOneUser));

export default router;