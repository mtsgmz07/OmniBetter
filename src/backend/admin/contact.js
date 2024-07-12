const { request, response } = require("express")
const Contact = require('../../public/models/contact')
const mail = require('../../assets/js/function/nodemailer')
module.exports = {
    name: "/admin/contact",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        if (!req.body?.inputResponse || !req.body?.contactId || !await Contact.getContactByContactId(req.body?.contactId)) return res.status(404).redirect("/admin/contact")
        function editFormatText(texte) {
            let formatText = texte.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>');
            return formatText;
        }

        let getContact = await Contact.getContactByContactId(req.body?.contactId)

        mail(
            "support",
            getContact.email,
            "Réponse formulaire contact",
            "src/public/email/responseEmail.ejs",
            { text: editFormatText(req.body?.inputResponse) }
        )

        await Contact.delete(req.body?.contactId).then(() => {
            getContact = {
                name: getContact.name,
                surname: getContact.surname,
                email: getContact.email,
                reason: Contact.getReason(getContact.reason),
                message: getContact.message,
                contact_id: getContact.contact_id
            }
            return res.status(200).render("admin/contact", { data: { basket: req?.basket, contact: getContact, check: true, value: { inputResponse: req.body?.inputResponse } } })
        })
    }
}