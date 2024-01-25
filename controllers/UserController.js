const { User, Post } = require('../models')
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
        const {error} = req.query;

        try {
            res.render('register', {error})
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
            if(error.name == 'SequelizeValidationError'){
                const msgErr = error.errors.map(err => err.message)
                res.redirect(`/user/register?error=${msgErr}`)
            }
        }
    }

    static async home(req, res) {
        const UserId = req.session.UserId
        const {error} = req.query;

        try {
            const posts = await Post.findAll({
                order: [["id", "DESC"]],
                include:{
                    model: User
                }
            });
            console.log(posts)
            // res.send(posts)
            res.render('home', {UserId, posts, error})
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

    static async saveNewPost(req, res) {
        const { UserId, title, imgUrl, content } = req.body
        try {
            await Post.create({ UserId, title, imgUrl, content })
            res.redirect('/user/home')
        } catch (error) {
            if(error.name == 'SequelizeValidationError'){
                const msgErr = error.errors.map(err => err.message)
                res.redirect(`/user/home?error=${msgErr}`)
            }else{
                console.log(error);
            }
        }
    }

}

module.exports = UserController;