var mongoose = require('mongoose');
const colors = require('colors');

mongoose.set('strictQuery', true);
mongoose.connect(process.env.DB_CONN_STRING,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    
}).then(()=>{
    console.log('Database connected!'.cyan.bold)
}).catch((err)=>{
    console.log(err);
})
