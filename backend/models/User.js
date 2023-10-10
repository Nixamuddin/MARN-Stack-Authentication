import mongoose from "mongoose";
const Userschema=new mongoose.Schema({
    username: {
        type: String, required: true,
    },
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role:{type: Boolean,
        default: 0 },
    resetToken:String,
    resetTokenExpiration:Date,

},{timestamps:true});
export default mongoose.model("User", Userschema)
export const validate=async(resetToken)=>{
    try{
        const user=await User.findOne({resetToken,resetTokenExpiration:{$gt:Date.now()}});
            if(!user){
return null;
            }
            return user;
    }
    catch(error){
        throw error;
    
    }
}