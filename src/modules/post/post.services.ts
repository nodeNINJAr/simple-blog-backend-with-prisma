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
const getAllPost = async({page=1,limit=2,search ,isFeatured : isfeatured, tags, sort}
      :{
        page?:number;
        limit?:number;
        search?:string;
        isFeatured?:boolean;
        tags?:string[];
        sort?:string;
    }
)=>{

    // 
    const skip = (page -1) *limit;
     

    // search query and filter query
    const where:any = {
        // if we have multiple data querying option then we need to use AND
       AND:[
          search && {
            OR:[
                {title:{contains:search,mode:"insensitive"}},
                { content:{contains:search, mode:"insensitive"}}
            ], 
        },

        typeof isfeatured === "boolean" && {isfeatured}, // filetr 
        (tags && tags?.length > 0) && { tags: { hasEvery : tags }}  // hasEvery for looping the tags array

       ].filter(Boolean)
    }
      const totalData = await prisma.post.count({where});
      console.log({tags,sort});
    // 
      const result = await prisma.post.findMany({
        skip,
        take:limit,
        where,
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
        orderBy: sort === "asc" || sort === "desc" ? { createdAT: sort } : undefined
      })

      return {
        data : result,
        pagination:{
            page,
            limit
        },
        total:totalData,
        totalPages: Math.ceil(totalData/limit)
      }
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