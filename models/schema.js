const mongoose= require('mongoose')
var Schema= mongoose.Schema;
var bcrypt= require('bcrypt');

var schemaUser= new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    createdDate: {type: String}
})
var schemaNote= new Schema({
    userId: {type: Schema.Types.ObjectId,ref: 'User'},
    text: {type: String},
    completed: {type: Boolean},
    createdDate: {type: String}
})

schemaUser.methods.encryptPassword=function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}
schemaUser.methods.validPassword=function(password) {
    return bcrypt.compareSync(password, this.password)
}
 var User= mongoose.model('User',schemaUser)

 var Note= mongoose.model('Note',schemaNote)
 
 module.exports={
        User,
        Note
       
 }
