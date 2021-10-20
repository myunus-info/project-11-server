// Imports
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const dotenv = require('dotenv');
const PORT = process.env.PORT || 5000;

// Initialize application
const app = express();
dotenv.config();
const { DB_NAME, DB_COLLECTION, DB_USER, DB_PASS } = process.env;

// Parse request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Database connection
const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.ckmix.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect(err => {
  if (err) return console.log(err.message);

  const bookingCollection = client.db(DB_NAME).collection(DB_COLLECTION);
  const reviewsCollection = client.db(DB_NAME).collection('reviews');
  const adminCollection = client.db(DB_NAME).collection('admins');
  const ordersCollection = client.db(DB_NAME).collection('orders');
  // Add service
  app.post('/addService', (req, res) => {
    const booking = req.body;
    bookingCollection.insertOne(booking).then(result => {
      res.send(result.insertedId);
    });
  });

  // Test
  app.get('/', (req, res) => {
    res.send('Hello world!');
  });

  // Get services
  app.get('/services', (req, res) => {
    bookingCollection.find({}).toArray((err, services) => {
      res.send(services);
    });
  });

  // Add review
  app.post('/addReview', (req, res) => {
    const review = req.body;
    reviewsCollection.insertOne(review).then(result => {
      res.send(result.insertedId);
    });
  });

  // Get reviews
  app.get('/reviews', (req, res) => {
    reviewsCollection.find({}).toArray((err, reviews) => {
      res.send(reviews);
    });
  });

  // make Admin
  app.post('/makeAdmin', (req, res) => {
    const admin = req.body;
    adminCollection.insertOne(admin).then(result => {
      res.send(result.insertedId);
    });
  });

  // Is admin
  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email }).toArray((err, admins) => {
      res.send(admins.length > 0);
    });
  });

  // Read booking by Id
  app.get('/book/:id', (req, res) => {
    bookingCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, docs) => {
        res.send(docs[0]);
      });
  });

  // Post a booking
  app.post('/addBooking', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order).then(result => {
      res.send(result.insertedId);
    });
  });

  // Get the orders
  app.get('/bookings', (req, res) => {
    ordersCollection.find({}).toArray((err, docs) => {
      res.send(docs);
    });
  });

  // Delete booking
  app.delete('/booking/:id', (req, res) => {
    ordersCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0);
      });
  });

  // Get orders
  app.get('/orders', (req, res) => {
    ordersCollection.find({}).toArray((err, docs) => {
      res.send(docs);
    });
  });

  // Get bookings list
  app.get('/bookingsList', (req, res) => {
    bookingCollection.find({}).toArray((err, docs) => {
      res.send(docs);
    });
  });
});

// Listen to port
app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});
