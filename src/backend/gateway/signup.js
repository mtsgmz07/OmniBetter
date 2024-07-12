const { request, response } = require("express")
const Account = require('../../public/models/account')
const Verification = require('../../public/models/verification')
module.exports = {
    name: "/signup",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        if (
            !req.body?.inputName ||
            !req.body?.inputSurname ||
            !req.body?.inputEmail ||
            !req.body?.isoPhone ||
            !req.body?.inputPhone ||
            !req.body?.inputPassword ||
            !req.body?.inputRetype ||
            !req.body?.checkboxCondition
        ) return res.status(404).render("gateway/signup", { data: {} })

        let value = {
            inputName: req.body?.inputName,
            inputSurname: req.body?.inputSurname,
            inputEmail: req.body?.inputEmail,
            isoPhone: req.body?.isoPhone,
            inputPhone: req.body?.inputPhone,
            inputPassword: req.body?.inputPassword,
        }

        let errorInForm = false
        let errorObject = {}

        if (
            req.body?.inputName.length < 3 ||
            req.body?.inputName.length > 50
        ) {
            errorInForm = true
            errorObject.inputName = "Ce champ doit contenir entre 3 et 50 caractères"
        }

        if (
            req.body?.inputSurname.length < 3 ||
            req.body?.inputSurname.length > 50
        ) {
            errorInForm = true
            errorObject.inputSurname = "Ce champ doit contenir entre 3 et 50 caractères"
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.exec(req.body?.inputEmail)) {
            errorInForm = true
            errorObject.inputEmail = "Adresse e-mail invalide"
        }

        if (req.body?.inputEmail.length > 250) {
            errorInForm = true
            errorObject.inputEmail = "L'adresse e-mail doit faire maximum 255 caractères"
        }


        if (await Account.getAccountByEmail(req.body?.inputEmail)) {
            errorInForm = true
            errorObject.inputEmail = "Adresse e-mail déjà utilisé"
        }

        const phoneNumberInputValue = req.body?.inputPhone
        const selectedCountryValue = req.body?.isoPhone;
        const frenchRegex = /^(?:(?:(?:\+|00)33[ ]?(?:\(0\)[ ]?)?)|0){1}[1-9]{1}([ .-]?)(?:\d{2}\1?){3}\d{2}$/;
        const isFrenchNumber = frenchRegex.exec(phoneNumberInputValue) && (selectedCountryValue === "fr");
        const belgianRegex = /^[0-9]{2}[.\- ]{0,1}[0-9]{2}[.\- ]{0,1}[0-9]{2}[.\- ]{0,1}[0-9]{3}[.\- ]{0,1}[0-9]{2}$/;
        const isBelgianNumber = belgianRegex.exec(phoneNumberInputValue) && (selectedCountryValue === "be");
        const swissRegex = /^([0][1-9][0-9](\s|)[0-9][0-9][0-9](\s|)[0-9][0-9](\s|)[0-9][0-9])$|^(([0][0]|\+)[1-9][0-9](\s|)[0-9][0-9](\s|)[0-9][0-9][0-9](\s|)[0-9][0-9](\s|)[0-9][0-9])$/;
        const isSwissNumber = swissRegex.exec(phoneNumberInputValue) && (selectedCountryValue === "ch");

        if (req.body?.inputPassword.length > 15) {
            errorInForm = true
            errorObject.inputPhone = "Numéro de téléphone doit faire maximum 10 caractères"
        }

        if (
            (!isFrenchNumber && selectedCountryValue === "fr") ||
            (!isBelgianNumber && selectedCountryValue === "be") ||
            (!isSwissNumber && selectedCountryValue === "ch")
        ) {
            errorInForm = true
            errorObject.inputPhone = "Numéro de téléphone invalide"
        }

        if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.exec(req.body?.inputPassword)) {
            errorInForm = true
            errorObject.inputPassword = "Votre mot de passe doit contenir 8 caractères, 1 majuscule, 1 miniscule et 1 chiffre"
        }

        if (req.body?.inputPassword.length > 25) {
            errorInForm = true
            errorObject.inputPassword = "Votre mot de passe doit faire maximum 25 caractères"
        }

        if (req.body?.inputPassword !== req.body?.inputRetype) {
            errorInForm = true
            errorObject.inputPassword = "Les mots de passe ne sont pas identiques"
        }

        if (errorInForm) return res.status(404).render("gateway/signup", { data: { value, error: errorObject, redirect_url: !req.query?.redirect_url ? "/connect/account" : req.query?.redirect_url } })

        await Account.create(
            req.body.inputEmail,
            req.body.inputPassword,
            req.body.inputName,
            req.body.inputSurname
        ).then(async (newAccount) => {
            await Verification.create(newAccount.account_id, !req.query?.redirect_url ? "/connect/account" : req.query?.redirect_url).then((newVerification) => {
                res.status(200).redirect(`/verification?id=${newVerification.verification_id}`)
            })
                .catch((err) => {
                    console.log(err);
                })
        })
    }
}