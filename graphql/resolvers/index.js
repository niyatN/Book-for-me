
//for password security
const bcrypt = require('bcryptjs');

// Models // here we use as constructor
const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');


// Find user by it's ID
// we can use async and wail insted of promises .then() .catch()
const user = async userId=>{
    try{
        const user = await User.findById(userId);
        return{...user._doc, _id:user.id,createdEvents: events.bind(this, user._doc.createdEvents)}
    }
    catch(err){
        throw err;
    }
    
}

// Find events by creator id
const events = eventIds=>{
    return Event.find({_id:{$in:eventIds}})
    .then(events=>{
        return events.map(event=>{
            return{
                ...event._doc,
                _id: event.id,
                creator:user.bind(this,event.creator),
                date: new Date(event._doc.date).toISOString()
            }
        })
    })
    .catch()
}


const singleEvent = async eventId=>{
    try{
        const event = await Event.findById(eventId);
        return {
            ...event._doc,
            _id:event.id,
            creator:user.bind(this, event.creator)
        }
    }
    catch(err){
        throw err;
    }
}
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
                // _id:event.id ===_id: event._doc._id.toString() 
                // console.log(event._doc.creator);
                // let c = ()=>{this.user(event._doc.creator)}
                return{
                    ...event._doc,
                    _id: event.id,
                    creator: user.bind(this, event._doc.creator),
                    date: new Date(event._doc.date).toISOString()
                };  
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
            createdEvent = {
                ...result._doc,
                _id:result.id,
                password:null,
                date: new Date(result._doc.date).toISOString(),
                creator:user.bind(this, result._doc.creator)}
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
        
    },
    booking: async()=>{
       try{
        const bookings= await Booking.find();
        return bookings.map((booking)=>{
            return {
                ...booking._doc,
                _id:booking.id,
                user:user.bind(this, booking._doc.user),
                event:singleEvent.bind(this, booking._doc.event),
                createdAt:new Date(booking._doc.createdAt).toISOString(),
                updatedAt:new Date(booking._doc.updatedAt).toISOString()
            };
        })
       }catch(err){
            throw err;
       }
    },
    bookEvent: async args=>{
        const fetchedEvent = await Event.findOne({_id:args.eventId})
        
        const booking = new Booking({
            user:"5c5c741b4de586394f5b10da",
            event:fetchedEvent
        });
        const result = await booking.save();
        console.log(new Date(result._doc.createdAt).toISOString());
        return{
            ...result._doc,
            _id:result.id,
            createdAt:new Date(result._doc.createdAt).toISOString(),
            updatedAt:new Date(result._doc.updatedAt).toISOString(),
            user:user.bind(this, result._doc.user),
            event:singleEvent.bind(this, result._doc.event),
                
        }
    },
    cancelBooking: async args=>{
        try{
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = {...booking.event._doc, _id:booking.event.id, creator:user.bind(this,booking.event._doc.creator )};
            await Booking.deleteOne({_id:args.bookingId});
            return event;
        }
        catch(err){
            throw err;
        }
    }
}