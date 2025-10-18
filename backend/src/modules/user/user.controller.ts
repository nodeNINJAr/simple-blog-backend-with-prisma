import { Request, Response } from "express";
import { UserServices } from "./user.services";



// create user
const createUser = async(req:Request, res:Response)=>{
    try{
      const result = await UserServices.createUser(req.body);
      res.status(201).json(result)
    }
    catch(err: any){
      res.status(404).json(err.message )
      console.log(err);
    }
}



// get all data
const getAllFromDB = async(req:Request, res:Response)=>{
     try{
       const users = await UserServices.getAllFromDB();
       res.status(200).json({users})
     }catch(err){
        console.log(err);
     }
}


// get single data
const getDataById = async(req:Request, res:Response)=>{
       
  try {
      const user = await UserServices.getDataById(Number(req.params.id))
      res.status(200).json(user);
  } catch (error:any) {
      console.log(error);
        res.status(404).json(error.message);
  }

}

// update user
const updateUser = async(req:Request, res:Response)=>{

    const {id} = req.params;

    try{
      const result = await UserServices.updateUser(Number(id), req.body);
      res.status(201).json(result)
    }
    catch(err){
      console.log(err);
    }
}



// delete user
const deleteUser = async(req:Request, res:Response)=>{

    const {id} = req.params;

    try{
       await UserServices.deleteUser(Number(id));
      res.status(200).json({message: " User Deleted From DB"})
    }
    catch(err){
      console.log(err);
    }
}


export const UserController ={
    createUser,
    getAllFromDB,
    getDataById,
    updateUser,
    deleteUser
} 