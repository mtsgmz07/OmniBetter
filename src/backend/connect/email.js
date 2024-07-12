const { request, response } = require("express")
const Account = require('../../public/models/account')
module.exports = {
    name: "/connect/account/edit/email",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        if (
            !req.body.inputNewEmail &&
            !req.body.inputPassword
        ) return res.status(404).redirect("/connect/account")

        let value = {
            inputNewEmail: req.body.inputNewEmail
        }

        let isError = false
        let errorForm = {}

        const getAccount = await Account.getAccountByAccountId(req.user.account_id)

        let lastEditEmail = new Date(getAccount.email.last_edit)

        let diffDays = Math.ceil((Math.abs(Date.now() - lastEditEmail.setDate(lastEditEmail.getDate() + 7))) / (1000 * 3600 * 24))

        if (Date.now() < lastEditEmail.setDate(lastEditEmail.getDate() + 7)) return res.status(404).render("connect/email", { data: { history: await getAccount.getHistoryEmail(), errorForm: { status: true, value: `Votre email a été modifié récemment. <br> Veuillez patienter ${diffDays} jours avant de pouvoir de nouveau modifier cette dernière.` }, check: { disabled: true } } })

        if (!/^ [\w -\.] + @([\w -] +\.) +[\w -]{ 2, 4 } $ /.exec(req.body.inputNewEmail)) {
            isError = true
            errorForm.inputNewEmail = "Adresse e-mail invalide"
        }

        if (req.body.inputNewEmail.length > 255) {
            isError = true
            errorForm.inputNewEmail = "L'adresse e-mail doit faire maximum 255 caractères"
        }

        if (await Account.getAccountByEmail(req.body.inputNewEmail)) {
            isError = true
            errorForm.inputNewEmail = "L'adresse e-mail est déjà utilisée sur un autre compte"
        }

        if (!await getAccount.checkPassword(req.body.inputPassword)) {
            isError = true
            errorForm.inputPassword = "Mot de passe invalide"
        }

        if (isError) return res.status(404).render("connect/email", { data: { history: await getAccount.getHistoryEmail(), connect: req.user, value, errorForm } })

        getAccount.editEmail(req.body.inputNewEmail).then(async () => {
            return res.status(200).render("connect/email", { data: { history: await getAccount.getHistoryEmail(), connect: req.user, check: { disabled: true, status: true, value: "Votre email a bien été changé !" } } })
        })
    }
}