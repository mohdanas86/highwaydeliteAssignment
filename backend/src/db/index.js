import mongoose from 'mongoose';
import { DATABASE_NAME } from '../constants.js';

const databaseconnection = async () => {
  try {
    const uri = `${process.env.MONGO_URL}/${DATABASE_NAME}`;

    const connection = await mongoose.connect(uri);
    console.log('Database connected successfully:', connection.connection.host);
  } catch (err) {
    console.log('Error while connecting to the database', err);
    throw err;
  }
};

export default databaseconnection;
