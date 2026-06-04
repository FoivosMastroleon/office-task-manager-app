import app from './app';
import { connectDB } from './utils/db';


const start = async() => {
  
  await connectDB();
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Your Server is up and running on port ${PORT}`);
  })
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});



