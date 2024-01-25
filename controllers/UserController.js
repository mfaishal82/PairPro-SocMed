const { User } = require('../models')
const user = require('../models/user')
const { use } = require('../routes')
const bcrypt = require('bcryptjs')

class UserController {

    static async login(req, res) {
        try {
            let { error } = req.query            
            res.render('login', { error } )
        } catch (error) {
            res.send(error)
        }
    }

    static async verify(req, res) {
        try {
            let { username, password } = req.body
            let user = await User.findOne({
                where: {
                    username
                }
            })

            if(!user) {
                throw new Error('username or password not found')
            }

            let isVerified = bcrypt.compareSync(password, user.password)
            if(!isVerified) {
                throw new Error('username or password incorrect')
            }

            req.session.UserId = user.id
            console.log(req.session)


            res.redirect('/user/home')
        } catch (error) {
            let msg = error.message
            res.redirect(`/user/login?error=${msg}`)
        }
    }

    static async register(req, res) {
        try {
            res.render('register')
        } catch (error) {
            res.send(error)
        }
    }

    static async saveNewUser(req, res) {
        try {
            let { username, email, password} = req.body
            await User.create({ username, email, password})
            res.redirect('/user/login')
        } catch (error) {
            res.send(error)
        }
    }

    static async home(req, res) {
        try {
            res.render('home')
        } catch (error) {
            res.send(error)
        }
    }


    static async logout(req, res) {
        try {
            req.session.destroy((err) => {
                if(err) {
                    throw err
                } else {
                    res.redirect('/user/login')
                }
            })
        } catch (error) {
            res.send(error)

        }
    }

}

module.exports = UserController;