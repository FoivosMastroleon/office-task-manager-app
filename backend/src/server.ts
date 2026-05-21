import app from './app';
import { connectDB } from './utils/db';


const start = async() => {
  
  await connectDB();
  
  app.listen(5000, ()=>{
    console.log('Your Server is up and running on port, 5000');
  })
}

start();



