import createDebug from 'debug';
import http from 'http';
import { app } from './app';
import { dbConnect } from './db/connect.db';

const debug = createDebug('W7-CH5:index');

const PORT = process.env.PORT || 4500;

const server = http.createServer(app);

dbConnect()
  .then((mongoose) => {
    server.listen(PORT);
    debug('DB: ', mongoose.connection.db.databaseName);
  })
  .catch((error) => server.emit('error', error));
server.on('error', (error) => {
  debug('Server error', error.message);
});
server.on('listening', () => {
  debug('Listening in http://localhost:' + PORT);
});
