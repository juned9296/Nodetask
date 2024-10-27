import mongoose from "mongoose";

export const connectDb = async()=>{
    try {
        await mongoose.connect('mongodb+srv://junedahmad9296:juned9296@cluster0.nhk6p.mongodb.net/')
        console.log("database connected Successfully !!!")
    } catch (error) {
         console.log('Comming to error in connectDb',error)
    }
}