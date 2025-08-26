import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  company: String,
  role: String,
  location: String,
  ctc: String,
  deadline: Date,
  oaDate: Date,
  mode: String,
  interVDate: Date,
  interVMode: String,
});

const Company = mongoose.model("Company", companySchema);

export default Company;
