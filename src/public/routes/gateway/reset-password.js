const { request, response } = require("express")
const ResetPassword = require('../../models/reset-password')
module.exports = {
    name: "/reset-password",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        if (req.query?.id && await ResetPassword.get(req.query?.id)) return res.status(200).render("gateway/reset-password", { data: { id: req.query?.id, basket: req?.basket } })
        else return res.status(200).render("gateway/reset-password", { data: { basket: req?.basket } })
    }
}