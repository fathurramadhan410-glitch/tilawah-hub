import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  clerkId: { type: String, required: true },
  date: { type: String, required: true }, // Format YYYY-MM-DD
  status: { type: String, required: true, enum: ['hadir', 'izin'] },
  leaveType: { type: String, enum: ['Sakit', 'Izin', 'Kesibukan', 'Lainnya'], default: null },
  reason: { type: String },
});

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);