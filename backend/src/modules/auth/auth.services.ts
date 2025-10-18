import { Prisma } from "@prisma/client";
import { prisma } from "../../confiq/db";



const loginWithEmailAndPass =async({email, password:pass}:{email:string, password:string})=>{
     
    //   
     const user = await prisma.user.findUnique({
        where:{
            email
        }
     })
     if(!user){
        throw new Error("User Not Found")
     }

     if(pass === user.password){
        return user;
     }
     
     else{
        throw new Error("Password is incorrect")
     }

}


const authWithGoogle = async(data:Prisma.UserCreateInput)=>{
    
     let user = await prisma.user.findUnique({
        where:{
            email:data.email
        }
    })

    if(!user){
        user = await prisma.user.create({
            data
        })
    }
}



export const AuthSevices ={
    loginWithEmailAndPass,
    authWithGoogle
}