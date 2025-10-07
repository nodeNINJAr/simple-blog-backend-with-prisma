import { Request, Response } from "express";
import { PostServices } from "./post.services";




// create post
const createPost= async(req:Request, res:Response)=>{
    try{
      const result = await PostServices.createPost(req.body);
      res.status(201).json({message:"Post Created SuccessFully", result})
    }
    catch(err){
      console.log(err);
    }
}

// get all post data
const getAllPost = async(req:Request, res:Response)=>{
  const limit = Number(req.query.limit) || 5;
  const page = Number(req.query.page) || 1;
  const search = req?.query?.search as string|| '';
  const isFeatured = req?.query?.isFeatured ? req?.query?.isFeatured ==="true"  : undefined

  // 
     try{
       const posts = await PostServices.getAllPost({page,limit, search, isFeatured});
       res.status(200).json({message: "All post retrived succesfully ", posts})
     }catch(err){
        console.log(err);
     }
}


// get single data
const getPostById = async(req:Request, res:Response)=>{
       
  try {
      const post = await PostServices.getPostById(Number(req.params.id))
      res.status(200).json(post);
  } catch (error) {
      console.log(error);
  }

}

// update post
const updatePost = async(req:Request, res:Response)=>{

    const {id} = req.params;

    try{
      const result = await PostServices.updatePost(Number(id), req.body);
      res.status(201).json(result)
    }
    catch(err){
      console.log(err);
    }
}



// delete post
const deletePost = async(req:Request, res:Response)=>{

    const {id} = req.params;

    try{
       await PostServices.deletePost(Number(id));
      res.status(200).json({message: " Post Deleted From DB"})
    }
    catch(err){
      console.log(err);
    }
}




export const PostController ={
    createPost,
    getAllPost,
    getPostById,
    updatePost,
    deletePost
}