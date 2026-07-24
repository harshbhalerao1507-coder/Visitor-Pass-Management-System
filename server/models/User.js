import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Security", "Employee", "Visitor"],
      default: "Employee",
    },
    phone: {
      type: String,
    },
    department: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.statics.register= async function (email,password,name,role,phone,department){
    const exists=await this.findOne({email})
    if(exists){
      throw Error("Email already Exist")
    }
    if (!name || !email || !password) {
    throw Error("All required fields must be filled");
    }
    if(!validator.isEmail(email)){
      throw Error("Enter Valid Email")
    }
    else if(!validator.isStrongPassword(password)){
      throw Error("Enter Strong Password")
    }
    const salt=await bcrypt.genSalt(10) 
    const hash=await bcrypt.hash(password,salt)
    const user=await this.create({
      email,
      password:hash,
      name,
      role,
      phone,
      department
    })
    return user
}
userSchema.statics.login=async function(email,password){
    if (!email || !password) {
    throw Error("All required fields must be filled");
    }
    const user=await this.findOne({email})
    if(!user){
      throw Error("User Does not Exists")
    }
    const match=await bcrypt.compare(password,user.password)
    if(!match){
      throw Error("Incorrect password")
    }
    return user
}
const User = mongoose.model("User", userSchema);
export default User;
