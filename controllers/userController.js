const db = require('../models')
const User = db.User
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const handlebars = require('handlebars')
const transporter = require('../middleware/transporter')

module.exports = {
    register: async(req, res) =>{
        try{
            const {username, email, password} = req.body
            const isEmailExist = await User.findOne({
                where:{
                    email: email
                }
            })

            if(isEmailExist){
                return res.status(409).send({
                    message: 'email has been used'
                })
            }

            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)

            await User.create({
                username: username,
                email: email,
                password: hashPassword
            })

            const data = fs.readFileSync('./template.html', 'utf-8')
            const tempCompile = await handlebars.compile(data)
            const tempResult = tempCompile({username: username})

            await transporter.sendMail({
                from: 'ditto@gmail.com',
                to: email,
                subject: 'Email Confirmation',
                html: tempResult
            }) 
            res.status(201).send({message: 'Register Success'})
        }catch(err){
            console.log(err);
            res.status(400).send({message: err.message})
        }
    },
    getAll: async (req, res) => {
        try{
            const result = await User.findAll()
            res.status(200).send({result})
        }catch(err){
            console.log(err);
            res.status(400).send({message: err.message})
        }
    },
    login: async(req, res) =>{
        try{
            const {email, password} = req.body
            const isUserExist = await User.findOne({
                where:{
                    email: email
                }
            })

            if(isUserExist == null){
                return res.status(409).send({
                    message: 'user not found'
                })
            }

            const isValid = await bcrypt.compare(password, isUserExist.password)
            if(!isValid){
                return res.status(400).send({
                    message: 'incorrect password'
                })
            }

            //data yang mau disimpan di token
            let payload = {id: isUserExist.id, isAdmin: isUserExist.isAdmin}
            const token = jwt.sign(payload, process.env.KEY_JWT, {expiresIn: '1h'})

            res.status(200).send({
                message: "login success",
                result: isUserExist,
                token
            })
        }catch(err){
            console.log(err);
            res.status(400).send({err: err.message})
        }
    },

    keeplogin: async(req, res) =>{
        try{
            console.log(req.user);

            const user = await User.findOne({
                where:{
                    id: req.user.id
                }
            })
            console.log(user);
            res.status(200).send("Keep login")
        }catch(err){
            res.status(400).send({err: err.message})
        }
    },

    updateUser: async(req, res) =>{
        const {username, email, password} = req.body;
        try{
            const result = await User.update(
                {
                    username: username,
                    email: email
                },
                {
                    where:{
                        id: req.user.id,
                    }  
                },
            );
            res.status(200).send("Update")
        }catch(err){
            res.status(400).send({err: err.message})
        }
    },

    updatePassword: async(req, res) =>{
        const {password} = req.body
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        console.log(hashPassword);

        try{
            const result = await User.update(
                {
                    password: hashPassword
                },
                {
                    where:{
                        id: req.user.id,
                    }  
                },
            );
        }catch(err){
            res.status(400).send({err: err.message})
        }
    },
    updateAdmin: async (req, res) =>{
        const {isAdmin} = req.body;
        console.log("asd", req.user.isAdmin);
        try{
            const result = await User.update(
                {
                    isAdmin: isAdmin
                },
                {
                    where:{
                        id: req.user.id,
                    }  
                },
            );
            res.status(200).send("Updated admin")
        }catch(err){
            res.status(400).send({err: err.message})
        }
    },

    updateImage: async (req, res) => {
        try{
            await User.update({imgProfile: req.file?.path},{
                where: {
                    id: req.user.id
                }
            })
            console.log(req.file);
            res.status(200).send('success upload')
        }catch(err){
            console.log(err);
            res.status(400).send({err: message})
        }
    }
}