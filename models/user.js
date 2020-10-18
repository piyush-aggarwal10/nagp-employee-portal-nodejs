const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecret = "piyush-employee-portal-secret";
const saltRounds = process.env.SALT_ROUNDS || 10;

const UserSchema = mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: null },
    notification: { type: Array, default: [] },
    isActive: { type: Boolean, default: true, required: true },
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
    role: { type: String, required: true }
});

UserSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.password;
    }
});

UserSchema.methods.toAuthJson = function () {
    return {
        username: this.username,
        _id: this._id,
        token: this.generateJwtToken()
    };
}

UserSchema.methods.validatePassword = async function (password) {
    const isPasswordMatching = await bcrypt.compare(password, this.password);
    return isPasswordMatching;
};

UserSchema.methods.setHashedPassword = async function () {
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    this.password = hashedPassword;
};

UserSchema.methods.generateJwtToken = function () {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 1);

    //jwt -> header, payload, secret-key
    return jwt.sign({
        id: this._id,
        username: this.username,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
        role: this.role
    }, jwtSecret);
}

const User = mongoose.model('User', UserSchema);

module.exports = User;