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
const getAllPost = async({page=1,limit=2,search ,isFeatured : isfeatured}
      :{page?:number;
        limit?:number;
        search?:string;
        isFeatured?:boolean}
)=>{

    // 
    const skip = (page -1) *limit;
     

    // search query and filter query
    const query:any = {
        // if we have multiple data querying option then we need to use AND
       AND:[
          search && {
            OR:[
                {title:{contains:search,mode:"insensitive"}},
                { content:{contains:search, mode:"insensitive"}}
            ], 
        },
        typeof isfeatured === "boolean" && {isfeatured}
       ].filter(Boolean)
    }


    // 
      const result = await prisma.post.findMany({
        skip,
        take:limit,
        where: query,
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