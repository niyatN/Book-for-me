const express = require('express');
const bodyParser = require('body-parser');

// for parsing graphql query
const graphqlHttp = require('express-graphql');
const app = express();

// for db connection
const mongoose = require('mongoose');

// 
const graphQLSchema = require('./graphql/schema/index');
const graphQLResolvers = require('./graphql/resolvers/index');
// middleware
app.use(bodyParser.json());

app.use('/graphql',graphqlHttp({
    schema: graphQLSchema,
    // resolvers
    rootValue: graphQLResolvers,
    graphiql:true
}))

app.get('/', (req, res, next)=>{
    res.send('1+1=10')
})
// ${process.env.MONGO_USER}
// ${process.env.MONGO_PASSWORD} ${process.env.MONGO_DB}

mongoose.connect(
    `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@localhost:27017/${process.env.MONGO_DB}?authSource=admin`,
    { useNewUrlParser: true }
    ).then(()=>{
        app.listen(3000,(err)=>{
            if(err) throw err;
            console.log('I am listeng...')
        });
    }).catch(err=>{
        console.log(err);
    });
