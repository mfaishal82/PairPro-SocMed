class HomeController {

    static async landingPage(req, res) {
        try {
            res.send('Ini Harusnya Landing page')
        } catch (error) {
            res.send(error);
        }
    }

}

module.exports = HomeController;