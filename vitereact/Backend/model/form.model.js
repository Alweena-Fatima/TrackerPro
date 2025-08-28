import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  company: String,
  role: String,
  location: String,
  ctc: String,
  deadline: {
    type: Date,
    default: () => {
      const today = new Date();
      today.setHours(23, 59, 59, 999); // set time to 23:59:59.999
      return today;
    }
  },
  oaDate: Date,
  mode: String,
  interVDate: Date,
  interVMode: String,
});

const Company = mongoose.model("Company", companySchema);

export default Company;
