const { RegisterUserDTO, UserMapper } = require("../dto/auth.dto");
const { CredentialsException } = require("../exceptions/exceptions.js");
const { generateToken } = require("../utils/auth.helper.js");
const { hashPassword, verifyPassword } = require("../utils/hashs.helper.js");

class AuthService {
    constructor(userRepository){
        this.repository = userRepository;
    }

    async registerUser (user){
            const historyPassword = [];
            user.status = "active";
            //Tratamiento de Password
            const password = await hashPassword(user.password);
            user.password = password;
            user.haveChangePassword = true;
            historyPassword.push(password);
            user.historyPassword = historyPassword;
            //Creamos el usuario
            const userDTO = new RegisterUserDTO(user);
            return UserMapper.toResponse(await this.repository.create(userDTO));
    }

    async loginUser(credentials){
            const user = await this.repository.findByEmail(credentials.email);
           
            if(!user){
                throw new CredentialsException("Credenciales incorrectas");
            }
    
            const isMatch = await verifyPassword(user.password, credentials.password);
    
            if(!isMatch){
                throw new CredentialsException("Credenciales incorrectas");
            }
    
            const token = generateToken(user);
            
            const userMapper = UserMapper.toResponse(user);
            
            userMapper.token = token;
                    
            return userMapper;
    }


}

module.exports = AuthService;