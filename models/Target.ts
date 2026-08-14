import mongoose from 'mongoose';

const TargetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  khatamDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  createdBy: { type: String, required: true }, 
  participants: [{
    id: { type: String, required: true },
    name: { type: String, required: true }
  }], 
});

export default mongoose.models.Target || mongoose.model('Target', TargetSchema);