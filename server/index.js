//*********************** IMPORTS ***************************/
const colors = require('colors');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema.js');
const connectDB = require('./config/db');
require('dotenv').config();
//***********************************************************/


const port = process.env.PORT || 5000;
const app = express();

// Connect to database
connectDB();

// Setup express server and graphQL
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development',
}));

// Server start
app.listen(port, console.log( `Server running on port ${ port }` ))
