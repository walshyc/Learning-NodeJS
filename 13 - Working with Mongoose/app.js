const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views'); //sets where the HTMl templates are contained, not required if using views folder

app.use((req, res, next) => {
    User.findById("5daf237607f3831f1484ae36")
        .then(user => {
            req.user = user4;
            next();
        })
        .catch(err => console.log(err));
});

const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);



mongoose
    .connect('mongodb+srv://conorw:zP5o2576NSCVhxvt@cluster0-srq59.mongodb.net/shop?retryWrites=true&w=majority')
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Conor',
                    email: 'demo@conor.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        });
        app.listen(3000);
    })
    .catch(err => console.log(err));