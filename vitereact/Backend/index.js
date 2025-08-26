import express from "express";
import mongoose from "mongoose";
import Company from "./model/form.model.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Connect DB
mongoose.connect('mongodb://127.0.0.1:27017/CompanyCrud')
    .then(() => console.log("Database connected"))
    .catch(err => console.log(err));
//home 

// Get all companies
app.get("/companies", async (req, res) => {
    try {
        const companies = await Company.find();
        res.json(companies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add company
app.post("/addCompany", async (req, res) => {
    try {
        const newCompany = new Company(req.body);
        const savedCompany = await newCompany.save();
        return res.json(savedCompany);   // ✅ frontend will handle navigation
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

//edit company 

//delete 
app.delete("/companies/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const deletedCompany = await Company.findByIdAndDelete(new mongoose.Types.ObjectId(id));

    if (!deletedCompany) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.status(200).json({ message: "Company deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(3000, () => console.log("Server running on port 3000"));
