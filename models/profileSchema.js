const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userID: { type: String, require: true, unique: true},
    userName: {type: String},
    serverID: { type: String, requre: true},
    communityAwards: {type: Number, default: 0},
    CACooldown: {type: String},
    eventTrophies: {type: Number, default: 0},
    challangeTrophies: {type: Number, default: 0},
    titles: [{type: String}]
});

const model = mongoose.model('ProfileModels', profileSchema);

module.exports = model;