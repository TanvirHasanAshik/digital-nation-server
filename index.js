const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hooq3.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const businessesCollection = client.db(process.env.DB_NAME).collection("businesses");
  const userRecommendedCollection = client.db(process.env.DB_NAME).collection("userRecommended");
  const messageCollection = client.db(process.env.DB_NAME).collection("message");
  const blogCollection = client.db(process.env.DB_NAME).collection("blog");

  app.post('/businesses', (req, res) => {
    businessesCollection.insertOne(req.body)
    .then(result => {
        res.send(result.insertCounted > 0)
    })
  })
  app.get('/businessData', (req, res) => {
    businessesCollection.find({})
    .toArray((err, docs) => {
      res.send(docs)
    })
  })

  app.get('/businessRecommended/:id', (req, res)=>{
    const id = req.params.id;
    businessesCollection.find({_id:ObjectId(id)})
    .toArray((err, docs) => {
      res.send(docs[0]);
    })
  });

  app.post('/recommendedBusinessData', (req, res) => {
    userRecommendedCollection.insertOne(req.body)
    .then(result => {
      res.send(result.insertCounted > 0)
    })
  });

  app.get('/recommendedBusinessData', (req, res) => {
    userRecommendedCollection.find({})
    .toArray((err, docs) =>{
      res.send(docs);
    })
  });

  app.post('/clientMessage', (req, res) =>{
    messageCollection.insertOne(req.body)
    .then(result =>{
      res.send(result.insertCounted > 0);
    })
  });

  app.get('/getClientMessage', (req, res) =>{
    messageCollection.find({})
    .toArray((err, docs) => {
      res.send(docs);
    })
  });

  app.delete('/deleteMessage/:id', (req, res) =>{
    const id = req.params.id;
    messageCollection.deleteOne({_id: ObjectId(id)})
    .then(result => {
      res.send(result);
    })
  });

  app.post('/blog', (req, res)=>{
    blogCollection.insertOne(req.body)
    .then(result => {
      res.send(result.insertCounted > 0);
    })
  });

  app.get('/blogData', (req, res)=>{
    blogCollection.find({})
    .toArray((err, docs) => {
      res.send(docs);
    })
  });

  
});


app.get('/', function (req, res) {
  res.send('Digital Nation Is Working Working')
})

app.listen(process.env.PORT || 5000);
