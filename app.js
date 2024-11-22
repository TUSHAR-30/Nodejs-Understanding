//Importing node js and expressjs modules
const express = require("express");
const app = express();
const fs = require("fs");

//Importing Thirdparty modules other than nodejs and expressjs.
const morgan=require("morgan");

//Using nodejs and expressjs middleware
app.use(express.json());


//Using thirdparty middleware other than nodejs and expressjs
app.use(morgan("dev"));


let movies = JSON.parse(fs.readFileSync("./Data/movies.json"));

//routes callback functions
const updateMovie=(req, res) => {
    const requestedId = req.params.id * 1;
    const movieToUpdate = movies.find((movie) => movie.id === requestedId);
    if (!movieToUpdate) {
        return res.status(404).json({
            status: 'fail',
            message: `Movie with id ${requestedId} does not found`
        })
    }
    const index = movies.indexOf(movieToUpdate);
    Object.assign(movieToUpdate, req.body);
    movies[index] = movieToUpdate;

    fs.writeFile("./Data/movies.json", JSON.stringify(movies), (err, data) => {
        res.status(200).json({
            status: 'success',
            data: {
                movie: movieToUpdate
            }
        })
    })
}

const deleteMovie=(req, res) => {
    const requestedId = req.params.id * 1;
    const movieToDelete = movies.find((movie) => movie.id === requestedId);
    if (!movieToDelete) {
        return res.status(404).json({
            status: 'fail',
            message: `Movie with id ${requestedId} does not found to be deleted`
        })
    }
    const index = movies.indexOf(movieToDelete);
    movies.splice(index, 1);
    fs.writeFile('./Data/movies.json', JSON.stringify(movies), (err, data) => {
        res.status(204).json({
            status: 'success',
            data: {
                movie: null
            }
        })
    }
)
}

const getMovies=(req, res) => {
    res.status(200).json({
        status: "success",
        count: movies.length,
        data: {
            movies: movies
        }
    })
}

const addMovie=(req, res) => {
    const newId = movies[movies.length - 1].id + 1;
    const newMovie = Object.assign({ id: newId }, req.body);
    movies.push(newMovie);
    fs.writeFile("./Data/movies.json", JSON.stringify(movies), (err, data) => {
        if (err) {
            res.send("Some error occured");
        }
        else {
            res.status(200).json({
                status: "success",
                data: {
                    movie: newMovie
                }
            })
        }
    })
}

const getMovie=(req, res) => {
    const requestedId = req.params.id * 1;
    const movie = movies.find((movie) => movie.id === requestedId);
    if (movie) {
        res.status(200).json({
            status: "success",
            data: {
                movie: movie
            }
        })
    }
    else {
        res.status(404).json({
            status: "failed",
            message: `Movie with the id ${requestedId} is not found`
        })
    }
}


//rest apis for all the resource are creating using app.route method here
// app.route('/api/v1/movies')
//     .get(getMovies)
//     .post(addMovie);

// app.route('/api/v1/movies/:id')
//     .patch(updateMovie)
//     .delete(deleteMovie)
//     .get(getMovie)



//rest api's for particular resource is created by creating a router.
//expres.Router() method returns a middleware so we need to call the middleware using app.use() method.
//In order to call a router middleware only for specific resouce we need to provide the starting path of the resource and it will automatically append the path of the routes created using that router middleware .
const moviesRouter=express.Router();
moviesRouter.route('/')
    .get(getMovies)
    .post(addMovie);

moviesRouter.route('/:id')
    .patch(updateMovie)
    .delete(deleteMovie)
    .get(getMovie)

app.use("/api/v1/movies",moviesRouter);

app.listen(8000, () => {
    console.log("server is listening on port 8000")
})



//Process of creating a server using pure nodejs
// const http=require("http");
// const server=http.createServer()
// server.on("request",(req,res)=>{
//     res.end("bye")
// })
// server.listen(8000,'127.0.0.1',()=>{
//     console.log('Server has started');
// })