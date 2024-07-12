const { request, response } = require("express")
require('dotenv').config()
const Account = require('../../public/models/account')
const Verification = require('../../public/models/verification')
const jwt = require("jsonwebtoken")
const Payment = require('../../public/models/payment')
const Desktop = require('../../public/models/desktop')
const compareArray = require("../../assets/js/function/compareArray")
const stripe = require('stripe')(process.env.STRIPE)
module.exports = {
    name: "/login",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        if (
            !req.body.inputEmail &&
            !req.body.inputPassword
        ) return res.status(404).render("gateway/login", { data: { error: { status: true, value: "Une erreur c'est produite, veuillez ressayer ultérieurment" } } })

        let connect = await Account.connect(req.body.inputEmail, req.body.inputPassword)
        let value = {
            inputEmail: req.body.inputEmail
        }
        if (!connect) return res.status(404).render("gateway/login", { data: { redirect_url: !req.query?.redirect_url ? "/connect/account" : req.query?.redirect_url, value, error: { status: true, value: "L'adresse e-mail n'appartient à aucun compte" } } })
        if (connect.status === 0) return res.status(404).render("gateway/login", { data: { redirect_url: !req.query?.redirect_url ? "/connect/account" : req.query?.redirect_url, value, error: { status: true, value: "Adresse e-mail ou mot de passe invalide, veuillez réessayer" } } })
        if (connect.status === 1) return res.status(200).redirect(`/verification?id=${(await Verification.getByAccountId(connect.account_id)).verification_id}`)
        else {
            const getAccount = await Account.getAccountByAccountId(connect.account_id)
            let jwtToken = await getAccount.setJwtToken()
            jwt.verify(req.cookies["basket"], process.env.JWT, async (err, decoded) => {
                if (decoded) {
                    getAccount.saveBasket(decoded.basket)
                    res.clearCookie("basket")
                }
            })
            if (req.body?.saveMe) res.cookie("authorization", jwtToken, { maxAge: 5 * 24 * 60 * 60 * 1000, httpOnly: true })
            else res.cookie("authorization", jwtToken)
            if (req.query?.redirect_url === "checkout") {
                const getAllDesktop = (await Desktop.getAll()).map(x => x.desktop_id)
                const getBasket = getAccount.getBasket()
                const newPayment = await Payment.create(getBasket, getAccount.account_id)
                if (
                    (!getBasket || !newPayment || !getBasket[0]) ||
                    (compareArray(getBasket.filter(x => getAllDesktop.includes(x.desktop_id)), getBasket).length >= 1)
                ) return res.status(404).redirect("/basket")
                const getLinkStripe = (await stripe.checkout.sessions.retrieve(newPayment.stripe_payment_id)).url
                return res.status(200).redirect(getLinkStripe)
            } else res.status(200).redirect(!req.query?.redirect_url ? "/connect/account" : req.query?.redirect_url)
        }
    }
}