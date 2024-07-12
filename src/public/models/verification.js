const mongoose = require('mongoose')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const mail = require('../../assets/js/function/nodemailer')
const Account = require('./account')
const token = require('../../assets/js/function/generateToken')
const Payment = require('../../public/models/payment')
const Desktop = require('../../public/models/desktop')
const compareArray = require("../../assets/js/function/compareArray")
const stripe = require('stripe')(process.env.STRIPE)
const verificationSchema = mongoose.Schema({
    verification_id: String,
    account_id: String,
    code: String,
    redirect_url: String,
    use: { type: Number, default: 1 },
    expire: { type: Number, default: new Date().setMinutes(new Date().getMinutes() + 10) }
})

verificationSchema.methods.sendMail = async function () {
    const getAccount = await Account.getAccountByAccountId(this.account_id)
    if (!getAccount || this.use === 3) return false
    this.use = this.use + 1
    this.save()
    mail(
        "no-reply",
        getAccount.email.email,
        "Vérification de votre adresse e-mail",
        "src/public/email/verification.ejs",
        { code: this.code }
    )
    return true
}

verificationSchema.statics.getAll = async function () {
    const verifications = await Verification.find();
    return Array.isArray(verifications) ? verifications : [verifications];
}

verificationSchema.statics.create = async (account_id, redirect_url) => {
    function generate_code() {
        let codeArray = []
        for (let i = 0; i < 6; i++) {
            codeArray.push(Math.floor(Math.random() * 10))
        }
        return codeArray.join("")
    }
    const newVerification = new Verification({
        account_id,
        verification_id: token(),
        code: generate_code(),
        redirect_url,
        create_time: Date.now()
    }).save()

    const getAccount = await Account.getAccountByAccountId(account_id)

    mail(
        "no-reply",
        getAccount.email.email,
        "Vérification de votre adresse e-mail",
        "src/public/email/verification.ejs",
        { code: (await newVerification).code }
    )

    return newVerification
}

verificationSchema.statics.delete = async (verification_id) => {
    const deleteVerification = await Verification.findOneAndDelete({ verification_id })
    return deleteVerification
}

verificationSchema.statics.get = async (verification_id) => {
    const getVerification = await Verification.findOne({ verification_id })
    if (getVerification) return getVerification
    else return false
}

verificationSchema.statics.getByAccountId = async (account_id) => {
    const getVerification = await Verification.findOne({ account_id })
    if (getVerification) return getVerification
    else return false
}

verificationSchema.statics.check = async (verification_id, code, res, req) => {
    return new Promise(async resolve => {
        const checkVerification = await Verification.findOne({ verification_id })
        if (!checkVerification) return resolve(false)
        if (checkVerification && checkVerification.code !== code) return false
        const findAccount = await Account.getAccountByAccountId(checkVerification.account_id)
        if (!findAccount) return resolve(false)
        findAccount.role = 1
        res.cookie("authorization", await findAccount.setJwtToken(), { maxAge: 5 * 24 * 60 * 60 * 1000, httpOnly: true })
        jwt.verify(req.cookies["basket"], process.env.JWT, async (err, decoded) => {
            if (decoded) {
                findAccount.saveBasket(decoded.basket)
                res.clearCookie("basket")
            }
        })
        await Verification.findOneAndDelete({ verification_id })
        if (checkVerification.redirect_url === "checkout") {
            const getAllDesktop = (await Desktop.getAll()).map(x => x.desktop_id)
            const getBasket = findAccount.getBasket()
            const newPayment = await Payment.create(getBasket, findAccount.account_id)
            if (
                (!getBasket || !newPayment || !getBasket[0]) ||
                (compareArray(getBasket.filter(x => getAllDesktop.includes(x.desktop_id)), getBasket).length >= 1)
            ) return resolve("/basket")
            const getLinkStripe = (await stripe.checkout.sessions.retrieve(newPayment.stripe_payment_id)).url
            return resolve(getLinkStripe)
        }
        return resolve(checkVerification.redirect_url)
    })
}

const Verification = mongoose.model('verifications', verificationSchema)

module.exports = Verification
