const { User } = require('../models')
const bcrypt = require('bcryptjs')

class UserController {

    static async login(req, res) {
        let { error } = req.query 

        try {
            res.render('login', { error } )
        } catch (error) {
            res.send(error)
        }
    }

    static async verify(req, res) {
        let { username, password } = req.body

        try {
            let user = await User.findOne({
                where: { username }
            })

            if(!user) {
                throw new Error('username or password not found')
            }

            let isVerified = bcrypt.compareSync(password, user.password)

            if(!isVerified) {
                throw new Error('username or password incorrect')
            }

            req.session.UserId = user.id
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
        let { username, email, password} = req.body

        try {
            await User.create({ username, email, password})
            res.redirect('/user/login')
        } catch (error) {
            res.send(error)
        }
    }

    static async home(req, res) {
        try {
            let id = req.session.UserId
            console.log(id)
            res.render('home', {id})
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

    static async profile(req, res) {
        try {
            let id = req.session.UserId
            res.render('profile', {id})
        } catch (error) {
            res.send(error)
        }
    }

    static async saveProfile(req, res) {
        try {
            let { firstName, lastName, dateOfBirth, hobby, gender, UserId } = req.body
            console.log({ firstName, lastName, dateOfBirth, hobby, gender, UserId })
            await User.create({firstName, lastName, dateOfBirth, hobby, gender, UserId}, {
                where: {
                    id
                }
            })
            res.redirect('/user/home')
        } catch (error) {
            res.send(error.message)
            console.log(error)
        }
    }

}

module.exports = UserController;