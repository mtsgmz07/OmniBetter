const mongoose = require('mongoose')
const token = require("../../assets/js/function/generateToken")
const Account = require('./account')
const mail = require('../../assets/js/function/nodemailer')
const deleteAccountSchema = mongoose.Schema({
    deleteAccount_id: String,
    account_id: String,
    expire: { type: Number, default: new Date().setMinutes(new Date().getMinutes() + 10) },
    auto_delete: { type: Number, default: new Date().setDate(new Date().getDate() + 7) }
})

deleteAccountSchema.statics.getAll = async function () {
    const deleteAccounts = await DeleteAccount.find();
    return Array.isArray(deleteAccounts) ? deleteAccounts : [deleteAccounts];
}

deleteAccountSchema.statics.create = async (account_id) => {
    const newDeleteAccount = new DeleteAccount({
        deleteAccount_id: token(),
        account_id,
        create_time: Date.now(),
    }).save()

    const getAccount = await Account.getAccountByAccountId(account_id)
    if (!getAccount) return false

    mail(
        "no-reply",
        getAccount.email.email,
        "Suppression de votre compte",
        "src/public/email/delete-account.ejs",
        { id: (await newDeleteAccount).deleteAccount_id }
    )

    return newDeleteAccount
}

deleteAccountSchema.statics.delete = async (deleteAccount_id) => {
    const findDeleteAccount = await DeleteAccount.findOneAndDelete({ deleteAccount_id })
    return findDeleteAccount
}

deleteAccountSchema.statics.get = async (deleteAccount_id) => {
    const findByAccountId = await DeleteAccount.findOne({ deleteAccount_id })
    if (findByAccountId) return findByAccountId
    else return false
}

deleteAccountSchema.statics.getByAccountId = async (account_id) => {
    const findByAccountId = await DeleteAccount.findOne({ account_id })
    if (findByAccountId) return findByAccountId
    else return false
}

const DeleteAccount = mongoose.model('delete-account', deleteAccountSchema)

module.exports = DeleteAccount