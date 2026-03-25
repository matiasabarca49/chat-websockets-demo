const { RegisteredRequestDTO, LoginRequestDTO } = require('../dto/auth.dto.js');
const UserRepository = require('../repositories/user.repository.js');
const AuthService = require('../services/auth.service.js');
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

const registerUser = async (req, res)=>{
    try{
        const userRequest = new RegisteredRequestDTO(req.body);
        const registeredUser = await authService.registerUser(userRequest);

        return res.status(200).json({success: true, data: registeredUser});
    }catch(error){
        console.error(error)
        return res.status(200).json({success: false, message: "Error en el Servidor"});
    }
}

const loginUser = async (req, res)=>{
    try{
        const crendentials = new LoginRequestDTO(req.body);
        const user = await authService.loginUser(crendentials);

        res.cookie('token', user.token, {
            httpOnly: true, // Asegura que solo sea accesible por el servidor
            sameSite: 'strict', // Protección CSRF
            maxAge: 3600000, // Tiempo de expiración en milisegundos (1 hora)
        });

        return res.status(200).json({success: true, data:  user})
    }
    catch(error){
        console.log(error);
        return res.status(500).json({success: false, message: "Error en el servidor"})
    }
}

const logoutUser = (req, res) =>{
    const cookieFounded = req.cookies.token;

      if(!cookieFounded){
        return res.status(400).json({ success: false, error: "Usuario no logueado"});
      }

      res.clearCookie('token'); 

      return res.status(200).json({success: true, message: "Usuario Desconectado con Éxito"});
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser
}