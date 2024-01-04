const express = require("express");
const mongoose = require("mongoose");
const JwtStrategy = require('passport-jwt').Strategy;
    ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport')
const User = require("./models/User");
const authRoutes = require("./routes/Auth");
const songRoutes = require("./routes/SongR")
const playlistRoutes = require("./routes/PlaylistR")
const cors = require('cors');
const app = express();
app.use(cors());
require("dotenv").config();
const port =8000;  

app.use(express.json());

mongoose.connect("mongodb+srv://Div_Ag:"+process.env.Mongo_Password+"@cluster0.qkqygbe.mongodb.net/cluster0?retryWrites=true&w=majority")
.then((x)=>{
    console.log("Connected To Mongo");
})
.catch((err)=>{
    console.log("Error while connecting to mongo",err);
});

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "thisKeyIsSupposedToBeSecret"
  };
  
  passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
      try {
        const user = await User.findOne({ _id: jwt_payload.identifier });
        
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
          // Alternatively, create a new account if desired
        }
      } catch (error) {
        return done(error, false);
      }
    })
  );


app.get("/",(req,res)=>{
    res.send("Hello World");
});
app.use("/auth", authRoutes);
app.use("/song",  songRoutes);
app.use("/playlist",playlistRoutes); 
app.listen(port , ()=>{
    console.log("App is Running on Port "+port);
})