const Event = require('../../models/event');
const {transformEvent} = require('./merge');
const User = require('../../models/user');


module.exports= {
    events:()=>{
    
        // we can do populate also to get info about creator "Event.find().populate('creator')"
        // creator:{
        //     ...event._doc.creator._doc,
        //     _id: event._doc.creator._doc._id.toString()
        // }

        return Event.find()
        .then((events)=>{
            return events.map(event=>{
                return transformEvent(event);
            });
        }).catch((err)=>{
            throw err;
        });
    },
    createEvent: (args,req)=>{
        // this is constructor (Model)
        if(!req.isAuth){
            throw new Error('UNAUTHENTHICATED');
        }
        const event = new Event({
            title:args.eventInput.title,
            description:args.eventInput.description,
            price: +args.eventInput.price,
            // As there is no separate datatype for date
            date:  new Date(args.eventInput.date),
            // creator: "5c5c741b4de586394f5b10da"
            creator:req.userId
        });
        let createdEvent;
        // do return due to a   ync
        return event.save()
        .then((result)=>{
            // createdEvent = {
            //     ...result._doc,
            //     _id:result.id,
            //     password:null,
            //     date: new Date(result._doc.date).toISOString(),
            //     creator:user.bind(this, result._doc.creator)}
            createdEvent = transformEvent(result);
            return User.findById(req.userId)
            // return User.findById("5c5c741b4de586394f5b10da")
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
        
    }
}






