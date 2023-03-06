import mongoose from 'mongoose';
import { config } from '../config.js';
const { user, password, cluster, name } = config;

export const dbConnect = (env?: string) => {
  // Opción presentada por el profesor
  // const finalEnv = env || process.env.NODE_ENV;
  // const finalDBName = finalEnv === 'test' ? name + '_Testing' : name;
  const uri = `mongodb+srv://${user}:${password}@${cluster}/${name}?retryWrites=true&w=majority`;
  return mongoose.connect(uri);
};
