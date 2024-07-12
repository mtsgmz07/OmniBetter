const { request, response } = require("express")
const Contact = require('../../public/models/contact')
const mail = require('../../assets/js/function/nodemailer')
module.exports = {
    name: "/contact",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        if (
            !req.body.inputName &&
            !req.body.inputSurname &&
            !req.body.inputEmail &&
            !req.body.inputReason &&
            !req.body.inputMessage
        ) return res.status(404).render("contact", { data: { connect: req?.user, basket: req?.basket } })

        let isError = false
        let errorForm = {}
        let value = {
            inputName: req.body.inputName,
            inputSurname: req.body.inputSurname,
            inputEmail: req.body.inputEmail,
            inputMessage: req.body.inputMessage
        }

        if (req.body.inputName.length < 3 && req.body.inputName.length > 50) {
            isError = true
            errorForm.inputName = "Ce champ doit contenir entre 3 et 50 caractères"
        }

        if (req.body.inputSurname.length < 3 && req.body.inputSurname.length > 50) {
            isError = true
            errorForm.inputSurname = "Ce champ doit contenir entre 3 et 50 caractères"
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.exec(req.body.inputEmail)) {
            isError = true
            errorForm.inputEmail = "Adresse e-mail invalide"
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.exec(req.body.inputEmail)) {
            isError = true
            errorForm.inputEmail = "Adresse e-mail invalide"
        }

        if (req.body.inputEmail.length > 255) {
            isError = true
            errorForm.inputEmail = "Votre adresse email doit faire maximum 255 caractères"
        }

        if (isNaN(Number(req.body.inputReason)) || (Number(req.body.inputReason) < 0 && Number(req.body.inputReason) > 3)) {
            isError = true
            errorForm.inputReason = "Veuillez sélectionner une raison de contact"
        }

        if (req.body.inputMessage.length > 2048) {
            isError = true
            errorForm.inputMessage = "Votre message doit faire maximum 2048 caractères"
        }

        if (isError) return res.status(404).render("contact", { data: { errorForm, value } })

        if (await Contact.getContactByEmail(req.body.inputEmail)) return res.status(200).render("contact", { data: { connect: req?.user, error: { status: true, value: "Un formulaire de contact est déjà en cours de traitement avec l'email que vous souhaitez utiliser." } } })

        await Contact.create(
            req.body.inputName,
            req.body.inputSurname,
            req.body.inputEmail,
            Number(req.body.inputReason),
            req.body.inputMessage
        ).then(() => {
            mail(
                "no-reply",
                req.body.inputEmail,
                "Formulaire de contact",
                "src/public/email/confirmSendEmail.ejs",
                {}
            )
            return res.status(200).render("contact", { data: { basket: req?.basket, connect: req?.user, check: { disabled: true, status: true } } })
        })
    }
}