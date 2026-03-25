class RegisteredRequestDTO{
    constructor(user){
        this.name = user.name;
        this.lastName = user.lastName;
        this.username = user.username;
        this.password = user.password;
        this.email = user.email;
    }
}

class RegisterUserDTO {
    constructor(user){
        this.name = user.name;
        this.lastName = user.lastName;
        this.username = user.username;
        this.password = user.password;
        this.email = user.email;
        this.status = user.status;
        this.haveChangePassword = user.haveChangePassword;
        this.historyPassword = user.historyPassword;
    }
}

class LoginRequestDTO{
    constructor(credentials){
        this.email = credentials.email;
        this.password = credentials.password;
    }
}

class UserMapper {
    static toResponse(user){
        return {
            id: user._id || user.id,
            name: user.name,
            lastName: user.lastName,
            username: user.username,
            email: user.email
        }
    }
}

module.exports = {
    UserMapper,
    RegisteredRequestDTO,
    RegisterUserDTO,
    LoginRequestDTO
}