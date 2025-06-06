import userSchema from "../models/user.model.js"
import bcrypt from "bcrypt"
import jrk from "jsonwebtoken"
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "cbe9707214b09e",
      pass: "19237d1b3de970",
    },
  });
const {sign}=jrk
export async function addUser(req,res){
    const {username,email,password,cpassword}=req.body
    console.log(username,email,password,cpassword);
    if(!(username&&email&&password))
        return res.status(404).send({msg:"fields are empty"})
    if(password!=cpassword)
        return res.status(404).send({msg:"password not match"})

    const data=await userSchema.findOne({email})
    
    if(data)
        return res.status(404).send({msg:"email already exist"})
    
    const hPassword=await bcrypt.hash(password,10)
    console.log(hPassword);

    await userSchema.create({username,email,password:hPassword}).then(()=>{
        res.status(201).send({msg:"successfully created"})
    }).catch((err)=>{
        res.status(500).send({msg:err})
    })
    
    
    
}   

export async function loginUser(req,res){
    const {email,password} = req.body
    if(!(email&&password))
        return res.status(404).send({msg:"fields are empty"})

    const user=await userSchema.findOne({email})
    if(user==null)
        return res.status(404).send({msg:"email is not valid"})
    const sucess=await bcrypt.compare(password,user.password) 
    console.log(sucess)
    if(!sucess)
        return res.status(404).send({msg:"incorrept password"})

    const token=await sign({userID:user._id},process.env.JWT_KEY,{expiresIn:"24h"})
    res.status(200).send({msg:"successfully loged in ",token})
}


export async function Home(req,res){
    try {
        console.log("end point");
        console.log(req.user);
        const _id=req.user.userID;
        const user=await userSchema.findOne({_id});
        res.status(200).send({username:user.username})
        
    } catch (error) {
        res.status(400).send({error})
    }
}


export async function passwordRequest(req, res) {
    console.log(req.body)

    try {
        const info = await transporter.sendMail({
            from: 'deyab87446@owube.com', // sender address
            to: req.body.email, // list of receivers
            subject: "verify ✔", // Subject line
            text: "verify your email", // plain text body
            html: "<a href='http://localhost:3000/pages/forgot.html'><button>verify</button></a>", // html body
          });
        
          console.log("Message sent: %s", info.messageId);
          res.status(200).send({msg: "check your email"});


    } catch (error) {
        res.status(500).send(error)
    }

}
