require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./server/config/db');

// const connectDB = require('./server/config/db');
const { isActiveRoute } = require('./server/helper/routerHelper');

const app = express();
const PORT = process.env.PORT || 3000;
const mainRouter = require('./server/routes/main');
const adminRouter = require('./server/routes/admin');

connectDB();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(express.static('public'));
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute; 

app.use('/', mainRouter);
app.use('/', adminRouter.adminRouter);
 

app.listen(PORT, ()=> {
    console.log(`App listening on port ${PORT}`);
});