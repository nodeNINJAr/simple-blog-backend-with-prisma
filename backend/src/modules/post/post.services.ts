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
      
      if(!id){
        throw new Error("This Post is not Available")
      }
    // Prisma transsaction rollback api for secure update
     const result = await prisma.$transaction(async(tx)=>{
               
    // dynamic views count by when views request
     await tx.post.update({
        where:{
            id
        },
        data:{
            views:{
                increment:1
            }
        }
     }) 

      //    
      const result = await tx.post.findUniqueOrThrow({
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
      return result;

     })


      return result;

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


// stats aggregates
const getBlogStats =async()=>{
    return await prisma.$transaction(async(tx)=>{
         const aggregate = await tx.post.aggregate({
            _count:true,
            _sum:{views:true},
            _avg:{views:true},
            _max:{views:true},
            _min:{views:true},

         })  
        //  featured count
         const featureCount = await tx.post.count({
             where:{
                isfeatured:true,
             }
         })
         
        //  top featured
        const topFeatured = await tx.post.findFirst({
            where:{
                isfeatured:true,
            },
            orderBy: {views: "desc"}
        })
        //  last week post count
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7)
         
        // 
        const lastWeekPostCount = await tx.post.count({
            where:{
                createdAT:{
                    gte:lastWeek
                }
            }
        })





        //  
         return {
            stats :{
            totalPosts : aggregate._count ?? 0,
            totalViews:  aggregate._sum.views?? 0,
            avgViews : aggregate._avg.views ?? 0,
            minViews: aggregate._min.views ?? 0,
            maxViews: aggregate._max.views ?? 0,
         },
         featured :{
            count: featureCount,
            topPost : topFeatured
         },
         lastWeekPostCount
      }
    })
}





export const PostServices ={
   createPost,
   getAllPost,
   getPostById,
   updatePost,
   deletePost,
   getBlogStats
}