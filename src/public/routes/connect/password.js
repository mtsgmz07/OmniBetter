const { request, response } = require("express")
const Account = require('../../models/account')
module.exports = {
    name: "/connect/account/edit/password",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        const getAccount = await Account.getAccountByAccountId(req.user.account_id)
        let lastEditPassword = new Date(getAccount.password.last_edit)
        if (Date.now() < lastEditPassword.setHours(lastEditPassword.getHours() + 1)) return res.status(404).render("connect/password", { data: { basket: req?.basket, connect: req?.user, history: await getAccount.getHistoryPassword(), errorForm: { status: true, value: `Votre mot de passe a été modifié récemment.<br>Veuillez patienter avant de pouvoir de nouveau modifier ce dernier.` }, check: { disabled: true } } })
        else return res.status(200).render("connect/password", { data: { history: await getAccount.getHistoryPassword(), connect: req?.user, basket: req?.basket } })
    }
}