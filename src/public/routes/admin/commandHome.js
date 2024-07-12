const { request, response } = require("express")
const Contact = require('../../models/contact')
const convertTime = require('../../../assets/js/function/convertTime')
module.exports = {
    name: "/admin/command",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        res.status(200).render("admin/commandHome", { data: { connect: req.user, basket: req.basket } })
    }
}