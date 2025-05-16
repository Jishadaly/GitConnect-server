import app from './app';
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URI || '')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log('Server running')
    );
  })
  .catch((err) => console.error('DB connection error:', err));
