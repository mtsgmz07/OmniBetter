const { request, response } = require("express")
const axios = require('axios')
module.exports = {
    name: "/contact",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: (req, res) => {
        res.status(200).render("contact", { data: { connect: req?.user, basket: req?.basket } })
    }
}