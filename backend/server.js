const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // load env variables

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allow both localhost (dev) and Vercel (prod)
app.use(cors({
  origin: [
    'http://localhost:5173',   // React dev server
    'https://study-cards-manager.vercel.app' // deployed frontend
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Flashcard schema & model
const flashcardSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  known: { type: Boolean, default: false },
});

const Flashcard = mongoose.model("Flashcard", flashcardSchema);

// ✅ Create flashcard
app.post('/flashcard', async (req, res) => {
  try {
    const card = await Flashcard.create(req.body);
    res.status(201).json(card);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get all flashcards
app.get('/flashcard', async (req, res) => {
  try {
    const cards = await Flashcard.find();
    res.json(cards);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Update flashcard
app.put('/flashcard/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCard = await Flashcard.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedCard);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Delete flashcard
app.delete('/flashcard/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Flashcard.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
