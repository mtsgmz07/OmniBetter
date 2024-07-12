const { request, response } = require("express")
const Account = require('../../public/models/account')
const convertTime = require('../../assets/js/function/convertTime')
module.exports = {
    name: "/admin/user",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        if (req.body?.search) {
            function rechercheSimilaire(mots, recherche) {
                const resultats = [];
                for (let i = 0; i < mots.length; i++) {
                    if (mots[i].includes(recherche)) {
                        resultats.push(mots[i]);
                    }
                }
                return resultats;
            }
            const getAllEmail = await (await Account.getAll()).map(x => { return x.email.email })
            const approximateResults = rechercheSimilaire(getAllEmail, req.body.search);
            if (!approximateResults[0]) return res.sendStatus(404)
            else {
                let searchAccount = []
                for (let i = 0; i < approximateResults.slice(0, 10).length; i++) {
                    const getAccount = await Account.getAccountByEmail(approximateResults[i])
                    if (!getAccount) return
                    searchAccount.push({
                        email: getAccount.email.email,
                        account_id: getAccount.account_id,
                        name: getAccount.name,
                        surname: getAccount.surname,
                        create_time: convertTime(getAccount.create_time),
                        role: Account.getRole(getAccount.role)
                    })
                }
                return res.status(200).json({ account: searchAccount })
            }
        } else if (req.body?.popup) {
            let getAccount = await Account.getAccountByAccountId(req.body?.accountId || req.query?.id)
            if (!getAccount || !req.body?.popup || !["editEmail", "editPassword", "editRole"].includes(req.body?.popup)) return res.status(404).redirect("/admin/user")
            getAccount = {
                account_id: getAccount.account_id,
                email: getAccount.email.email,
                name: getAccount.name,
                surname: getAccount.surname,
                create_time: convertTime(getAccount.create_time),
                role: Account.getRole(getAccount.role)
            }
            let data = {
                basket: req?.basket,
                connect: req?.user,
                user: getAccount,
                popup: {
                    title: req.body.popup.replace("editEmail", "Adresse e-mail").replace("editPassword", "Mot de passe").replace("editRole", "Rôle du compte"),
                    check: {},
                    editEmail: req.body.popup === "editEmail" ? {
                        error: {},
                        value: {}
                    } : false,
                    editPassword: req.body.popup === "editPassword" ? {
                        error: {},
                        value: {}
                    } : false,
                    editRole: req.body.popup === "editRole" ? {
                        error: {},
                        value: {}
                    } : false,
                }
            }
            if (req.body?.editEmail) {
                if (!req.body?.inputNewEmail) return res.status(404).render("admin/user", { data })

                if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.exec(req.body?.inputNewEmail)) {
                    data.popup.editEmail.value.inputNewEmail = req.body?.inputNewEmail
                    data.popup.editEmail.error.inputNewEmail = "Adresse e-mail invalide"
                    return res.status(404).render("admin/user", { data })
                }

                if(await Account.getAccountByEmail(req.body?.inputNewEmail)) {
                    data.popup.editEmail.value.inputNewEmail = req.body?.inputNewEmail
                    data.popup.editEmail.error.inputNewEmail = "L'adresse e-mail est déjà utilisée sur un autre compte"
                    return res.status(404).render("admin/user", { data })
                }

                getAccount = await Account.getAccountByAccountId(getAccount.account_id)
                getAccount.editEmail(req.body?.inputNewEmail).then(() => {
                    data.popup.check.status = true
                    data.popup.check.value = "L'adresse email a bien été modifier !"
                    return res.status(200).render("admin/user", { data })
                })
            } else if (req.body?.editPassword) {
                if (!req.body?.inputNewPassword || !req.body?.inputRetypePassword) return res.status(404).render("admin/user", { data })

                let isError = false
                if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.exec(req.body?.inputNewPassword)) {
                    data.popup.editPassword.value.inputNewPassword = req.body?.inputNewPassword
                    data.popup.editEmail.error.inputNewPassword = "Votre mot de passe doit contenir 8 caractères, 1 majuscule, 1 miniscule et 1 chiffre"
                }

                if (req.body?.inputNewPassword !== req.body?.inputRetypePassword) {
                    data.popup.editEmail.error.inputRetypePassword = "Les mots de passe ne sont pas identiques"
                }

                if (isError) return res.status(404).render("admin/user", { data })

                getAccount = await Account.getAccountByAccountId(getAccount.account_id)
                getAccount.editPassword(req.body?.inputNewPassword).then(() => {
                    data.popup.check.status = true
                    data.popup.check.value = "Le mot de passe a bien été modifier !"
                    return res.status(200).render("admin/user", { data })
                })
            } else if (req.body?.editRole) {
                if (!req.body?.inputEditRole || isNaN(Number(req.body?.inputEditRole))) return res.status(404).render("admin/user", { data })

                getAccount = await Account.getAccountByAccountId(getAccount.account_id)
                getAccount.editRole(Number(req.body?.inputEditRole)).then(() => {
                    data.popup.check.status = true
                    data.popup.check.value = "Le rôle du compte a bien été modifier"
                    return res.status(200).render("admin/user", { data })
                })
            } else return res.status(200).render("admin/user", { data })
        }
    }
}