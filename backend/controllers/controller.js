import usermodel, { validate } from '../models/User.js';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import  sendgridtranspoter  from 'nodemailer-sendgrid-transport';

const transporter=nodemailer.createTransport(
    sendgridtranspoter({
        auth:{
            api_key:'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'
        }
    })
)
export const Register=async(req,res)=>{
    try{
const {username,email,password} = req.body;
if(!username){
   return res.status(400).send({message: 'Please enter name'})
}
if(!email){
   return res.status(400).send({message: 'Please enter email'})
}
if(!password){
   return res.status(400).send({message: 'Please enter password'})
}
const existingUser =await usermodel.findOne({email})
if(existingUser){
   return res.status(400).send({message: 'Already registered'})
}
const hashedpassword = await bcrypt.hash(password,10);
const user=await new usermodel({username,email,password:hashedpassword}).save();
return res.status(200).send({ success:true,message: 'user register successfully', user})
    }
    catch(error){
        console.log(error);
        return res.status(404).send({success: false,message:" Error in Registeration"})
    }
};
export const login=async(req,res) => {
    try{
const {email,password} = req.body;
if(!email){
    return res.status(400).send({message: 'Please enter email'});
}
if(!password){
    return res.status(400).send({message: 'Please enter password'});
}
const user=await usermodel.findOne({email})
if(!user){
    return res.status(400).send({message: 'user not found'})
}
const comparepassword=await bcrypt.compare(password,user.password);
if(!comparepassword){
    return res.status(400).send({message: 'unvalid password'})

}
const token=jwt.sign({userId:user._id,usename:user.username}, process.env.SECRET_KEY,{expiresIn:'1h'});
res.status(200).send({success:true,message:"user login seccessfully ", userId:user._id, usename:user.username,token})

    }
    catch(error){
        console.log(error);
        res.status(400).send({success:false,message:"Unauthorized access"})
    }
}

export const forgotPassword=async(req,res)=>{
    try{
const {email}=req.body;
const user=await usermodel.findOne({email})
if(!user){
    return res.status(403).send({success:false,message:"user not found"})
}
const resetToken=jwt.sign({userId:user._id.toString()}, process.env.SECRET_KEY,{expiresIn:'1h'});
user.resetToken=resetToken;
user.resetTokenExpiration=Date.now()+3600000;
await user.save();
transporter.sendMail(
{
    to:email,
    from:'nixamuddin15701@gmail.com',
    subject:'password reset mail',
    text:'click on the link to reset your password',
    html: '<p>Click this <a href="http://localhost:3000/reset/${resetToken}">link</a> to set a new password.</p>'
}
);
res.status(200).send({success:true, message:"forgot password link has sent to your Email"});
    }
    catch(error){
        console.log(error);
        res.status(400).send({success:false,message:"something went wrongs"})
    }
}
export const resetpassword =async (req, res) => {
    try{
const{token,newpassword} = req.body;
const user=await validate(token);
if(!user){
    return res.status(401).send({success:false,message:"password is invalid"});
}
const hashedpassword=await bcrypt.hash(newpassword,10);
user.password=hashedpassword;
user.resetToken=undefined;
user.resetTokenExpiration=undefined;
await user.save();
res.status(200).send({success:true,message:"password reset successfully"})
    }
    catch(error){
        console.log(error);
        res.status(400).send({success:false,message:"error while reset password"})
    }
}