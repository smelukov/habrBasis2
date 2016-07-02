let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let cities = require('./list.json');

app.use(bodyParser.json());

app.get('/cities', (req, res) => {
  res.json(cities);
});

app.post('/cities', (req, res) => {
  cities = req.body.items;
  console.log('saved', cities);
  res.json({});
});

app.listen(9000, () => console.log('server started'));
