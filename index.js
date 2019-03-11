const app = require('./src/app');

app.listen(app.get('port'), () => {
  console.log(
    `GiftDibs URL Scraper is listening on http://localhost:${app.get('port')}`
  );
});

// The `app` is referenced in firebase.json `rewrites`.
const functions = require('firebase-functions');
exports.app = functions
  .runWith({
    memory: '2GB',
    timeoutSeconds: 300
  })
  .https.onRequest(app);
