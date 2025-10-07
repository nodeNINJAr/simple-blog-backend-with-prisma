import { Request, Response } from "express";
import { AuthSevices } from "./auth.services";



const loginWithEmailAndPass = async(req:Request, res:Response)=>{
    try{
      const result = await AuthSevices.loginWithEmailAndPass(req.body);
      res.status(200).json({message:"User Login SuccessFully", result})
    }
    catch(err){
      console.log(err);
      res.status(404).json({status:404,message:"Password is incorrect"})
    }
}


// auth with google
const authWithGoogle = async(req:Request, res:Response)=>{
    if(!req.body){
        throw new Error("Data Not Found")
    }
    try{
      const result = await AuthSevices.authWithGoogle(req.body);
      res.status(200).json({message:"Google Login SuccessFully", result})
    }
    catch(err){
      console.log(err);
      res.status(404).json({message:"Error happend on google login"})
    }
}









export const AuthController ={
    loginWithEmailAndPass,
    authWithGoogle
}