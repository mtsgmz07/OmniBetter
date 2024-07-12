const { request, response } = require("express")
const axios = require('axios')
module.exports = {
    name: "/connect/account",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: (req, res) => {
        res.status(200).render("connect/account", { data: { connect: req?.user, basket: req?.basket } })
    }
}