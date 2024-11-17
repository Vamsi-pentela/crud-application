const express = require('express');
const path = require('path');
const usermodel = require('./db/mongo.js'); 
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render("index");
});

app.post('/submit', async (req, res) => {
  const { name, email, imageurl } = req.body;

  try {
    const existingUser = await usermodel.findOne({ email });
    if (!existingUser) {
      await usermodel.create({ name, email, imageurl });
      res.redirect('/over');
    } else {
      res.status(400).send('User already exists');
    }
  } catch (error) {
    res.status(500).send("An error occurred");
  }
});

app.get('/over', async (req, res) => {
  try {
    const users = await usermodel.find(); 
    res.render("user", { users });
  } catch (error) {
    res.status(500).send("An error occurred while fetching user data.");
  }
});

app.get('/delete/:id', async (req, res) => {
  try {
    await usermodel.findByIdAndDelete(req.params.id);
    res.redirect('/over');  
  } catch (error) {
    res.status(500).send("An error occurred while deleting the user.");
  }
});

app.get('/edit/:id', async (req, res) => {
  try {
    const user = await usermodel.findById(req.params.id);
    if (user) {
      res.render("update", { user });
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).send("An error occurred while fetching user data.");
  }
});

app.post('/update/:id', async (req, res) => {
  const { name, email, imageurl } = req.body;
  try {
    await usermodel.findByIdAndUpdate(req.params.id, { name, email, imageurl });
    res.redirect('/over');
  } catch (error) {
    res.status(500).send("An error occurred while updating user data.");
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000...');
});
