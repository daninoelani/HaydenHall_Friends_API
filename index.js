const { send, json } = require('micro')
const cors = require('micro-cors')()
const { router, get, post, del } = require('microrouter')

const friends = [
    {"_id" : 1,
    "name" : "Laura",
    "age" : 20},
    {"_id" : 2,
    "name" : "Legend",
    "age" : 20}
]

const notfound = (req, res) => send(res, 404, 'Not found route')

const getFriends = async (req, res) => {
    const results = await friends
    return send(res, 200, results)
}

const createFriends = async (req, res) => {
    const data = await json(req)
    console.log(data)
    data._id=friends.length + 1
    console.log(data)
    const results = await friends.push(data);
    return send(res, 201, results)
}

const deleteFriends = async (req, res) => {
    const results = await friends.filter({_id: req.params.id});
    return send(res, 200, results)
}


module.exports = cors(
    router(
        get('/friends', getFriends),
        post('/friends', createFriends),
        del('/friends/:_id', deleteFriends),
        get('/*', notfound)
    )
)