const { request, response } = require("express")
const axios = require('axios')
module.exports = {
    name: "/policies/terms-of-service",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: (req, res) => {
        res.status(200).render("policies/terms-of-service", { data: { connect: req?.user, basket: req?.basket } })
    }
}