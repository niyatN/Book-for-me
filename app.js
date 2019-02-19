const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// for parsing graphql query
const graphqlHttp = require('express-graphql');
const app = express();

// for db connection
const mongoose = require('mongoose');

const isAuth = require('./middleware/is-auth');
const graphQLSchema = require('./graphql/schema/index');
const graphQLResolvers = require('./graphql/resolvers/index');
// middleware
app.use(bodyParser.json());
app.use(isAuth);
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    if(req.method==='OPTIONS'){
        return res.sendStatus(200);
    }
    
        next();
    
});
// app.use(cors());
app.use('/graphql',graphqlHttp({
    schema: graphQLSchema,
    // resolvers
    rootValue: graphQLResolvers,
    graphiql:true
}))

app.get('/', (req, res, next)=>{
    res.send('1+1=10')
})
// ${process.env.MONGO_USER}
// ${process.env.MONGO_PASSWORD} ${process.env.MONGO_DB}

// add=(n)=>{
//     setTimeout(()=>console.log('rrr'), 2000);
//     return(n);
// }
// a=(n)=>{
//     for(i=0;i<n;i++){
//         add(n);
//     }
//     return n;
// }
// b = (n)=>{
//     return (4)
//     .then((a)=>{
//         console.log('I am here');
//     })
// }

mongoose.connect(
    `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@localhost:27017/${process.env.MONGO_DB}?authSource=admin`,
    { useNewUrlParser: true }
    ).then(()=>{
        app.listen(8000,(err)=>{
            if(err) throw err;
            console.log('I am listeng...')
        });
    }).catch(err=>{
        console.log(err);
    });
