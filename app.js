const express = require('express');
const bodyParser = require('body-parser');

// for parsing graphql query
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const app = express();

// for db connection

const mongoose = require('mongoose');
// middleware
app.use(bodyParser.json());

const events = [];

app.use('/graphql',graphqlHttp({
    schema: buildSchema(`
        type Event{
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String
        }

        input EventInput {
            title: String!
            description: String!
            price:Float!
            date:String!
        }
        type RootQuery {
            events: [Event!]!
        }
        type RootMutation {
            createEvent(eventInput: EventInput):Event
        }
        schema{
            query: RootQuery
            mutation: RootMutation
        }
    `),
    // resolvers
    rootValue: {
        events:()=>{
            return events;
        },
        createEvent: (args)=>{
            // const eventName = args.name;
            // return eventName;
            const event = {
                _id:Math.random().toString(),
                title:args.eventInput.title,
                description:args.eventInput.description,
                price: +args.eventInput.price,
                date: args.eventInput.date
            }
            events.push(event);
            return event;
        }
    },
    graphiql:true
}))

app.get('/', (req, res, next)=>{
    res.send('1+1=10')
})
// ${process.env.MONGO_USER}
// ${process.env.MONGO_PASSWORD}
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
