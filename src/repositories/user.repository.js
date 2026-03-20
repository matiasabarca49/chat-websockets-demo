const User = require('../model/user.model.js');

class UserRepository {

    async create(userData) {
        return await User.create(userData);
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

