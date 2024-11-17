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
    const newUser = await usermodel.create({ name, email, imageurl });
    res.redirect('/over');
  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).send("An error occurred; you have entered the wrong number.");
  }
});



app.get('/over', async (req, res) => {
  try {
    const users = await usermodel.find(); 
    res.render("user", { users });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("An error occurred while fetching user data.");
  }
});



app.get('/delete/:id', async (req, res) => {
  try {
    await usermodel.findOneAndDelete({ _id: req.params.id });
    res.redirect('/over');  
  } catch (error) {
    console.error("Error deleting user:", error);
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
    console.error("Error fetching user data:", error);
    res.status(500).send("An error occurred while fetching user data.");
  }
});



app.post('/update/:id', async (req, res) => {
  const { name, email, imageurl } = req.body;
  try {
    await usermodel.findByIdAndUpdate(req.params.id, { name, email, imageurl });
    res.redirect('/over');
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).send("An error occurred while updating user data.");
  }
});



app.listen(5000, () => {
  console.log('Server running on port 5000...');
});
