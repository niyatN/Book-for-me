
//for password security
const bcrypt = require('bcryptjs');

// Models // here we use as constructor
const User = require('../../models/user');

const jwt = require('jsonwebtoken');
module.exports= {
        createUser:(args)=>{
        // to remove duplication of email address
        // console.log(args);
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
            return {...result._doc, password:null,_id: result.id};
        })

        .catch((err)=>{
            console.log(err);
            throw err;
        })
    },
    login:async ({email, password})=>{
        const user = await User.findOne({email:email});
        // console.log(user);
        if(!user){
            throw new Error("USER_NOT_EXIST");
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if(!isEqual){
            throw new Error("INVALID_USERNAME_OR_PASSWORD");
        }
        const token = jwt.sign({userId:user.id, email:user.email},'somesupersecretkey',{
            expiresIn:'1h'
        });
        console.log(token);
        return {
            userId:user.id,
            token:token,
            tokenExpiration:1
        }
    }
    
}


