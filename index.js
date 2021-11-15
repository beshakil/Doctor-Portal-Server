const express = require('express');
const app = express()
const cors = require('cors');
const admin = require("firebase-admin");
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const stripe = require('stripe')(process.env.STRIPE_SECRET)
const fileUpload = require('express-fileupload')



//firebase-token-key.json

// DB_USER=doctors-portal
// DB_PASS=JJ3YvpB7S78UOcFC

//const serviceAccount = require("./firebase-token-key.json");
const serviceAccount = {
    "type": "service_account",
    "project_id": "classic-doctor-portal",
    "private_key_id": "50cf272bf79b9a28843478e94270fa3059c1c1a9",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDJtEgJpSU4g5lE\nqaDsJJL2UKLZuXe/gkVVuIrtLDkQlyB7GIBXa9auMULiGw4B5MqX0DYRjyH3tbnT\nkKERHU2a5U1a6h/i+h5jVkEdv9XCfn56ou/MsYE2vMAyPNv5JlVZBqBUTjbcqnQ3\nu6DyFoO+BnS71eFFS6rI5jApBGgUy8DRuOwI0xP/rFhx1e/TSt82IGAN96qZnT7D\nEcrrmBd225kvruqToshdnNneQEGHS553p/r1Ws5b03vWzcRe7Wvv2q6F/iNrnNiP\nIdsJ4NeIH9JPJjbR4+AomK3xr3FYjzYFksNUjE3d0ykJnYgmM+VlOxDx9pboA2N9\nQ9eQl0UTAgMBAAECggEAWBnkKz5UiyJEBG85KFvzSx4+e24cxWvvv/jqyZx60mnI\nWKwDhuvF6fD/X0Zk8GPQL85Uh4fm1M0t/SBbkd+kQYdtqcvAoMISGt6Wc5mSkzDw\nKr3XkydnIpMAOhFGHcXmGowf5KMDKJBVUfCk5Ij8AzjLrS3HBx79WmHc4FWZ5pav\nxRsneoBj9nBxcVGRxYDhU/qG5TBtg1WDbneIWEIl/UgCzZS6mJiuJu02c74QTCXr\nM24Z+f5UqfKkD4eGyXlYbs+JfyiSq25PsHAVXKHSLhDWBnRUZ3o9fWDimjwR6wuz\nYo/sPCpwLpnpsSxUIh35n/tkuW9E3RrV5XjxBTYQbQKBgQDznJEzEKcNqFfGmCaO\nQxIJNgXJTNN8bTmkV4l5i0qh61O7pC/AHzi4Ee6OtUsRIAQhQI2Hd+qSeRvMj9/r\nxPGmOTGpdEdQM5NxvIyaaPxnVZeQkB59KVY23mX93Z/1OT/zbv2ib6x1U6GShZyQ\nV9wli9yJQms5cWt0uz7n72e6PQKBgQDT9iW8hdzdjsmGGxFbLWd2ULM9Ru1FxZaT\njCcWAmsRRX0SA1skPISCtTlHbTl+9R+ZkhQaNd5ji7CSBK2Rw23R2Q450E7wewiw\nicL3fpuADxc4UnQe/DSiHc5B2phgCRkyA6wAkYlr3Pu+WOp1wsKxaS/pkt0v5RsS\n6p0EgFwBjwKBgQC/ApIu0e3KHabFRmNkxF4N7tfWoHBqbVH289QNAxR/pP7Ab9oo\n79IPMbA1IR08zjeuwui1wWahdmg/msfeG0vGI642yb9ouSfw1AACyjKt60StyvK8\n/H5nAzZBOVbEdiEYhHxGsv0r+WkEc9LwspMgtWs0DGn6Xl385xxJy0MvmQKBgHPM\nWjlweIWiaH6Xcxf46jk9RW8IvMANfoIFY6UmlQ/OgtHAe56EYXB3SV+4UF0H1ce0\ngr7/BwwjWMetPpYPyoOGrbrwDvBahxjLanSD+rgvhmQCx+XVq3uWBQT9Q5nT3qvw\nTZvR5t3C0NXhBdZoHK2H5eEZlzV/WRcwja/T4HAJAoGBAIeQh5TAl32Fh5jAUce2\ngD4hIfVpJo/+qLtnoUDEWk0k4Rn+Rkp3dM5F5n3cdHCat2+VpMCTLs9+Zm/XflUZ\nXS7Vpzn2BSaYNxfc12t4DDA5kgHcSly/fKW0EuYVtXsunxxsahPvMCf6kQjFamly\npo6d3ntuIo0Q6IMFvf4D980a\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-5iqcd@classic-doctor-portal.iam.gserviceaccount.com",
    "client_id": "110554634198588906073",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-5iqcd%40classic-doctor-portal.iam.gserviceaccount.com"
}

