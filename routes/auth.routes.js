const {Router} = require('express');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');

const User = require('../models/User');

const router = Router();

router.post('/register', [
        check('email', 'Incorrect email').isEmail(),
        check('password', 'Short password').isLength({min: 6})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect data during registration'
                });
            }

            const {email, password} = req.body;

            const condidate = await User.findOne({email});

            if (condidate) {
                return res.status(400).json({message: 'User exists'});
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({email, password: hashedPassword});

            await user.save();

            res.status(201).json({message: 'User created'})
        } catch (e) {
            res.status(500).json({message: 'Something went wrong, try again'});
        }
    });

router.post('/login', [
        check('email', 'Enter correct email').normalizeEmail().isEmail(),
        check('password', 'Enter password').exists()
    ],
    async (req, res) => {

        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Login data incorrect'
                });
            }


            const {email, password} = req.body;

            const user = await User.findOne({email});

            if (!user) {
                return res.status(400).json({message: 'User not found'})
            }

            const isMatch = bcrypt.compareSync(password, user.password);

            if (!isMatch) {
                return res.status(400).json({message: 'Password data incorrect'})
            }

            const token = jwt.sign(
                {userId: user.id},
                config.get('jwtSecret'),
                {expiresIn: '1h'}
            );

            res.status(200).json({token, userId: user.id});
        } catch (e) {
            res.status(500).json({message: 'Something went wrong, try again'});
        }
    });

module.exports = router;