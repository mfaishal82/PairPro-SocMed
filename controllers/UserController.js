const { User, Post, Profile, Tag , TagPost} = require('../models')
const bcrypt = require('bcryptjs')
const { Op } = require("sequelize");

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
            const userData = await User.findByPk(UserId)
            const profileData = await Profile.findOne({
                where: {
                    UserId
                }
            })

            const posts = await Post.findAll({
                order: [["id", "DESC"]],
                include:{
                    model: User
                }
            });

            res.render('home', {UserId, posts, error, userData, profileData})

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

            }
        }
    }

    static async profile(req, res) {
        try {
            let UserId = req.session.UserId
            let profile = await Profile.findOne({
                where: {
                    UserId
                }
            })
            
            if(!profile) {
                res.render('profile', {UserId, profile})
            } else {
                res.render('profile_edit', {UserId, profile})
            }

        } catch (error) {
            res.send(error)
        }
    }

    static async saveProfile(req, res) {
        try {
            let UserId = req.session.UserId
            let { firstName, lastName, dateOfBirth, hobby, gender, organization} = req.body

            await Profile.create({firstName, lastName, dateOfBirth, hobby, gender, UserId, organization})
            res.redirect('/user/home')
        } catch (error) {
            res.send(error.message)

        }
    }

    static async editProfile(req, res) {
        try {
            let { ProfileId } = req.params
            let { firstName, lastName, dateOfBirth, hobby, gender, organization} = req.body
            await Profile.update({ firstName, lastName, dateOfBirth, hobby, gender, organization}, {
                where: {
                    id: ProfileId
                }
            })

            res.redirect('/user/home')
        } catch (error) {
            res.send(error)

        }
    }

    static async createTag(req, res) {
        const {tagName} = req.body;

        try {
            const name = tagName
            await Tag.create({name});
            res.redirect('/user/home')
        } catch (error) {
            res.send(error)
        }
    }

    static async dashboard(req, res) {
        const UserId = req.session.UserId

        try {
            const userData = await User.findByPk(UserId)
            const allUser = await User.findAll({
                attributes: ["id", "username", "role"],
                where: {
                    role : {
                        [Op.ne]: 'admin'
                    }
                },
                include: {
                    model: Profile,
                    attributes: ["firstName","lastName"]
                }
            });
            // res.send(allUser);
            res.render('dashboard', {allUser, userData, UserId})
        } catch (error) {
            res.send(error)
        }
    }

    static async deleteUser(req, res) {
        const {UserId} = req.params
        try {
            const user = await User.findByPk(UserId);
            if(!user){
                throw new Error('User Not Found!!!')
            }
            // 1 hapus dari table Users
            await user.destroy();
            // 2 cek data dari table Profiles
            const profile = await Profile.findOne({where:{UserId}})
            if(profile){
                await profile.destroy()
            }

            const posts = await Post.findAll({
                where:{
                    UserId
                },
                include: {
                    model: TagPost
                }
            })

            if(posts.length > 0){
                await posts.destroy();
            }
            
            res.redirect('/user/dashboard')
        } catch (error) {
            res.send(error)
        }
    }

}

module.exports = UserController;