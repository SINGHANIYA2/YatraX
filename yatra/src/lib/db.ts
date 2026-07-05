import mongoose, { Connection } from "mongoose";
const mongodbUrl = process.env.MONGODB_URL


// used to store db server
let cached=global.mongooseConn

if(!cached){
    cached=global.mongooseConn={conn:null,promise:null}
}


// console.log("Registered models:", mongoose.modelNames());

const connectDb= async () =>{
    if (!mongodbUrl) {
        throw new Error("DB url not found")
    }
    if(cached.conn){
        console.log("Cached Connection")
        return cached.conn
    }
    
    if(!cached.promise){
        cached.promise = mongoose.connect(mongodbUrl).then(c => c.connection)
    }
    
    try{
        const conn = await cached.promise
        cached.conn = conn;
        console.log("new Connection Established")
        return conn 
    }catch(error){
        console.log(error)
    }
}

export default connectDb