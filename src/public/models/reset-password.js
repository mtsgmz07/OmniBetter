const mongoose = require('mongoose')
const mail = require('../../assets/js/function/nodemailer')
const Account = require('./account')
const token = require('../../assets/js/function/generateToken')
const resetPasswordSchema = mongoose.Schema({
    resetPassword_id: String,
    account_id: String,
    expires: Number
})

resetPasswordSchema.statics.getAll = async function () {
    const resetPassword = await ResetPassword.find();
    return Array.isArray(resetPassword) ? resetPassword : [resetPassword];
}

resetPasswordSchema.statics.create = async (account_id) => {
    const newResetPassword = new ResetPassword({
        resetPassword_id: token(),
        account_id,
        expires: new Date().setMinutes(new Date().getMinutes() + 10)
    }).save()

    const getAccount = await Account.getAccountByAccountId(account_id)
    
    mail(
        "no-reply",
        getAccount.email.email,
        "Changement de votre mot de passe",
        "src/public/email/reset-password.ejs",
        { resetPasswordId: (await newResetPassword).resetPassword_id }
    )

    return newResetPassword
}

resetPasswordSchema.statics.delete = async (resetPassword_id) => {
    const deleteResetPassword = await ResetPassword.findOneAndDelete({ resetPassword_id })
    return deleteResetPassword
}

resetPasswordSchema.statics.get = async (resetPassword_id) => {
    const getResetPassword = await ResetPassword.findOne({ resetPassword_id })
    if (getResetPassword) return getResetPassword
    else return false
}

resetPasswordSchema.statics.getByAccountId = async (account_id) => {
    const getResetPassword = await ResetPassword.findOne({ account_id })
    if (getResetPassword) return getResetPassword
    else return false
}

const ResetPassword = mongoose.model('reset-password', resetPasswordSchema)

module.exports = ResetPassword
