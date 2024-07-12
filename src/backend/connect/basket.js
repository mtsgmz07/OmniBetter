const { request, response } = require("express")
require('dotenv').config()
const Account = require('../../public/models/account')
const Payment = require('../../public/models/payment')
const Desktop = require('../../public/models/desktop')
const compareArray = require("../../assets/js/function/compareArray")
const stripe = require('stripe')(process.env.STRIPE)
module.exports = {
    name: "/basket",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        if (req?.user) {
            const getAllDesktop = (await Desktop.getAll()).map(x => x.desktop_id)
            const getBasket = (await Account.getAccountByAccountId(req.user.account_id)).getBasket()
            const checkPayment = await Payment.check(getBasket, req.user.account_id)
            if (checkPayment) return res.status(200).json({ success: true, redirect_url: checkPayment })
            const newPayment = await Payment.create(getBasket, req.user.account_id)
            if (
                (!getBasket || !newPayment || !getBasket[0]) ||
                (compareArray(getBasket.filter(x => getAllDesktop.includes(x.desktop_id)), getBasket).length >= 1)
            ) return res.status(404).json({ error: true, redirect_url: "/basket" })
            const getLinkStripe = (await stripe.checkout.sessions.retrieve(newPayment.stripe_payment_id)).url
            return res.status(200).json({ success: true, redirect_url: getLinkStripe })
        } else return res.status(200).json({ success: true, redirect_url: "/signup?redirect_url=checkout" })
    }
}