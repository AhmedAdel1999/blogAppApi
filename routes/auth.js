const router = require("express").Router();
const User = require("../models/User");
const bcryptjs = require("bcryptjs");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const salt = await bcryptjs.genSalt(10);
    const hashedPass = await bcryptjs.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send({error:"May be this is an user with this data change it!!"});
  }
});

//LOGIN
router.post("/login", async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
    //!user && res.status(500).send({error:"Wrong credentials!"});

    const validated = await bcryptjs.compare(req.body.password, user.password);
    //!validated && res.status(500).send({error:"Wrong credentials!"});

    if(user&&validated){
      const { password, ...others } = user._doc;
      res.status(200).json(others);
    }else{
      throw new Error();
    }
    } catch (error) {
      res.status(500).send({error:"Invalid username or password!"});
    }
  
});

module.exports = router;
