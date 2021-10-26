const mongoose = require('mongoose');

const titlesSchema = new mongoose.Schema({
    titlesID: {type: String, required: true, unique: true},
    storedTitles: [{type: String}],
});

const model = mongoose.model('TitlesModels', titlesSchema);

module.exports = model;