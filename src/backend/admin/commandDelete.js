const { request, response } = require("express")
const Payment = require('../../public/models/payment')
require("dotenv").config()
const stripe = require('stripe')(process.env.STRIPE)
const nodemailer = require('../../assets/js/function/nodemailer')
module.exports = {
    name: "/admin/command/manage/:paymentId/delete",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        if (!req.body?.reason) return res.status(404).json({ error: true })
        const deletePayment = await Payment.delete(req.params?.paymentId, req.body?.reason)
        if (!deletePayment) return res.status(404).json({ error: true })
        else return res.status(200).json({ success: true })
    }
}