//const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

app.use(cors());
app.use(express.json());
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jd8bl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function verifyToken(req, res, next) {
    if (req.headers?.authorization?.startsWith('Bearer ')) {
        const token = req.headers.authorization.split(' ')[1];

        try {
            const decodedUser = await admin.auth().verifyIdToken(token);
            req.decodedEmail = decodedUser.email;
        }
        catch {

        }

    }
    next();
}



async function run() {
    try {
        await client.connect();
        const database = client.db("doctors_portal");
        const appointmentsCollection = database.collection("appointments");
        const usersCollection = database.collection("users");
        const doctorsCollection = database.collection("doctors");

        //GET API
        app.get('/appointments', verifyToken, async (req, res) => {
            const email = req.query.email;
            const date = req.query.date;
            const query = { email: email, date: date }
            const cursor = appointmentsCollection.find(query)
            const appointments = await cursor.toArray()
            res.json(appointments);
        })

        app.get('/appointments/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await appointmentsCollection.findOne(query);
            res.json(result);
        });

        // POST API Add A Appointments
        app.post('/appointments', async (req, res) => {
            const appointment = req.body;
            const result = await appointmentsCollection.insertOne(appointment);
            res.json(result);
        });

        app.put('/appointments/:id', async (req, res) => {
            const id = req.params.id;
            const payment = req.body;
            const filter = { _id: ObjectId(id) }
            const updateDoc = {
                $set: {
                    payment: payment
                }
            }
            const result = await appointmentsCollection.updateOne(filter, updateDoc);
            res.json(result);
        });


        app.get('/doctors', async (req, res) => {
            const cursor = doctorsCollection.find({})
            const doctors = await cursor.toArray();
            res.json(doctors)
        });

        app.post('/doctors', async (req, res) => {
            const name = req.body.name;
            const email = req.body.email;
            const pic = req.files.image;
            const picData = pic.data;
            const encodedPic = picData.toString('base64');
            const imageBuffer = Buffer.from(encodedPic, 'base64');
            const doctor = {
                name,
                email,
                image: imageBuffer
            }
            const result = await doctorsCollection.insertOne(doctor);
            res.json(result);
        });



        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query);
            let isAdmin = false;

            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        });



        // POST API Add A User
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });


        // POST API Add A User
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user }
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        app.put('/users/admin', verifyToken, async (req, res) => {
            const user = req.body;
            const requester = req.decodedEmail;
            if (requester) {
                const requesterAccount = await usersCollection.findOne({ email: requester });
                if (requesterAccount.role === 'admin') {
                    const filter = { email: user.email };
                    const updateDoc = { $set: { role: 'admin' } };
                    const result = await usersCollection.updateOne(filter, updateDoc);
                    res.json(result);
                }
            }
            else {
                res.status(403).json({ message: 'you do not have access to make admin' })
            }

        })


        app.post("/create-payment-intent", async (req, res) => {
            const paymentInfo = req.body;
            const amount = paymentInfo.price * 100
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'usd',
                payment_method_types: ['card']
            });
            res.json({
                clientSecret: paymentIntent.client_secret,
            });
        })
    }
    finally {
        //await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Doctor Portal')
})

app.listen(port, () => {
    console.log('runtime', port)
})



// app.get('/users')
// app.post('/users')
// app.get('/users/:id')
// app.put('/users/:id')
// app.delete('/users/:id')
// users:get
// users: post
