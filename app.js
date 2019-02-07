const express = require('express');
const bodyParser = require('body-parser');

// for parsing graphql query
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const app = express();

// for db connection
const mongoose = require('mongoose');

// Models // here we use as constructor
const Event = require('./models/event');
// middleware
app.use(bodyParser.json());


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
            // Event.find({title:'1'})
            return Event.find()
            .then((events)=>{
                return events.map(event=>{
                    // _id:event.id ===_id: event._doc._id.toString() 
                    return{...event._doc, _id: event.id};  
                });
            }).catch((err)=>{
                throw err;
            });
        },
        createEvent: (args)=>{
            // this is constructor (Model)
            const event = new Event({
                title:args.eventInput.title,
                description:args.eventInput.description,
                price: +args.eventInput.price,
                // As there is no separate datatype for date
                date:  new Date(args.eventInput.date)
            });
            // do return due to a   ync
            return event.save()
            .then((result)=>{
                console.log(result);
                // return result;
                return {...result._doc} ;
            })
            .catch((err)=>{
                console.log(err);
                throw err;
            });
            
        }
    },
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
