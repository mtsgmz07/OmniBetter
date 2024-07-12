const { request, response } = require("express")
const axios = require('axios')
module.exports = {
    name: "/connect/logout",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: (req, res) => {
        if(req.user) {
            res.clearCookie("authorization")
            return res.status(200).redirect("/")
        } else return res.status(404).redirect("/login")
    }
}