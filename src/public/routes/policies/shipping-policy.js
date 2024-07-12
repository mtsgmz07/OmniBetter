const { request, response } = require("express")
const axios = require('axios')
module.exports = {
    name: "/policies/shipping-policy",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: (req, res) => {
        res.status(200).render("policies/shipping-policy", { data: { connect: req?.user, basket: req?.basket } })
    }
}