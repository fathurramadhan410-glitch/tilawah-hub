import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  clerkId: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, required: true, enum: ['hadir', 'izin'] },
  reason: { type: String },
});

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);