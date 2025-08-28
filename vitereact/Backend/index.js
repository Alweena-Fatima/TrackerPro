import express from "express";
import mongoose from "mongoose";
import Company from "./model/form.model.js";
import User from "./model/user.model.js";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());

// JWT Secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here-change-in-production";

// Connect DB connecting atlas 
mongoose.connect('mongodb+srv://alweenacse_db_user:REMOVED_SECRET@companycluster.cptw0lz.mongodb.net/?retryWrites=true&w=majority&appName=CompanyCluster')
    .then(() => console.log("Database connected"))
    .catch(err => console.log(err));

// User signup 
app.post("/signup", async(req,res)=>{
  try{
    const {userid,password}=req.body;
    if(!userid || !password){
      return res.status(400).json( // Use 400 for bad request
        {
          success:false,
          message:"User Id and Password are not given"
        }
      );
    }
    const existinguser = await User.findOne({userid});
    if(existinguser){
      return res.status(409).json(
        {
          success:false,
          message:"This user is already exists"
        }
      );
    }
    const saltRound=12;
    const hasedPassword=await bcrypt.hash(password,saltRound);
    const newuser = new User({
      userid,
      password:hasedPassword
    });
    const saveduser = await newuser.save();
    const token = jwt.sign(
      {userId: saveduser._id , userid: saveduser.userid},
      JWT_SECRET,
      {expiresIn:'24h'}
    );
    res.status(201).json(
      {
        success:true,
        message:"User Created Successfully",
        token,
        user:{
          id:saveduser._id,
          userid:saveduser.userid
        }
      }
    );
  }
  catch(err){
    console.error("Signup error",err);
    res.status(500).json(
      {
        success:false,
        message:"server error during signup "
      }
    )
  }
});

// User login 
app.post("/login", async(req,res)=>{
  try{
    const {userid,password}=req.body;
    if(!userid || !password){ // Use OR operator for better logic
      return res.status(400).json( // Use 400 for bad request
        {
          success:false,
          message:"User Id and Password are not given"
        }
      );
    }
    // Corrected: Use capital 'U' for the User model
    const Loginuser = await User.findOne({userid});
    if(!Loginuser){
      return res.status(401).json(
        {
          success:false,
          message:"Invalid Userid pls signup "
        }
      );
    }
    const isuserPass = await bcrypt.compare(password,Loginuser.password);
    if(!isuserPass){
      return res.status(401).json({
        success:false,
        message:"Invaild password"
      });
    }
    Loginuser.lastLogin = new Date();
    await Loginuser.save();
    const token = jwt.sign(
      { userId: Loginuser._id, userid: Loginuser.userid },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: Loginuser._id,
                userid: Loginuser.userid
            }
        });
  }
  catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ 
            success: false,
            message: "Server error during login" 
        });
    }
});

// Middleware to verify JWT token 
const authtoken=(req,res,next)=>{
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
    req.user = user;
    next();
  });
}

//--------------------COMPANY ROUTES----------------------------------

// Get all companies for the authenticated user
app.get("/companies", authtoken, async (req, res) => {
    try {
        const companies = await Company.find({ userId: req.user.userId });
        res.json(companies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add company for the authenticated user
app.post("/addCompany", authtoken, async (req, res) => {
    try {
        // Ensure the company is linked to the authenticated user
        const newCompany = new Company({ ...req.body, userId: req.user.userId });
        const savedCompany = await newCompany.save();
        return res.json(savedCompany);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// The /addUser route is redundant and should be removed.
// The /delete route needs authtoken and correct userId check
app.delete("/companies/:id", authtoken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    // Corrected: Check both the company's _id AND the authenticated user's ID
    const deletedCompany = await Company.findOneAndDelete({
        _id: id,
        userId: req.user.userId
    });

    if (!deletedCompany) {
      return res.status(404).json({ error: "Company not found or Unauthorized" });
    }
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));