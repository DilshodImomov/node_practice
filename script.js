import express, { response } from 'express';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcrypt';

const app = express();
app.use(express.json());
app.use(cors());

const db = knex({
    client: 'pg',
    connection: {
      host : 'dpg-cl1v19jmgg9c73e9nsug-a',
      port : 5432,
      user : 'dilshod',
      password : 'XyzCN32n9undOUhLkU3yNjVJkmLRnH02',
      database : 'react_practice_db'
    }
  });
const PORT = process.env.PORT || 3000;

 db.select('*').from('users').then(data => {
    console.log(data);
 }).catch(err => {
    console.log("error", err);
 })  

const database = {
    users: [
        {
            id: "1",
            name: 'Dilshod',
            email: 'dilshod@gmail.com',
            entries: 0,
            password: '123',
            joined: new Date()
        },
        {
            id: "2",
            name: 'Sulton',
            email: 'sulton@gmail.com',
            entries: 0,
            password: '456',
            joined: new Date()
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users);
});

app.post('/signin', (req, res) => {
    const {email, password} = req.body;
    // if ( req.body.email === database.users[0].email && req.body.password === database.users[0].password ) {
    //     res.json(database.users[0]);
    // }
    // else {
    //     res.json("Something went wrong!");
    // }
    db.select('*').from('users').where({email}).then(user => {
         if ( user.length ) {
            if ( bcrypt.compareSync(password, user[0].passwordhash) ) {
                res.json(user[0]);
            }
            else {
                res.json("Wrong credentials!");
            }
        }
        else {
            res.json("Wrong credentials!");
        }
    }).catch( err => {
        res.status(400).json("Something went wrong!" + err);
    });
});

app.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    const passwordHash = bcrypt.hashSync(password, 10);
    console.log(name, email, password);
    db('users').returning('*')
    .insert({
        name: name,
        email: email,
        joined: new Date(),
        passwordhash: passwordHash
    }).then(user => {
        res.json(user[0]);
    }).catch( err => {
        res.status(400).json("Unable to connect");
    } );
});

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    db.select("*").from('users').where({id})
    .then(user => {
        if ( user.length ) {
            res.json(user[0]);
        }
        else {
            res.status(400).json("User not found!");
        }
    })
});

app.put('/image', (req, res) => {
    const id = req.body.id;
    db('users').where({id}).increment('entries', 1).returning('entries')
    .then(entry => {
        res.json(entry[0].entries);
    }).catch(err => {
        res.status(400).json("Something went wrong!");
    })
})

app.listen(PORT, () => {
    console.log("Server started!");
})
