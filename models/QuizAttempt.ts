import mongoose from 'mongoose';

const QuizAttemptSchema = new mongoose.Schema({
  clerkId: { type: String, required: true },
  date: { type: Date, required: true },
  score: { type: Number, required: true },
});

export default mongoose.models.QuizAttempt || mongoose.model('QuizAttempt', QuizAttemptSchema);