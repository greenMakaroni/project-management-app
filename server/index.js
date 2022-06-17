//*********************** IMPORTS ***************************/
// Color strings in console
const colors = require('colors');

// Server and graphQL
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema.js');

// DOTENV
require('dotenv').config();

// DB CONNECTION
const connectDB = require('./config/db');

//**************************************************/

const port = process.env.PORT || 5000;
const app = express();

// Connect to database
connectDB();


app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development',
}));

app.listen(port, console.log( `Server running on port ${ port }` ))
