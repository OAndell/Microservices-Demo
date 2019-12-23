const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const request = require("request");

const USER_REGISTRY_BASE_URL = "http://user_registry:9001/";
const FETCH_USER_ENDPOINT = USER_REGISTRY_BASE_URL + "users/";

const SERVICE_REGISTRY_BASE_URL = "http://service_registry:9002/";
const FETCH_SERVICE_ENDPOINT = SERVICE_REGISTRY_BASE_URL + "services/";

const port = 9003;
const app = express();
app.use(bodyParser.json());

let subscriptions = [
  {
    userID: 1,
    services: [{ id: 1 }]
  }
];

app.get("/", (req, res) => {
  res.send("Subscription Handler");
});

app.get("/subscriptions", (req, res) => {
  res.send(subscriptions);
});

app.get("/subscriptions/**", (req, res) => {
  const userID = parseInt(req.params[0]);
  const foundUserSub = subscriptions.find(
    (subject) => subject.userID === userID
  );
  if (foundUserSub) {
    res.send(foundUserSub);
  } else {
    res.send("Not Found").status(404);
  }
});

app.post("/subscribe", (req, res) => {
  const userID = req.body.userID;
  const serviceID = req.body.serviceID;
  const foundUserSub = subscriptions.find(
    (subject) => subject.userID === userID
  );
  if(foundUserSub){
    foundUserSub.services.push(serviceID);
  }else{
    subscriptions.push({
        userID : userID, 
        services : [
            {id: serviceID}
        ]
    });
  }
  res.send({Message: "Subscribed to service " + serviceID});

});

app.get("/check_proximity/**", (req, res) => {
  const userID = parseInt(req.params[0]);
  const foundUserSub = subscriptions.find(
    (subject) => subject.userID === userID
  );

  if (foundUserSub) {
    request.get(
      {
        headers: { "content-type": "application/json" },
        url: FETCH_USER_ENDPOINT + userID
      },
      (err, res2) => {
        if (!err) {
          userLocation = JSON.parse(res2.body).location;
          check_proximity(res, foundUserSub.services, userLocation)
        } else {
          res.status(400).send({ problem: "Error fetching user" });
        }
      }
    );
  } else {
    res.send("User not Found").status(404);
  }
});

async function check_proximity(res, services, userLocation) {
  var promiseArray = [];
  services.forEach((service) => {
    promiseArray.push(
      new Promise((resolve, reject) => {
        request.get(
          {
            headers: { "content-type": "application/json" },
            url: FETCH_SERVICE_ENDPOINT + service.id
          },
          (err, res3) => {
            if (!err) {
              serviceInfo = JSON.parse(res3.body);
              serviceLocation = serviceInfo.location;
              proximity = Math.hypot(
                serviceLocation.x - userLocation.x,
                serviceLocation.y - userLocation.y
              );
              resolve({ proximity: proximity, "name ": serviceInfo.name });
            } else {
              reject(err);
            }
          }
        );
      })
    );
  });
  res.send(await Promise.all(promiseArray));
}

console.log(`SubscriptionHandler microservice listening on port ${port}`);
app.listen(port);
