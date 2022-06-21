const mongoose= require('mongoose')
var Schema= mongoose.Schema;
var bcrypt= require('bcrypt');

var schemaUser= new Schema({
    username: {type: String},
    createdDate: {type: String}
})
var schemaNote= new Schema({
    userId: {type: Schema.Types.ObjectId,ref: 'User'},
    text: {type: String},
    completed: {type: Boolean},
    createdDate: {type: String}
})
var credential= new Schema({
    username: {type: String, require:true},
    password:{type: String, require:true}
})
credential.methods.encryptPassword=function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}
credential.methods.validPassword=function(password) {
    return bcrypt.compareSync(password, this.password)
}
 var User= mongoose.model('User',schemaUser)

 var Note= mongoose.model('Note',schemaNote)
 var Credential= mongoose.model('Credential',credential)
 module.exports={
        User,
        Note,
        Credential
 }
