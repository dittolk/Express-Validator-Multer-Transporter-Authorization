const { body, validationResult} = require('express-validator')

module.exports = {
    checkRegister: async (req, res, next) =>{
        try{
            await body('username').notEmpty().withMessage('Harus diisi').run(req);
            await body('email').notEmpty().withMessage('Email required')
                .isEmail().withMessage('invalidEmail').run(req);
            await body('password').notEmpty().withMessage('password required')
                .isStrongPassword({
                    minLength: 6
                }).run(req)

            const validation = validationResult(req)

            if(validation.isEmpty()){
                next()
            }else{
                return res.status(400).send({
                    message: 'validation invalid',
                    error: validation.array()
                })
            }
        }catch(err){
            console.log(err);
            res.status(400).send(err)
        }
    }
}