const { request, response } = require("express")
const Account = require('../../public/models/account')
module.exports = {
    name: "/connect/account/edit/password",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        if (
            !req.body.currentPassword &&
            !req.body.newPassword &&
            !req.body.retypePassword
        ) return res.status(404).redirect("/connect/account")

        let value = {
            currentPassword: req.body.currentPassword,
            newPassword: req.body.newPassword
        }

        let isError = false
        let errorForm = {}

        const getAccount = await Account.getAccountByAccountId(req.user.account_id)

        let lastEditPassword = new Date(getAccount.password.last_edit)

        console.log(Date.now() < lastEditPassword.setHours(lastEditPassword.getHours() + 1));
        if (Date.now() < lastEditPassword.setHours(lastEditPassword.getHours() + 1)) return res.status(404).render("connect/password", { data: { history: await getAccount.getHistoryPassword(), errorForm: { status: true, value: `Votre mot de passe a été modifié récemment.<br>Veuillez patienter avant de pouvoir de nouveau modifier ce dernier.` }, check: { disabled: true } } })

        if (!await getAccount.checkPassword(req.body.currentPassword)) {
            isError = true
            errorForm.currentPassword = "Mot de passe invalide"
        }

        if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.exec(req.body.newPassword)) {
            isError = true
            errorForm.newPassword = "Votre mot de passe doit contenir 8 caractères, 1 majuscule, 1 miniscule et 1 chiffre"
        }

        if (req.body.newPassword.length > 25) {
            isError = true
            errorForm.newPassword = "Votre mot de passe doit faire maximum 25 caractères"
        }

        if (req.body.retypePassword !== req.body.newPassword) {
            isError = true
            errorForm.retypePassword = "Les mots de passe ne sont pas identiques"
        }

        if (isError) return res.status(404).render("connect/password", { data: { history: await getAccount.getHistoryPassword(), connect: req.user, value, errorForm } })

        getAccount.editPassword(req.body.newPassword).then(async () => {
            return res.status(200).render("connect/password", { data: { history: await getAccount.getHistoryPassword(), connect: req.user, check: { disabled: true, status: true, value: "Votre mot de passe a bien été changé !" } } })
        })
    }
}