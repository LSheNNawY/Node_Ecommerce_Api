const User = require('../models/User')

//    get user    //
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

  //    update profile    //
  const updateProfile = async(req,res) => {
    
      const user = await User.findByIdAndUpdate(req.params.id, {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          gender: req.body.gender,
          image: req.body.image 
      
    }, { new: true });
    console.log(user)
      res.status(200).json(user);
    
    if(!user) return  res.status(401).send('Error updating user');
       
    res.send(user);
  } 

// const updateProfile = async(req,res)=>{
//     try{
//       const user = await User.findByIdAndUpdate(req.params.id, {$set: {
//           username: req.body.username,
//           email: req.body.email
//       }
//     }, { new: true });
//       res.status(200).json(user);
//     }catch(err){
//         console.log(err)
//         res.status(401).send('Error updating user');
//     }
//   } 

module.exports = {
    getUser , updateProfile
  };


