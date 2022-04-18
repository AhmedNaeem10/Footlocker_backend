const express = require('express')
const formController = require('./controllers/formController')
const orderController = require('./controllers/orderController')
const userController = require('./controllers/userController')

const app = express();

app.use(express.json());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "http://localhost:3000");
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});

app.use(express.urlencoded({ extended: false }));

app.listen(4000, () => {
    console.log("Listening on port 4000...")
})

app.get('/', (req, res)=>{
    res.send("nonsense")
});

app.get('/user/:username', userController.getUser);

app.post('/signin', formController.signin);
app.post('/signup', formController.signup);
app.post('/place', orderController.place)

app.put('/shipping/:username', userController.shipping);
app.put('/card/:username', userController.card);