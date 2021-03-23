const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true, min: 3},
    passwordHash: String    
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        
        delete returnedObject.passwordHash
    }
})

module.exports = mongoose.model('User', userSchema)