const { request, response } = require("express")
const axios = require('axios')
module.exports = {
    name: "/policies/privacy-policy",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: (req, res) => {
        res.status(200).render("policies/privacy-policy", { data: { connect: req?.user, basket: req?.basket } })
    }
}