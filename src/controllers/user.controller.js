//Repository
const UserRepository = require("../repositories/user.repository.js")
const userRepository = new UserRepository()
//Service
const UserService = require('../services/user.service.js');
const userService = new UserService(userRepository);


const getAllUsers = async(req,res, next)=>{
    try{
        const users = await userService.getAll(req.user);
    
        return res.status(200).json({success: true, data: users});

    }catch(error){
        next(error);
    }
}

const createUser = async (req, res, next) =>{
    try{
        const userCreated = await userService.create(req.body);
    
        return res.status(200).json({success: true, data: userCreated});
    }catch(error){
        next(error);
    }
}


module.exports = {
    createUser,
    getAllUsers
}