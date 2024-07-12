const { request, response } = require("express")
const DeleteAccount = require('../../public/models/delete-account')
module.exports = {
    name: "/connect/account/delete",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        if (await DeleteAccount.getByAccountId(req.user.account_id)) return res.status(200).render("connect/account", { data: { popup: { status: true, h2: "Demande de suppression rejetée", p: "Une demande de suppression de compte a été faite très récemment, veuillez patienter afin de pouvoir renouveler cette dernière." } } })
        else {
            await DeleteAccount.create(req.user.account_id).then(() => {
                return res.status(200).render("connect/account", { data: { popup: { status: true, h2: "Demande de suppression", p: "Un email a été envoyé a votre adresse e-mail afin de poursuivre les démarches de suppression." } } })
            })
        }
    }
}