const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const port = 9001;
const app = express();
app.use(bodyParser.json());

let users = [
    {
        id: 1, location: {
        "x": 100,
        "y": 100
      }
    }
]

app.get('/users', (req, res) => {
    res.send(users);
});

app.get('/users/**', (req, res) => {
    const userID = parseInt(req.params[0]);
    const foundUser = users.find(subject => subject.id === userID);
    if(foundUser){
        res.send(foundUser);
    }
    else{
        res.status(404);
    }
});


console.log(`UserResgisty microservice listening on port ${port}`);
app.listen(port);