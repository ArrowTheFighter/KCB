const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userID: { type: String, require: true, unique: true},
    serverID: { type: String, requre: true},
    communityAwards: {type: Number, default: 0},
    communityPoints: {type: Number, default: 0},
    challangePoints: {type: Number,default: 0},
    eventTrophies: {type: Number}
});

const model = mongoose.model('ProfileModels', profileSchema);

module.exports = model;