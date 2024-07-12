const { request, response } = require("express")
module.exports = {
    name: "/admin/home",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: (req, res) => {
        res.status(200).render("admin/home", { data: { connect: req?.user, basket: req?.basket } })
    }
}