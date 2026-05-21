import app from './app';
import { connectDB } from './utils/db';


const start = async() => {
  
  await connectDB();
  
  app.listen(4200, ()=>{
    console.log('Your Server is up and running on port, 4200');
  })
}

start();



