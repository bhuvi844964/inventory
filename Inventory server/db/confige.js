const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
mongoose.connect(process.env.URL,  {useNewUrlParser: true})

.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) ) 
       
