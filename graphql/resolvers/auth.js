
//for password security
const bcrypt = require('bcryptjs');

// Models // here we use as constructor
const User = require('../../models/user');


module.exports= {
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
}