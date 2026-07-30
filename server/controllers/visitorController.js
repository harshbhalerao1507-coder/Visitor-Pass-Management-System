import Visitor from "../models/Visitor.js";
import sendEmail from "../utils/sendEmail.js";
export const getVisitors=async (req,res)=>{
    const visitors=await Visitor.find({});
    res.status(200).json({
        visitors:visitors
    })
}
export const createVisitor=async (req,res)=>{
    try{
    const {name,email,phone,address,company,idProof}=req.body;
    const photo = req.file ? req.file.filename : null;
    if(!name || !email||!phone || !address || !company || !photo || ! idProof){
        return res.status(400).json({
            error:"Invalid Details"
        })
    }
    const visitor=await Visitor.create({name,email,phone,address,company,photo,idProof})
    console.log("Sending email to:", visitor.email);
    await sendEmail(
            visitor.email,
            "Visitor Registration Successful",
            `Hello ${visitor.name},

            Your visitor registration has been completed successfully.

            Thank you for using the Visitor Pass Management System.`
        );
    res.status(200).json({
        Visitor:visitor
    }) }
    catch(e){
        res.status(500).json({
            error:e.message
        })
    }
}
export const getVisitorById = async (req,res)=>{
    try{
        const id=req.params.id
        if(!id){
            return res.status(400).json({
                error:"Id not Found"
            })
        }
        const visitor= await Visitor.findById(id)
        res.status(200).json({
            Visitor:visitor
        })
    }
    catch(e){
        res.status(500).json({
            error:e.message
        })
    }
}
export const deleteVisitorById = async (req,res)=>{
    try{
        const id=req.params.id
        if(!id){
            return res.status(400).json({
                error:"Id not Found"
            })
        }
        const visitor= await Visitor.findByIdAndDelete(id)
        res.status(200).json({
            Visitor:visitor
        })
    }
    catch(e){
        res.status(500).json({
            error:e.message
        })
    }
}
export const updateVisitorById = async (req,res)=>{
    try{
        const id=req.params.id
        const updates=req.body
        if(!id){
            return res.status(400).json({
                error:"Id not Found"
            })
        }
        const visitor= await Visitor.findByIdAndUpdate(id,updates,{new:true})
        res.status(200).json({
            Visitor:visitor
        })
    }
    catch(e){
        res.status(500).json({
            error:e.message
        })
    }
}
