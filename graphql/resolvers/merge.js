const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString }= require('../../helpers/date');

const user = async userId=>{
    try{
        const user = await User.findById(userId);
        console.log(user._doc);
        return{

            ...user._doc,
            _id:user.id,
            createdEvents: events.bind(this, user._doc.createdEvents)}
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
                // date: new Date(event._doc.date).toISOString()
                date: dateToString(event._doc.date)
            }
        })
    })
    .catch(err=>{
        throw err;
    })
}

const transformEvent = event=>{
    // if(!event){
    //     console.log('i am getting error inside transformEvent')
    // }
    return{
        ...event._doc,
        _id: event.id,
        creator: user.bind(this, event._doc.creator),
        // date: new Date(event._doc.date).toISOString()
        date: dateToString(event._doc.date)
    };
}



const singleEvent = async eventId=>{
    try{
        const event = await Event.findById(eventId);
        // console.log('I am inside singleEvent');
        return transformEvent(event)
    }
    catch(err){
        throw err;
    }
}


const transformBooking = (booking)=>{
    // console.log(booking._doc);
    return {
        ...booking._doc,
        _id:booking.id,
        user:user.bind(this, booking._doc.user),
        event:singleEvent.bind(this, booking._doc.event),
        createdAt:dateToString(booking._doc.createdAt),
        updatedAt:dateToString(booking._doc.updatedAt)
    };
}

// exports.user = user;
// exports.events = events;
// exports.singleEvent = singleEvent;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;