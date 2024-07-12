const { request, response } = require("express")
const axios = require('axios')
module.exports = {
    name: "/login",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: (req, res) => {
        res.status(200).render("gateway/login", { data: { connect: req?.user, redirect_url: !req.query?.redirect_url ? "/connect/account" : req.query?.redirect_url, basket: req?.basket } })
    }
}