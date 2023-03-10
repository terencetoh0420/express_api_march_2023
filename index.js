// import express
const { response } = require('express')
let express = require('express')
let mongoose = require('mongoose')
let song = require('./song')
let cors = require('cors')

// create express app
let app = express()

// enable express to work with JSON type request body
app.use(express.json())
app.use(cors())

let PORT = 8888

// setup connection string
let conn_str='mongodb+srv://mongo:mongopassword@cluster0.iinezyw.mongodb.net/my_youtube'

mongoose.connect(conn_str)
let db = mongoose.connection

// check if the db connection is successful
db.once('open',()=>{
    console.log("the mongodb is connected");
})

// create first api -> root end point -> /
// http://localhost:8888/
/*
GET -> just retrieve the data
PUT -> update data
POST -> add new data
DELETE -> delete data
*/ 

app.get('/',(request,response)=>{
    console.log("Request received")
    console.log("GET")
    response.send("hello from Express API")
})

app.get('/welcome',(request,response)=>{
    console.log("Request received")
    console.log(request.url)
    response.send("Welcome to Express API")
})

// POST Request handler
app.post('/',(request,response)=>{
    console.log("Request received")
    console.log("POST");
    console.log(request.url)
    response.send("hello POST from Express API")
})

app.put('/welcome',(request,response)=>{
    console.log("Request received")
    console.log("PUT");
    console.log(request.url)
    response.send("Welcome PUT to Express API")
})

// POST Request handler for /add/friend
app.post("/add/friend",(request, response)=>{
    console.log("Request received");
    console.log(request.url);
    // read the request body (received along with request)
    console.log(request.body);
    response.json({
        "status":"success"
    })
})

// connect to mongodb and receive the list of document from song collection
app.get('/get/songs',(request, response)=>{
    console.log("request received GET");
    console.log(request.url);
    // connect to mongodb to get all documents
    song.find({})
    .then((data)=>{
        response.json(data)
    })
    .catch((error)=>{
        response.json(error)
    })

})

// POST Request handler for /add/songs
app.post("/add/songs",(request, response)=>{
    console.log("Request received");
    console.log(request.url);
    // read the request body (received along with request)
    console.log(request.body);
    let newSong = new song();
    console.log(newSong);
    // transfer values from request.body to newSong instance
    newSong.video_id = request.body.video_id
    newSong.likes = request.body.likes
    newSong.views = request.body.views
    console.log(newSong);
    // save the newSong in mongodb database
    newSong.save()
            .then((data)=>{
                response.json({
                    'status': 'success',
                    'save': data
                })
            })
            .catch((error)=>{
                console.log(error);
            })
    // response.json({
    //     "status":"success"
    // })
})

// get song by id
app.get("/get/song/:myid",(request,response)=>{
    // let id = request.params
    song.findById(request.params.myid)
    .then((data)=>{
        response.json(data)
    })
    .catch((error)=>{
        console.log(error)
    })
})

// delete song by id
app.delete("/delete/song/:myid",(request,response)=>{
    // let id = request.params
    song.findByIdAndDelete(request.params.myid)
    .then((data)=>{
        response.json({
            "status": "deleted",
            "data": data
        })
    })
    .catch((error)=>{
        console.log(error)
    })
})

// update song by id
app.put("/update/song/:id",(request,response)=>{
    // let id = request.params
    console.log("id received " + request.params.id);
    console.log("request ");
    console.log(request.body);
    // updateOne(which, what)
    song.updateOne({_id: request.params.id},{$set:{video_id:request.body.video_id,views: request.body.views, likes: request.body.likes}})
    .then((data)=>{
        response.json({
            "status": "updated",
            "data": data
        })
    })
    .catch((error)=>{
        console.log(error);
    })
})


app.listen(PORT,()=>{
    console.log("Listenninng on port"+PORT);
})