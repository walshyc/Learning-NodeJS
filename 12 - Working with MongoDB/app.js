const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views'); //sets where the HTMl templates are contained, not required if using views folder

app.use((req, res, next) => {
    // User.findByPk(1)
    //     .then(user => {
    //         req.user = user;
    //         next();
    //     })
    //     .catch(err => console.log(err));
    next();
});

const adminRoutes = require('./routes/admin.js');
// const shopRoutes = require('./routes/shop.js');


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
// app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
});