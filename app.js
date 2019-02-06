const express = require('express');
const bodyParser = require('body-parser');

// for parsing graphql query
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const app = express();

// middleware
app.use(bodyParser.json());

app.use('/graphql',graphqlHttp({
    schema: buildSchema(`
        type RootQuery {
            events: [String!]!
        }
        type RootMutation {
            createEvent(name: String):String
        }
        schema{
            query: RootQuery
            mutation: RootMutation
        }
    `),
    // resolvers
    rootValue: {
        events:()=>{
            return ['Cooking','for','Coding','or', 'vise', 'vresa'];
        },
        createEvent: (args)=>{
            const eventName = args.name;
            return eventName;
        }
    },
    graphiql:true
}))

app.get('/', (req, res, next)=>{
    res.send('1+1=10')
})


app.listen(3000,(err)=>{
    if(err) throw err;
    console.log('I am listeng...')
})