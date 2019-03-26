const { send, json } = require('micro')
const cors = require('micro-cors')()
const { router, get, post, put, del } = require('microrouter')

let friends = [
    {
        "_id": 1,
        "name": "Hayden",
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
    const results = await friends.filter(friend => friend._id == req.params._id)
    return send(res, 200, results)
}

// below is working
const deleteFriend = async (req, res) => {
    const index = await friends.findIndex(friend => friend._id == req.params._id);
    const results = await friends.splice(index, 1);
    return send(res, 200, results)
}

// below is working
const createFriend = async (req, res) => {
    const data = await json(req)
    const friend = await data
    friend["_id"]= friends.length + 1
    friend["name"]= data.name
    friend["age"]= data.age
    const results = await friends.push(friend);
    return send(res, 200, results)
}

// below is working
const updateFriend = async (req, res) => {
    const data = await json(req)
    const index = await friends.findIndex(friend => friend._id == req.params._id)
    const friend = await friends[index]
    friend["name"]= data.name
    friend["age"]= data.age
    const results = await friends.splice(index, 1, friend);
    return send(res, 200, results)

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