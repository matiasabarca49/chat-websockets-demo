//Repository
const UserRepository = require("../repositories/user.repository.js")
const userRepository = new UserRepository()
//Service
const UserService = require('../services/user.service.js');
const userService = new UserService(userRepository);

const createUser = async (req, res) =>{

    console.log("body: ", req.body);

    const userCreated = await userService.create(req.body);

    res.status(200).json({success: true, data: userCreated});
}


module.exports = {
    createUser
}