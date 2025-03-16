const express = require('express');
const router = express.Router();
const Post = require('../model/post');

module.exports = router

router.get('',async (req,res)=>{
    try{
        const locals = {
            title: "NodeJs Blog",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }  
        const page = req.query.page || 1;
        const perPage = 10;
        const data = await Post.aggregate([{ $sort: {createdAt: -1}}]).
        skip(perPage * (page - 1)).
        limit(perPage).
        exec();
        const count = await Post.countDocuments({});
        const hasNextPage = page* perPage < count;
        const nextPage = parseInt(page) + 1;
        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
        });
        }catch(err){
            console.log(err);
        }
})

router.get('/post/:id', async (req,res)=>{
    try{
        const id = req.params.id;
        const post = await Post.findById({_id: id});
        const locals = {
            title: post.title,
            description: "Simple Blog created with NodeJs, Express & MongoDb.",
        }
        res.render('post',{
            data: post,
            locals,
            currentRoute: `/post/${id}`
        })
    }catch(err){
        console.log(err);
    }
})

// function insertMany(){
//     Post.insertMany([
//         { title: "Blog 1", body: "This is the body of Blog 1" },
//         { title: "Blog 2", body: "This is the body of Blog 2" },
//         { title: "Blog 3", body: "This is the body of Blog 3" },
//         { title: "Blog 4", body: "This is the body of Blog 4" },
//         { title: "Blog 5", body: "This is the body of Blog 5" },
//         { title: "Blog 6", body: "This is the body of Blog 6" },
//         { title: "Blog 7", body: "This is the body of Blog 7" },
//         { title: "Blog 8", body: "This is the body of Blog 8" },
//         { title: "Blog 9", body: "This is the body of Blog 9" },
//         { title: "Blog 10", body: "This is the body of Blog 10" }
//     ])
//     .then(() => console.log("10 blog posts inserted successfully!"))
//     .catch(err => console.error("Error inserting posts:", err));    
// }

// insertMany();

router.post('/search', async (req, res) => {
    const locals = {
        title: "Search",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
    }
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")
    const data = await Post.find({
        $or: [
          { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
          { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
        ]
    });

    res.render("search", {
        data,
        locals,
        currentRoute: '/'
    });
})
 
router.get('/about', (req, res) => {
    res.render('about', {
      currentRoute: '/about'
    });
});