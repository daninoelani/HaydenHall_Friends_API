const { send, json } = require('micro')
const cors = require('micro-cors')()
const { router, get, post, put, del } = require('microrouter')

var Datastore = require('nedb')
    , friends = new Datastore({ filename: './data.db', autoload: true });

//   var doc = {
//             "_id": 3,
//             "name": "jim",
//             "age": 20
//         };

// db.insert(doc, function (err, newDoc) {   // Callback is optional
//   // newDoc is the newly inserted document, including its _id
//   // newDoc has no key called notToBeSaved since its value was undefined
// });


let friendsList = []

const notfound = (req, res) => send(res, 404, 'Not found route')

// below is working
// const getFriends = async (req, res) => {
//     const results = await friends
//     return send(res, 200, results)
// }

// const updateList = (docs) => {
//     friendsList = [...docs]
//     return friendsList , console.log('updateList:', friendsList )
// }

//new nedb getFriends // below is working
const getList = () => {
    return new Promise((resolve, reject) => {
        friends.find({}, function (err, docs) {
            // console.log('1 getList', docs)
            resolve(docs)
        })
    })
}

const getFriends = async (req, res) => {
    const results = await getList()
    friendsList = results
    // console.log('2 listOfFriends', listOfFriends)
    return results
}
//end of new nedb getFriends

// below is working
// const getFriend = async (req, res) => {
//     const results = await friends.filter(friend => friend._id == req.params._id)
//     return send(res, 200, results)
// }

//new nedb getFriend
// not working yet still needs work but skipping it for now because the UI part is not done yet
const getFriend = (req, res) => {
    friends.findOne({ _id: 2 }, function (err, doc) {
        console.log('Found user:', doc.name);
    });
}
//end of new nedb getFriend

// below is working
// const deleteFriend = async (req, res) => {
//     const index = await friends.findIndex(friend => friend._id == req.params._id);
//     const results = await friends.splice(index, 1);
//     return send(res, 200, results)
// }

//new nedb deleteFriend  // below is working
const byByUser = (id) => {
    return new Promise((resolve, reject) => {
        friends.remove({ _id: parseInt(id) }, {}, function (err, numDeleted) {
            console.log('Deleted', numDeleted, 'user(id)', id);
            resolve(numDeleted)
        });
    })
}

const deleteFriend = async (req, res) => {
    let id = req.params._id
    const results = await byByUser(id)
    console.log('deleteFriend', results)
    return results
}
//end of new nedb deleteFriend


// below is working
// const createFriend = async (req, res) => {
//     const data = await json(req)
//     const friend = await data
//     friend["_id"] = friends.length + 1
//     friend["name"] = data.name
//     friend["age"] = data.age
//     const results = await friends.push(friend);
//     return send(res, 200, results)
// }

//new nedb createFriend // below is working
const newUser = (friend) => {
    return new Promise((resolve, reject) => {
        let doc = {
            _id: friendsList.length + 1
            , name: friend.name
            , age: friend.age
        };

        friends.insert(doc, function (err, newDoc) {   
            // console.log('newDoc', newDoc);
            resolve(newDoc)
        });
    })
}

const createFriend = async (req, res) => {
    const data = await json(req)
    const results = await newUser(data);
    console.log('createFriend', results)
    return send(res, 200, results)
}
//end of new nedb createFriend


// below is working
// const updateFriend = async (req, res) => {
//     const data = await json(req)
//     const index = await friends.findIndex(friend => friend._id == req.params._id)
//     const friend = await friends[index]
//     friend["name"] = data.name
//     friend["age"] = data.age
//     const results = await friends.splice(index, 1, friend);
//     return send(res, 200, results)
// }

//new nedb updateFriend // below is not working
const updateFriend = async (req, res) => {
    // const data = await json(req)
    // const index = await friends.findIndex(friend => friend._id == req.params._id)
    // const friend = await friends[index]
    // friend["name"] = data.name
    // friend["age"] = data.age
    // const results = await friends.splice(index, 1, friend);
    return send(res, 200, results)
}
//end of new nedb updateFriend


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