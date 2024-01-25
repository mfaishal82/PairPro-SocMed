class UserController {

    static async login(req, res) {
        try {
            res.render('login')
        } catch (error) {
            res.send(error)
        }
    }

    static async verify(req, res) {
        try {
            res.send('Verify Login')
        } catch (error) {
            res.send(error)
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
            res.send('Simpan User Baru')
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

    static async profile(req, res) {
        try {
            res.render('profile')
        } catch (error) {
            res.send(error);
        }
    }

}

module.exports = UserController;