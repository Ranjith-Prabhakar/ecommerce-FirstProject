//mongoose


module.exports = ()=>{
    const mongoose = require('mongoose')
    mongoose.connect(process.env.MongoDbCollection)
        .then(() => console.log('mongoDb server also started exicution'))
        .catch((error) => console.log(error.message))
}
