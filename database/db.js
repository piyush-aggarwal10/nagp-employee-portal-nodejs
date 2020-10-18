const mongoose = require('mongoose');

function connectToDatabase(dbUrl) {
    mongoose.connect(dbUrl, { useNewUrlParser: true });

    const connection = mongoose.connection;

    connection.on('error', () => {
        console.log("Error connecting to Database");
    })
}

module.exports = {
    connectToDatabase
};