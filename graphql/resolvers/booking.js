const Booking = require('../../models/booking');
const {transformBooking, transformEvent } = require('./merge');
const Event = require('../../models/event')

module.exports= {
    booking: async(args, req)=>{
        if(!req.isAuth){
            throw new Error('UNAUTHENTHICATED');
        }
       try{
        const bookings= await Booking.find();
        return bookings.map((booking)=>{
            // console.log(booking._doc);
            return transformBooking(booking);
        })
       }catch(err){
            throw err;
       }
    },
    bookEvent: async (args, req)=>{
        if(!req.isAuth){
            throw new Error('UNAUTHENTHICATED');
        }
        const fetchedEvent = await Event.findOne({_id:args.eventId})
        
        const booking = new Booking({
            // user:"5c5c741b4de586394f5b10da",
            user : req.userId,
            event:fetchedEvent
        });
        const result = await booking.save();
        // console.log(new Date(result._doc.createdAt).toISOString());
        return transformBooking(result);
    },
    cancelBooking: async (args, req)=>{
        if(!req.isAuth){
            throw new Error('UNAUTHENTHICATED');
        }
        try{
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);
            await Booking.deleteOne({_id:args.bookingId});
            return event;
        }
        catch(err){
            throw err;
        }
    }
}