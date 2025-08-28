import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
   userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
  company: {
    type:String,
    required:[true, "Company is Required"]
  },
  role: {
    type:String,
    required:[true, "Role is Required"]
  },
  location: {
    type:String,
    required:[true, "Loaction is Required"]
  },
  ctc: {
    type:String,
    required:[true, "CTC is Required"]
  },
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
},{
    timestamps: true
}
);
// Index for faster queries
companySchema.index({ userId: 1 });
companySchema.index({ company: 1 });
companySchema.index({ deadline: 1 });
const Company = mongoose.model("Company", companySchema);

export default Company;
