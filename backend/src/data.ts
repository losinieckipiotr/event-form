import { MongoClient } from 'mongodb';

export function insertOne(firstName : string, lastName: string, email: string, date: Date) {
  const url = process.env.DB_URL;
  if (url === undefined) {
    throw new Error('Missing DB URL');
  }

  return MongoClient.connect(url, { useUnifiedTopology: true })
  .then((client) => {
    // create databse
    const db = client.db("test");

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
  }).catch((error: any) => {
    console.error('Unable to connect to database', error);
  });
}
