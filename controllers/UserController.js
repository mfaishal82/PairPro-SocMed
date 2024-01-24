class UserController {

    static async login(req, res) {
        try {
            res.send('Ini Halaman Login')
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
            res.send('Tempilkan Form Register')
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

}

module.exports = UserController;