require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const users = [
  { name: 'Alice Student', email: 'alice@student.com', password: 'password123', role: 'Student' },
  { name: 'Bob Maintenance', email: 'bob@maintenance.com', password: 'password123', role: 'Maintenance' },
  { name: 'Carol Admin', email: 'carol@admin.com', password: 'password123', role: 'Admin' }
];

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    await User.deleteMany({});
    await User.insertMany(users);
    console.log('Demo users seeded');
    process.exit();
  })
  .catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
  }); 