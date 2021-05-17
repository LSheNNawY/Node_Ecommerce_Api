const User = require('../models/User')

const getUser = async (req , res ) => {
    try {
        const user = await User
        .find({ email: 'sara@gmail.com'})
        res.status(200).json(user);
        /* .select({username: 1, email:1 , gender:1 }); */
        // console.log("user data =>> " , user);
    }catch (err){
        res.status(401).send('Error getting user');
    }
   
  }


module.exports = {
    getUser 
  };


