const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs")
const PORT = 3001;
const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');

const io = require("socket.io")(3002, {
  cors: {
    origin: ["http://localhost:3000"]
  }
})

mongoose.connect("mongodb+srv://francesdonaire:chatforte123456@chat-forte-db.xnufm5f.mongodb.net/chat-forte?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Register = require("./model/register");

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST, GET, DELETE, PUT"],
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));



app.post("/registerUser", async (req, res) => {
  const full_name = req.body.full_name;
  const email_address = req.body.email_address;
  const password = req.body.password;
  const status = req.body.status

  try {

    const saltRounds = 10; 
    const hash = await bcrypt.hash(password, saltRounds);

    const RegisterUser = new Register({
      full_name: full_name,
      email_address: email_address,
      password: hash, 
      status: status
    });

    await RegisterUser.save();
    console.log("success");

    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Registration failed' });
  }
});



app.post("/loginUser", async (req, res) => {
  const { email_address, password } = req.body;

  try {
    const existingUser = await Register.findOne({ email_address });

    if (existingUser) {
      const isPasswordValid = await bcrypt.compare(password, existingUser.password);

      if (isPasswordValid) {

        const userId = existingUser._id;

       
        const token = jwt.sign({ userId }, secretKey, { expiresIn: "1d" });

        res.status(200).json({tok: token, ID: userId, Result: "Login Successful"});

    
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ message: 'Email not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
});



app.post("/accToken", (req, res) => {

  const token = req.body.token;

  if(!token) {

    return res.json({ message: 'Unauthorized' })

  } else {

    jwt.verify(token, secretKey, (err, decoded) => {

      if(err) {

        return res.json({message: "Token is not valid"})

      } else {

        req.userId = decoded.userId;
   
        if(req.userId) {

          res.json({ message: 'Authorized', ID: req.userId });

        } else {

          res.status(403).json({ message: 'Forbidden' });

        }
      
      }
    })


  }

})

app.get("/userData", async (req, res) => {

  try {

    const id = req.query.id; 

    const user = await Register.findById(id);

    if(!user) {
      return res.json({ message: 'User not found' });
    } 

    await Register.updateOne(
      { _id: id },
      { $set: { status: true } }
    );

    res.json({message: "User Found"});

  } catch (error) {

    console.log(error)

  }


});


app.post("/welcomeUser", (req, res) => {

  const token = req.query.token;

  if(!token) {

    return res.json({ message: 'Unauthorized' })

  } else {

    jwt.verify(token, secretKey, async(err, decoded) => {

      if(err) {

        return res.json({message: "Token is not valid"})

      } else {

        req.userId = decoded.userId;

        const user =  await Register.findById(req.userId);

        if(user) {

          res.json(req.userID);

        } else {

          res.status(403).json({ message: 'Forbidden' });

        }
      
      }
    })

  }

})

// get all users

app.get("/getAllUser", async(req, res) => {

  try {

    const allUsers = await Register.find({});

    res.send(allUsers)

  } catch (error) {

    console.log(error)

  }


})





io.on("connection", async socket => {


  socket.on("event", async () => {

    try {

      const onlineUsers = await Register.find({ status: true });
      socket.emit("online-users", onlineUsers);

    } catch (error) {

      console.error(error);

    }

  });

});

//get the logout id
app.post("/logout/:id", (req, res) => {

  const token = req.params.id;


  if(!token) {

    return res.json({ message: 'Unauthorized' })

  } else {

    jwt.verify(token, secretKey, async(err, decoded) => {

      if(err) {

        return res.json({message: "logout error"})

      } else {

        req.userId = decoded.userId;

        const user =  await Register.findById(req.userId);

        if(user) {

          res.json(user);

        } else {

          res.status(403).json({ message: 'Forbidden' });

        }
      
      }
    })

  }

})


app.post("/logoutUser/:id", async(req, res) => {

  const id = req.params.id

  try {

    await Register.updateOne(
      { _id: id },
      { $set: { status: false } }
    );
    
    console.log(id)

  } catch (error) {

    console.log(error)

  }
  

})




app.listen(PORT, () => {
  console.log("PORT IS LISTENING AT 3001");
});

