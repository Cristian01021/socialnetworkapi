const mongoose = require('mongoose');

// Wrap Mongoose around local connection to MongoDB
mongoose.connect('mongodb+srv://Cristian1021:Vvl7D9g7PIwwfPEm@classactivites.fldddny.mongodb.net/');

// Export connection 
module.exports = mongoose.connection;