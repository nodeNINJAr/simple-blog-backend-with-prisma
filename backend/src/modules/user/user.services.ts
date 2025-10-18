import { Prisma, User } from "@prisma/client";
import { prisma } from "../../confiq/db"




// create user
const createUser = async(payload: Prisma.UserCreateInput): Promise<User>=>{

     if (!payload?.email) {
         throw new Error("Email is required");
     }

     const existingUser = await prisma.user.findUnique({
        where: {
           email: payload.email as string
        }
     })
     if(existingUser) {
        throw new Error("User already exists with this email")
     }
    // 
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
            posts:true,
            password:true,
        },
        orderBy:{
          createdAT:'desc'
        }
      })
      return result
}


// get single data by id
const getDataById = async(id:number)=>{
         

    if (!id) {
         throw new Error("id is required");
     }

    //  const user = await prisma.user.findUnique({
    //     where: {
    //        id
    //     }
    //  })

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

     if(!result) {
        throw new Error("User not exists with this id")
     }
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