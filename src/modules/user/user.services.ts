import { Prisma, User } from "@prisma/client";
import { prisma } from "../../confiq/db"




// create user
const createUser = async(payload: Prisma.UserCreateInput): Promise<User>=>{
     const createUser = await prisma.user.create({
        data:payload
     })
     return createUser;
}

// get all data
const getAllFromDB = async()=>{
      const result = await prisma.user.findMany({
        select:{
            id : true,
            name: true,
            email:true,
            phone:true,
            picture:true,
            createdAT:true,
            updatedAt:true,
            role: true,
            status:true,
            posts:true
        },
        orderBy:{
          createdAT:'desc'
        }
      })
      return result
}


// get single data by id
const getDataById = async(id:number)=>{
  console.log(id);
      const result = await prisma.user.findUniqueOrThrow({
         where:{
             id
         },
        select:{
            id : true,
            name: true,
            email:true,
            phone:true,
            picture:true,
            createdAT:true,
            updatedAt:true,
            role: true,
            status:true,
            posts:true
        }
      })
      return result
}

// update user

const updateUser = async(id:number, payload: Prisma.UserCreateInput): Promise<User>=>{
     const updateUser = await prisma.user.update({
         where:{
            id
         },
         data: payload
     })
     return updateUser;
}



// delete user

const deleteUser = async(id:number)=>{
    await prisma.user.delete({
         where:{
            id
         }
     })
}





export const UserServices ={
    createUser,
    getAllFromDB,
    getDataById,
    updateUser,
    deleteUser
}