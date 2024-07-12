const { request, response } = require("express")
const axios = require('axios')
module.exports = {
    name: "/policies/general-terms-and-conditions-of-sale",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: (req, res) => {
        res.status(200).render("policies/general-terms-and-conditions-of-sale", { data: { connect: req?.user, basket: req?.basket } })
    }
}