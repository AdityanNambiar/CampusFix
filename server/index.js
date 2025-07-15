require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');
const reportRoutes = require('./routes/reports');
const { startEscalationCron } = require('./cron/escalate');

app.use('/auth', authRoutes);
app.use('/complaints', complaintRoutes);
app.use('/reports', reportRoutes);

app.get('/', (req, res) => {
  res.send('CampusFix API Running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
startEscalationCron(); 