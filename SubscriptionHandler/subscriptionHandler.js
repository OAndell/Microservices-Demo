const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const port = 9003;
const app = express();
app.use(bodyParser.json());

let subscriptions = [
    {
        userID: 1 , 
        services : [{id:1}]
    }
]

app.get('/subscriptions', (req, res) => {
    res.send(subscriptions);
});

app.get('/subscriptions/**', (req, res) => {
    const userID = parseInt(req.params[0]);
    const foundUserSub = subscriptions.find(subject => subject.id === userID);
    if(foundUserSub){
        res.send(foundUserSub);
    }
    else{
        res.status(404);
    }
});

app.post('/subscripe', (req, res) => {
    const userID = req.body.userID;
    const serviceID = req.body.serviceID;
});

app.get('/check_proximity/**', (req, res) => {
    const userID = parseInt(req.params[0]);
    const foundUserSub = subscriptions.find(subject => subject.id === userID);
    if(foundUserSub){
        //TODO
        res.send(foundUserSub);
    }
    else{
        res.status(404);  
    }

});

app.listen(port);