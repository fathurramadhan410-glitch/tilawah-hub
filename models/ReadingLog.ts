import mongoose from 'mongoose';

const ReadingLogSchema = new mongoose.Schema({
  clerkId: { type: String, required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Target', default: null },
  date: { type: Date, default: Date.now },
  startPage: { type: Number, required: true },
  endPage: { type: Number, required: true },
  pagesRead: { type: Number, required: true },
  juz: { type: Number, required: true },
});

export default mongoose.models.ReadingLog || mongoose.model('ReadingLog', ReadingLogSchema);