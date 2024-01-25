class IndexController {

    static async landingPage(req, res) {
        try {
            res.render('landing')
        } catch (error) {
            res.send(error);
        }
    }

}

module.exports = IndexController;