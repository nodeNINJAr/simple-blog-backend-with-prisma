import express  from 'express';
import { AuthController } from './auth.controller';


const router = express.Router();

router.post("/login", AuthController.loginWithEmailAndPass);
router.post("/google", AuthController.authWithGoogle);
// router.get("/:id", PostController.getPostById);


export const authRouter = router;