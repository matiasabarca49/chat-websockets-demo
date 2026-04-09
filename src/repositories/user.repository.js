const { DuplicateEntryException } = require('../exceptions/exceptions.js');
const User = require('../model/user.model.js');

class UserRepository {

    async getAll(){
        return await User.find().lean();
    }

    async create(userData) {
        return await User.create(userData)
            .catch(err => {
                if(err.code === 11000){
                    const field = `${Object.keys(err.keyValue)[0]}`;
                    const value = err.keyValue[field];
                    throw new DuplicateEntryException("Users", field, value);
                }else {
                    throw err;
                }
            });
    }

    async findByUsername(username) {
        return await User.findOne({ username });
    }

    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async findById(userId) {
        return await User.findById(userId).lean();
    }

    async findByFilter(filter){
        return await User.find(filter).lean();
    }
}

module.exports = UserRepository;

