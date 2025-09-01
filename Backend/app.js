import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cors from "cors";

import Task from "./models/taskModel.js";
import User from "./models/userModel.js";


dotenv.config();

const dbURL = process.env.dbURL;
const app = express();
app.use(cors());

//Connect to database
mongoose.connect(dbURL)
    .then((result) => {console.log("connected"); app.listen(3000);})
    .catch((err) => console.log("L"));


//Makes all the files in public dir public
app.use(express.static('public'));

//Receives data in JSON format
app.use(express.json());




/* Login Stuff */
app.post('/signup', async (req,res) => {
   
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email }); //returns null if no user, returns user if exists
        
    if (userExists) {
        res.status(400).json({ error: "User already exists" })
    }
    else{
        const user = new User({name, email, password});
        await user.save();

        // Create JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);


        res.json({ redirect: '/dashboard', token });
    } 
    
})

app.post('/login', async (req,res) => {
    
    const {email, password } = req.body;
    const user = await User.findOne({ email }); //returns null if no user, returns user if exists
    
    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ error: 'User does not exist' });
        }
    
        // Compare the password
        if (password != user.password) {
          return res.status(400).json({ error: 'Incorrect Password' });
        }
    
        // Create JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET); // Secret key from environment variables
    
        // Send token to client
        res.status(200).json({redirect: '/dashboard', token });


    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
    
})

/* Dashboard stuff */
app.get('/dashboard/tasks', authenticateToken, async (req,res) =>{
    //Get all tasks and sort earliest first
    const taskList = await Task.find({ user: req.userID }).sort({ dueDate: 1 });
    res.status(200).json({taskList});
})

/* Create Tasks */
app.post('/dashboard/createTask', authenticateToken, async (req,res) => {
    
    const {title, description, dueDate, priority} = req.body;
    const user = req.userID;

    const task = new Task({ title, description, dueDate, priority,user})

    await task.save();

    res.status(200).json({redirect: '/dashboard'});

})

/*Update Tasks */ 
app.get('/dashboard/task/:id', authenticateToken, async (req,res) =>{
    const task = await Task.findById(req.params.id);
    
    if (task){res.json({task})}
    else{res.status(400).json({error: 'task not found', redirect: '/'})};
})


app.put('/dashboard/task/:id', async (req,res) =>{
    const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true } // returns the updated document
    );

    if (!updatedTask) {
        res.status(404).json({ message: 'Task not found' });
    }

    res.json({redirect:'/dashboard'});

})

app.delete('/dashboard/task/:id', async (req,res) =>{
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ redirect: '/dashboard' });
    
})

/* authentication middleware */

function authenticateToken(req,res,next) {
    //Check for Token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1]; 
    if (!token){res.status(400).json({error: "No token"})}


    //Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {

        if (err) {res.status(403).json({ error: 'Invalid token', redirect:'/'})}
        else{
            //Send back userID
            req.userID = decodedToken.userId;
            next();
        }

    });

}