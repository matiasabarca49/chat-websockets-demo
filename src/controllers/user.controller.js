//Repository
const UserRepository = require("../repositories/user.repository.js")
const userRepository = new UserRepository()
//Service
const UserService = require('../services/user.service.js');
const userService = new UserService(userRepository);


const getAllUsers = async(req,res)=>{
    try{
        const users = await userService.getAll(req.user);
    
        return res.status(200).json({success: true, data: users});

    }catch(error){
        console.error(error)
        return res.status(500).json({success: false, error: "Error en el servidor"});
    }
}

const createUser = async (req, res) =>{
    try{
        const userCreated = await userService.create(req.body);
    
        return res.status(200).json({success: true, data: userCreated});
    }catch(error){
        console.error(error);
        return res.status(500).json({success: false, error: "Error en el servidor"});
    }
}


module.exports = {
    createUser,
    getAllUsers
}