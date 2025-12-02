const { greet } = require('./src/hello');

const port = process.env.PORT || 3000;

console.log('Starting tiny app...');
console.log(greet('World'));

// keep process alive for a short while so Jenkins console shows activity
setTimeout(() => {
  console.log('App run complete - exiting.');
  process.exit(0);
}, 2000);
