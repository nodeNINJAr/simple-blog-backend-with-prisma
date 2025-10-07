import { Post, Prisma } from "@prisma/client";
import { prisma } from "../../confiq/db";


// create post
const createPost = async(payload: Prisma.PostCreateInput): Promise<Post>=>{
     const result = await prisma.post.create({
          data:payload,
          include:{
            author:{
                select:{
                    id:true,
                    name:true,
                    email:true,

                }
            }
          }
     })
     return result;
}

// get all post data
const getAllPost = async({page,limit}
      :{page:number;limit:number}
)=>{

    const skip = (page -1) *limit;


    // 
      const result = await prisma.post.findMany({
        skip,
        take:limit,
        select:{
            id : true,
            title: true,
            content:true,
            thumbnail:true,
            isfeatured:true,
            createdAT:true,
            updatedAt:true,
            tags: true,
            views:true,
            authorId:true,
            author:{
                select:{
                    id:true,
                    name:true,
                    email:true
                }
            }
        },
        orderBy:{
          createdAT:'desc'
        }
      })
      return result
}


// get single post by id
const getPostById = async(id:number)=>{

      const result = await prisma.post.findUniqueOrThrow({
         where:{
             id
         },
        select:{
            id : true,
            title: true,
            content:true,
            thumbnail:true,
            isfeatured:true,
            createdAT:true,
            updatedAt:true,
            tags: true,
            views:true,
            authorId:true,
             author:{
                select:{
                    id:true,
                    name:true,
                    email:true
                }
            }
        }
      })
      return result
}

// update post

const updatePost = async(id:number, payload: Prisma.PostCreateInput): Promise<Post>=>{
     const updatePost = await prisma.post.update({
         where:{
            id
         },
         data: payload
     })
     return updatePost;
}



// delete post

const deletePost = async(id:number)=>{
    await prisma.post.delete({
         where:{
            id
         }
     })
}



export const PostServices ={
   createPost,
   getAllPost,
   getPostById,
   updatePost,
   deletePost
}