const express = require('express')
const router = express.Router()
const user = require('../models/User')
const { body, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const jwtSecret = "Mynameisshinshansoonawala#$"
router.post("/createuser", [
    body('email', 'Enter a valid email').isEmail(),
    body('name').isLength({ min: 5 }),
    body('password', 'Incorrect Password').isLength({ min: 5 })],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const salt = await bcrypt.genSalt(10);
        let secPass = await bcrypt.hash(req.body.password, salt)

        try {
            await user.create({
                name: req.body.name,
                location: req.body.location,
                email: req.body.email,
                password: secPass

            }).then(res.json({ success: true }));
        } catch (error) {
            console.log(error)
            res.json({ success: false });
        }
    })

router.post("/loginuser", [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Incorrect Password').isLength({ min: 5 })],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); 
        }
        let email = req.body.email;
        let pass = req.body.password;
        try {
            let usermail = await user.findOne({ email });
            if (!usermail) {
                return res.status(400).json({ errors: "Login with valid credentials" })
            }
            const passCompare = await bcrypt.compare(pass,usermail.password)
            if (!passCompare) {
                return res.status(400).json({ errors: "Login with valid credentials" })
            }
            const data = {
                user :{
                    id:usermail.id

                }
            }
            const authToken = jwt.sign(data,jwtSecret)
            return res.json({ success: true, authToken: authToken});
        } catch (error) {
            console.log(error)
            res.json({ success: false });
        }
    })


module.exports = router;