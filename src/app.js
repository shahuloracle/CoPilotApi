const express = require("express");
const morgan = require("morgan");
const mysql = require("mysql2");
const myConnection = require("express-myconnection");
const path = require('path');
const app = express();
const cors = require('cors');
require('dotenv').config({ path: path.resolve(__dirname, '../env.config') });
// Importing routes
const customerRoutes = require('./routes/customer');
const categoryRoutes = require('./routes/category');
const uomRoutes = require('./routes/uom');
app.use(cors());

// settings
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middlewares
app.use(morgan('dev'));
app.use(myConnection(mysql, {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}, 'pool'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
// Routes
app.use('/', customerRoutes);
app.use('/', categoryRoutes);
app.use('/', uomRoutes);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port 3000');
})