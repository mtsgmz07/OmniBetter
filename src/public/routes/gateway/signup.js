const { request, response } = require("express")
const axios = require('axios')
module.exports = {
    name: "/signup",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: (req, res) => {
        res.status(200).render("gateway/signup", { data: { redirect_url: !req.query?.redirect_url ? "/connect/account" : req.query?.redirect_url, connect: req?.user, basket: req?.basket } })
    }
}