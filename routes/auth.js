const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const {registerValidation, loginValidation} = require('../validation');


router.post('/register', async (req, res) => {
    // Lets validate the data before we add user
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Checking is the user is already in the database
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(400).send('Email already exists');

    // Hash the passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        await user.save();
        res.send({user: user._id})
    } catch (e) {
        res.status(400).send(e);
    }
});

// Login
router.post('/login', async (req, res) => {

    // Lets validate the data before we add user
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Checking is the email is already in the database
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Email doesn\'t exists');
    // Password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid Password');

    // Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});

module.exports = router;
