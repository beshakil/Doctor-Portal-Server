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
    "project_id": "classic-it-3bd50",
    "private_key_id": "a5404dcd518707c5b4cef0d4d10044f908f3d3a6",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDgKYnfaBVuhau7\nZYNMhGwo3XdnNRZi6YA3L/iE3FZgMikVVO7vhX8ECsmKPE5o6NJeIu9O0UtNsvwG\nkc8lyJ5dsYv28SsPIwVYLm0ozurq0Ju7OiqvkeZx6ZgdidjZ7jkzgI7gdiAwldVk\nMzA9Vf0B5q8AdcM8XHF5Xup1bes8rrozsCOMLxVRXLjK6TP4IIn/E2Ri/6zSSm4M\n3AOy1bhxTGbujbwIXIKdDzyjI+AfT+JZdyxgULJ+53ZboFJ3X8SUsDSA3W2qNHlX\n8wGnJq+mtg/B9crHycbQzrc/imLKOWD6ZsHI6XYBkLrH0TtEKFTIzrUXtOOob708\nvghlNLjPAgMBAAECggEAT8do2tqD2ih3xMOttaNhjS+46cHynDRnXfzUMZDrquPf\nTEjEmvmDiZA/R1QMQfkuubMsQXxqlRYw7TOiqltaxZTFcBdIEGSR597qGb5+zCB/\ndGSQwZinD/6nlUe0pmdK82H7N7bC4RfKcRVow0OhvrX3ra271PU/q4cU4cNDl/4b\nF4GHNeSSLiq/ND2mN+ghz+cvAlVlr8j8LV8hlflZcnSelT63HwnK9o8nj9Ql3/St\nJGqUoYRHPhcRS2mZfR0atLHR4KLOFrkC/avYqY2NhFGCJNMd2YHH1KCQ8rkQYdfO\ndEeGIlq7cRNs7V8E35upk4QjgIqWW7KiT8rxG1cfcQKBgQD04Gtm6JAeZ7JBhPUU\nJ91nqreej88aaG6GgB8uhN2P2xQ1008kxS7x/zzkg2qk0A06o5oSqlb+oTOoLiIc\nbtrC7oUWl6tbVuAsj4j4za1ljD333IPKxzMZJtP6i2q+yH35ixuB9fuLQfO/XTZk\no3v4P60EpDmtCfGocUJHyjum3wKBgQDqWD03Wj7/qcW21qbeGiKSl8gTRiNXNCdR\ncZpD/k8A81uJy84w/qAcj/J9ijTUuw0Pbbw0wlRUpK+w2H5nez8ON+V+ECElD35c\njBrrPQ2KmOslM1SnpcI7NMRO8dE1PgCc4SCgZ6k04prWGgc2z44a8ZFBgJ+jDgP3\nfxAo6gncEQKBgQCrJR5rcicn2Pmw6SgQyjvn9F0ZKRFqN4rn3ivs61ee71MUu3cZ\nD+dbozP/0gl63x4f2bAZU4wxsqDT7kpQ7PlgPCwwOhi9Yd6Txk3I9pc13eqBjVFf\nLBH+hjCpbz9Pz/ibrCmxjyYbkiC1ooQdmlVOj9Jw6AaXdde8DkxwuFswqQKBgQCa\nWQXw2DrYL1yu4VBExxfwT5ISx8ZtIEepR9agY/ZrHN40swyajoqsZU8EyqujVZPz\njoZAhaH/ofyp0N3okG9mkQBReJQsEblbgVgVij/KApAWD2n5hZ6ZWlbV3EW7+Jt0\nuH7Bx6TV1U7AJ6KKwkfJjUPrzajXP1rzfzgIiqV10QKBgQDk4zgsxzkjrDOTK5cW\nVznaVaXU85rBFX3/MSmlSXYZ5I0Dx+gMcVSPwq/odn6cnR0AQaJyWN0apJV/Mt50\nICtlQTq5VWjsSLJuxQIUYpeknT12YtgrAKdhiYRsXL6pdfG2+PunK02uuVnJ2vg4\nDPOLYryqt6rVc14CJAuItAsyCg==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-6l7ko@classic-it-3bd50.iam.gserviceaccount.com",
    "client_id": "107936041290949552001",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-6l7ko%40classic-it-3bd50.iam.gserviceaccount.com"
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
