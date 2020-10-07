const MongoClient = require('mongodb').MongoClient;

// NOT SAFE
const pwd = '123456789';

// Connection URL
const url = `mongodb://superuser:${pwd}@localhost:27017/admin`;

function insertOne(firstName, lastName, email, date) {
  return MongoClient.connect(url, { useUnifiedTopology: true })
  .then((client) => {
    // create databse
    const db = client.db("test");

    console.log('inserting');
    console.log({firstName, lastName, email, date});

    // insert into `forms` collection
    return db.collection('forms').insertOne({
      firstName,
      lastName,
      email,
      date,
    }).then((result) => {
      console.log('Inserted %s', result.insertedCount);
    }).finally(() => {
      client.close();
    });
  }).catch((error) => {
    console.error('Unable to connect to database', error);
  });
}

module.exports = {
  insertOne,
};
