const mongoose = require('mongoose');
const dotenv = require('dotenv');

// HANDLING UNCAUGHT EXCEMPTION
process.on('uncaughtException', (err) => {
  console.log(err.name, 'uncaught exemption');

  // EXITING APPLICATION
  process.exit(1);
});

dotenv.config({
  path: './config.env',
});

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASWORD
);

mongoose.connect(DB, {}).then((con) => {
  console.log('DB connection successful');
});

const port = process.env.PORT || 7000;

const server = app.listen(port, () => {
  console.log('App running on port ' + port);
});

// HANDLING UNHANDLED REJECTION AND SHUT DOWN APPLICATION
process.on('unhandledRejection', (err) => {
  console.log(err);

  // EXITING APPLICATION
  server.close(() => {
    process.exit(1);
  });
});


process.on('SIGTERM',()=>{
  server.close(()=>{
    
  })
})