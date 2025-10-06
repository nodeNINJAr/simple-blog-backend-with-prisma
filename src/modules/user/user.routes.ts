import express from 'express';
import { UserController } from './user.controller';


const router = express.Router();


router.post("/create", UserController.createUser);
router.get("/", UserController.getAllFromDB);
router.get("/:id", UserController.getDataById);
router.patch("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

export const userRouter = router;
