const admin = require('firebase-admin');
const fs = require('fs');
const serviceAccount = require('./serviceAccountKey.json');

const collectionName = 'assistants';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://swcbba-wome.firebaseio.com'
});

const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

let assistants = [];

let results = db
  .collection(collectionName)
  .get()
  .then(snapshot => {
    snapshot.forEach(doc => {
      const assistant = doc.data();
      if (!assistant.deleteFlag) {
        assistants.push(doc.data());
      }
    });
    return assistants;
  })
  .catch(error => {
    console.log(error);
  });

results.then(dt => {
  fs.writeFile('assistants.json', JSON.stringify(assistants), function(err) {
    if (err) {
      return console.log(err);
    }
    console.log('The file was saved!');
  });
});
