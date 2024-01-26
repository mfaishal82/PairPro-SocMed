const { User, Post, Profile, Tag, TagPost} = require('../models')

const bcrypt = require('bcryptjs')
const { Op } = require("sequelize");
const { jsPDF } = require("jspdf");

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
            req.session.role = user.role

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
        const {error, errCreateTag} = req.query;
        try {
            console.log(errCreateTag,'<<<<<<<')
            const userData = await User.findByPk(UserId)
            const tags = await Tag.findAll()
            // console.log(tags)
            const profileData = await Profile.findOne({
                where: {
                    UserId
                }
            })
            
            const posts = await Post.findAll({
                order: [["id", "DESC"]],
                include:{
                    model: User
                },
            });

            const listTagPost = await Post.findAll({
                order: [["id", "DESC"]],
                include:{
                    model: TagPost,
                    include: {
                        model: Tag,
                        attributes: ['name']
                    },
                    attributes:['id']
                },
                attributes: ['id']
            });

            const listTag = listTagPost.map(el => {
                if(el.dataValues.TagPosts.length != 0){
                    return el.dataValues.TagPosts.map(e => e.Tag.name)
                }else{
                    return '-'
                }
            })

            res.render('home', {UserId, posts, error, userData, profileData, tags, listTag, errCreateTag})

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
        const { UserId, title, imgUrl, content, TagId } = req.body
        console.log(req.body)
        try {
            await Post.create({ UserId, title, imgUrl, content})
            const post = await Post.findOne({
                where: {
                    title: title
                },
                attributes: ['id']
            })

            if(TagId){
                await TagPost.create({TagId: TagId, PostId: post.id})
            }

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
        const {error} = req.query;
        try {
            let UserId = req.session.UserId
            let role = req.session.role
            let profile = await Profile.findOne({
                where: {
                    UserId
                }
            })
            
            if(!profile) {
                res.render('profile', {UserId, error, role})
            } else {
                res.render('profile_edit', {UserId, profile, error, role})
            }

        } catch (error) {
            res.send(error)
        }
    }

    static async saveProfile(req, res) {
        let UserId = req.session.UserId
        try {
            let { firstName, lastName, dateOfBirth, hobby, gender, organization} = req.body

            await Profile.create({firstName, lastName, dateOfBirth, hobby, gender, UserId, organization})
            res.redirect('/user/home')
        } catch (error) {
            if(error.name == 'SequelizeValidationError'){
                const msgErr = error.errors.map(err => err.message)
                res.redirect(`/user/profile/${UserId}?error=${msgErr}`)
            }else{
                res.send(error)
            }
        }
    }

    static async editProfile(req, res) {
        let { ProfileId } = req.params
        try {
            let { firstName, lastName, dateOfBirth, hobby, gender, organization} = req.body
            await Profile.update({ firstName, lastName, dateOfBirth, hobby, gender, organization}, {
                where: {
                    id: ProfileId
                }
            })

            res.redirect('/user/home')
        } catch (error) {
            let UserId = req.session.UserId
            if(error.name == 'SequelizeValidationError'){
                const msgErr = error.errors.map(err => err.message)
                res.redirect(`/user/profile/${UserId}?error=${msgErr}`)
            }else{
                res.send(error)
            }

        }
    }

    static async createTag(req, res) {
        const {tagName} = req.body;

        try {
            const name = tagName
            // console.log(name)
            await Tag.create({name});
            res.redirect('/user/home')
        } catch (error) {
            if(error.name == 'SequelizeValidationError'){
                const msgErr = error.errors.map(err => err.message)
                res.redirect(`/user/home?errCreateTag=${msgErr}`)
            }else{
                res.send(error)
            }
        }
    }

    static async dashboard(req, res) {
        const UserId = req.session.UserId
        const {userdel, search} = req.query

        try {
            const userData = await User.findByPk(UserId)
            let option = {
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
            }
            if(search){
                option.where.username = {
                    [Op.iLike]: `%${search}%`
                }
            }
            const allUser = await User.findAll(option);

            // res.send(allUser);
            res.render('dashboard', {allUser, userData, UserId, userdel})
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
            // ambil user name sebelum delete
            const userName = user.dataValues.username;
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

            res.redirect(`/user/dashboard?userdel=${userName}`)
        } catch (error) {
            res.send(error)
        }
    }

    static async addTag(req, res) {
        // tambah tag kedalam postingan
        const { PostId } = req.params;
        const { TagId } = req.body;
        try {
            await TagPost.create({TagId, PostId})
            res.redirect('/user/home');
        } catch (error) {
            res.send(error);
        }
    }

    static async cetak(req, res) {
        try {
            const allUser = await User.findAll({
                attributes: ["id", "username", "role", "password"],
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
            const doc = new jsPDF({
                orientation: "landscape",
            });
            let space = 10
            doc.text(`id -> username -> role -> hash`, 20, space);
            allUser.forEach(el => {
                space += 10
                doc.text(`${ el.dataValues.id} -> ${ el.dataValues.username} -> ${ el.dataValues.role} -> ${ el.dataValues.password}`, 20, space);
            });
            doc.save("list-user.pdf"); // will save the file in the current working directory
            res.redirect('/user/dashboard')
        } catch (error) {
            res.send(error)
        }
    }

}

module.exports = UserController;