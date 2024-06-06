const express = require('express')
const app = express();

const client = require('./redis-server.js')

require('dotenv').config();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const users = [
    {
        id: 1,
        name: 'John',
        age: 30
    },
    {
        id: 2,
        name: 'Jane',
        age: 25
    },
    {
        id: 3,
        name: 'Bob',
        age: 40
    }
]

app.get('/', async (req, res) => {
    const data = await client.get(`users`);
    
    if (data) {
        console.log('Data from Redis');
        return res.status(200).send({
          status: true,
          message: "Data from redis",
          data: JSON.parse(data),
        });
      } else{
        client.setEx(`users`, 30, JSON.stringify(users));

        return res.status(200).send({
          status: true,
          message: "Received data from server",
          data: users,
        });
      }
})

app.listen(process.env.PORT, () => console.log('App running on port ', process.env.PORT))