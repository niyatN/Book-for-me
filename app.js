const express = require('express');
const bodyParser = require('body-parser');

// for parsing graphql query
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const app = express();

//for password security
const bcrypt = require('bcryptjs');
// for db connection
const mongoose = require('mongoose');

// Models // here we use as constructor
const Event = require('./models/event');
const User = require('./models/user');
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
        type User {
            _id:ID!
            email:String!
            password:String
        }

        input EventInput {
            title: String!
            description: String!
            price:Float!
            date:String!
        }
        input UserInput {
            email:String!
            password:String!
        }
        type RootQuery {
            events: [Event!]!
        }
        type RootMutation {
            createEvent(eventInput: EventInput):Event
            createUser(userInput: UserInput):User
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
                date:  new Date(args.eventInput.date),
                creator: "5c5c741b4de586394f5b10da"
            });
            let createdEvent;
            // do return due to a   ync
            return event.save()
            .then((result)=>{
                createdEvent = {...result._doc, _id:result.id, password:null}
                return User.findById("5c5c741b4de586394f5b10da")
                console.log(result);
                
            })
            .then((user)=>{
                if(!user){
                    throw new Error('USER_NOT_FOUND');
                }
                user.createdEvents.push(event);
                user.save();
            })
            .then((result)=>{
                return createdEvent;
            })
            .catch((err)=>{
                console.log(err);
                throw err;
            });
            
        },
        createUser:(args)=>{
            // to remove duplication of email address
            return User.findOne({email:args.userInput.email})
            .then((user)=>{
                if(user){
                    console.log('User exist already');
                    throw new Error('USER_ALREADY_EXIST');
                }
                return bcrypt.hash(args.userInput.password,12)
            })
            .then((hashedPassword)=>{
                const user = new User({
                    email: args.userInput.email,
                    password:hashedPassword
                });
                return user.save();
            })
            .then((result)=>{
                return ;
            })

            .catch((err)=>{
                console.log(err);
                throw err;
            })
            
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
