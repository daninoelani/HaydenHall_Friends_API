const { send, json } = require('micro')
const cors = require('micro-cors')()
const { router, get, post, put, del } = require('microrouter')

// const parse = require('urlencoded-body-parser');

let friends = [
    {
        "_id": 1,
        "name": "Laura",
        "age": 20
    },
    {
        "_id": 2,
        "name": "Legend",
        "age": 20
    },
    {
        "_id": 3,
        "name": "Mike",
        "age": 20
    }
]

const notfound = (req, res) => send(res, 404, 'Not found route')

// below is working
const getFriends = async (req, res) => {
    const results = await friends
    return send(res, 200, results)
}

// below is working
const getFriend = async (req, res) => {
    // const index = await friends.findIndex(friend => friend._id == req.params._id);  
    const results = await friends.filter(friend => friend._id == req.params._id)
    // console.log("index:", index)
    // console.log("results", results)
    return send(res, 200, results)
}

// below is working
const deleteFriend = async (req, res) => {
    // friends = await friends.remove({_id: req.params.id});
    // return send(res, 200, results)
    const index = await friends.findIndex(friend => friend._id == req.params._id);
    console.log("index:", index)
    const results = await friends.splice(index, 1);
    return send(res, 200, results)
}

// below is working
// const createFriend = async (req, res) => {
//     const friend = await parse(req)
//         .then(req.query._id = friends.length + 1)
//         .then(this.friend = req.query)
//         .catch(err => console.log(err))
//     const results = await friends.push(this.friend);
//     console.log("this.friend:", this.friend)
//     return send(res, 201, results)
// }

// below is working
const createFriend = async (req, res) => {
    const data = await json(req)
    console.log("data:", data)
    const friend = await data
    friend["_id"]= friends.length + 1
    friend["name"]= data.name
    friend["age"]= data.age
    const results = await friends.push(friend);
    console.log("friend:", friend)
    return send(res, 200, results), console.log("results:", results)
}

// below is working
const updateFriend = async (req, res) => {
    const data = await json(req)
    const index = await friends.findIndex(friend => friend._id == req.params._id)
    const friend = await friends[index]
    console.log("index:", index, "data", data)
    friend["name"]= data.name
    friend["age"]= data.age
    const results = await friends.splice(index, 1, friend);
    return send(res, 200, results), console.log("results:", results)

}

module.exports = cors(
    router(
        get('/friends', getFriends),
        get('/friend/:_id', getFriend),
        post('/friend', createFriend),
        put('/friend/:_id', updateFriend),
        del('/friend/:_id', deleteFriend),
        get('/*', notfound)
    )
)