const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userID: { type: String, require: true, unique: true},
    serverID: { type: String, requre: true},
    endorsments: {type: Number, default: 0},
    communityPoints: {type: Number},
    challangePoints: {type: Number},
    eventTrophies: {type: Number}
});

const model = mongoose.model('ProfileModels', profileSchema);

module.exports = model;