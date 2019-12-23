const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const port = 9002
const app = express();
app.use(bodyParser.json());

let services = [
    {id: 1 , name: "Service1", location : {x:0, y:0}},
    {id: 2 , name: "Service2", location : {x:100, y:100}}
]

app.get('/services', (req, res) => {
    res.send(services);
});

app.get('/services/**', (req, res) => {
    const serviceID = parseInt(req.params[0]);
    const foundService = services.find(subject => subject.id === serviceID);
    if(foundService){
        res.send(foundService);
    }
    else{
        res.status(404);
    }
});

app.post('/add_service', (req, res) => {
    const newService = req.body.service;
    services.push(newService);
    res.send("Added service");
});

console.log(`Services microservice listening on port ${port}`);
app.listen(port);