const { request, response } = require("express")
const Account = require("../../models/account")
module.exports = {
    name: "/connect/account/edit/email",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        const getAccount = await Account.getAccountByAccountId(req.user.account_id)
        let lastEditEmail = new Date(getAccount.email.last_edit)
        let diffDays = Math.ceil((Math.abs(Date.now() - lastEditEmail.setDate(lastEditEmail.getDate() + 7))) / (1000 * 3600 * 24))
        if (Date.now() < lastEditEmail.setDate(lastEditEmail.getDate() + 7)) return res.status(404).render("connect/email", { data: { connect: req?.user, basket: req?.basket, history: await getAccount.getHistoryEmail(), errorForm: { status: true, value: `Votre email a été modifié récemment. <br> Veuillez patienter ${diffDays} jours avant de pouvoir de nouveau modifier cette dernière.` }, check: { disabled: true } } })
        else return res.status(200).render("connect/email", { data: { history: await getAccount.getHistoryEmail(), connect: req?.user, basket: req?.basket } })
    }
}