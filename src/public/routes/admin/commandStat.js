const { request, response } = require("express")
const Payment = require('../../models/payment')
require('dotenv').config()
const stripe = require("stripe")(process.env.STRIPE)
const formatDate = require('../../../assets/js/function/formatDate')
module.exports = {
    name: "/admin/command/statistics",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        res.status(200).render("admin/commandStat", { data: { connect: req.user, basket: req.basket } })
    }
}