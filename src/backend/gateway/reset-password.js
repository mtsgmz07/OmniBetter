const { request, response } = require("express")
const Account = require('../../public/models/account')
const ResetPassword = require('../../public/models/reset-password')
module.exports = {
    name: "/reset-password",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        if (req.body.submitButton === "sendReset") {
            if (!req.body?.inputEmail) return res.status(404).render("gateway/reset-password", { data: { error: { status: true, value: "Une erreur vient de se produire, veuillez ressayer ultérieurement" } } })
            let value = {
                inputEmail: req.body?.inputEmail
            }
            const getAccount = await Account.getAccountByEmail(req.body?.inputEmail)
            if (!getAccount) return res.status(404).render("gateway/reset-password", { data: { value, error: { status: true, value: "Aucun compte n'est associé a cette adresse e-mail" } } })
            if (
                await ResetPassword.getByAccountId(getAccount.account_id) ||
                Date.now() < new Date(getAccount.password.last_edit).setHours(new Date(getAccount.password.last_edit).getHours() + 1)
            ) return res.status(404).render("gateway/reset-password", { data: { error: { status: true, value: "Un email a déjà été envoyé récemment, veuillez ressayez ultérieurement" } } })
            await ResetPassword.create(getAccount.account_id).then(() => {
                res.status(200).render("gateway/reset-password", { data: { check: { status: true, value: `L'email contenant le lien pour changer votre mot de passe a bien été envoyé !` } } })
            })
        } else if (req.body.submitButton === "editPassword") {
            if (
                !req.body.resetPasswordId ||
                !req.body.inputPassword ||
                !req.body.inputRetype
            ) return res.status(404).redirect("/reset-password")

            if (!await ResetPassword.get(req.body?.resetPasswordId)) return res.status(404).redirect("/reset-password")

            let value = {
                inputPassword: req.body.inputPassword
            }
            let id = req.body.resetPasswordId

            if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.exec(req.body.inputPassword)) return res.status(404).render("gateway/reset-password", { data: { id, value, error: { inputPassword: { status: true, value: "Votre mot de passe doit contenir 8 caractères, 1 majuscule, 1 miniscule et 1 chiffre" } } } })

            if (req.body.inputPassword.length > 25) return res.status(404).render("gateway/reset-password", { data: { id, value, error: { inputPassword: { status: true, value: "Votre mot de passe ne doit pas faire plus de 25 caractères" } } } })

            if (req.body.inputPassword !== req.body.inputRetype) return res.status(404).render("gateway/reset-password", { data: { id, value, error: { inputRetype: { status: true, value: "Les mots de passe ne sont pas identiques" } } } })

            await ResetPassword.get(req.body.resetPasswordId)
                .then(async (getAccount) => {
                    await getAccount.editPassword(req.body.inputPassword)
                        .then(async () => {
                            await ResetPassword.delete(req.body.resetPasswordId)
                            return res.status(200).render("gateway/reset-password", { data: { id, check: { status: true, disabled: true, value: "Votre mot de passe a bien été changé !" } } })
                        })
                        .catch((err) => {
                            console.log(err);
                            return res.status(404).redirect("/reset-password")
                        })
                })

        } else return res.status(404).render("gateway/reset-password", { data: {} })
    }
}