const { RegisterUserDTO, UserMapper } = require("../dto/auth.dto");
const { generateToken } = require("../utils/auth.utils");

class AuthService {
    constructor(userRepository){
        this.repository = userRepository;
    }

    async registerUser (user){
        const historyPassword = [];
        user.status = "active";
        user.haveChangePassword = true;
        historyPassword.push(user.password);
        user.historyPassword = historyPassword;
        const userDTO = new RegisterUserDTO(user);
        return UserMapper.toResponse(await this.repository.create(userDTO));
    }

    async loginUser(credentials){
        const user = await this.repository.findByEmail(credentials.email);
        if(!user){
            throw new Error("Usuario no encontrado");
        }

        if(user.password !== credentials.password){
            throw new Error("Credenciales incorrectas");
        }

        const token = generateToken(user);
        
        const userMapper = UserMapper.toResponse(user);
        
        userMapper.token = token;
                
        return userMapper;
    }


}

module.exports = AuthService;