const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const pwd = '123456789';

// Connection URL
const url = `mongodb://superuser:${pwd}@localhost:27017/admin`;

// Use connect method to connect to the Server
MongoClient.connect(url, { useUnifiedTopology: true }, function(err, client) {
  const db = client.db("test");

  function insertOne() {
    db.collection('inventory').insertOne({
      item: "canvas",
      qty: 100,
      tags: ["cotton"],
      size: { h: 28, w: 35.5, uom: "cm" }
    })
    .then(function(result) {
      console.log('result', result.result);
      client.close();
    });
  }

  function iterate() {
    var cursor = db.collection('inventory').find({
    });

    function iterateFunc(doc) {
      console.log('iterateFunc');
      console.log(JSON.stringify(doc, null, 4));
    }

    function errorFunc(error) {
        console.log('errorFunc');
        console.log(error);
        client.close();
    }

    cursor.forEach(iterateFunc, errorFunc);
  }

  function importData() {
    db.collection('inventory').insertMany([
      { item: "journal",
        qty: 25,
        size: { h: 14, w: 21, uom: "cm" },
        status: "A"},
      { item: "notebook",
        qty: 50,
        size: { h: 8.5, w: 11, uom: "in" },
        status: "A"},
      { item: "paper",
        qty: 100,
        size: { h: 8.5, w: 11, uom: "in" },
        status: "D"},
      { item: "planner",
        qty: 75, size: { h: 22.85, w: 30, uom: "cm" },
        status: "D"},
      { item: "postcard",
        qty: 45,
        size: { h: 10, w: 15.25, uom: "cm" },
        status: "A"}
    ])
    .then(function(result) {
      console.log(result.result);
      client.close();
    });
  }

  function modify() {
    db.collection('inventory').updateMany(
      { qty: { $lt: 50 } },
      { $set: { "size.uom": "in", status: "P" },
        $currentDate: { lastModified: true } })
    .then(function(result) {
      console.log(result.result);
      iterate();
    });
  }

  function deleteSome() {
    db.collection('inventory').deleteMany({
      status: "A"
    })
    .then(function(result) {
      console.log(result.result);
      iterate();
    })
  }

  deleteSome();

  // modify();

  // iterate();

  // importData();

  // client.close();
});
