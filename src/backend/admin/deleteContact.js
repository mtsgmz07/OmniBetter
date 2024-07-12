const { request, response } = require("express")
const Contact = require('../../public/models/contact')
const mail = require('../../assets/js/function/nodemailer')
module.exports = {
    name: "/admin/contact/delete/:contactId",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        let getContact = await Contact.getContactByContactId(req.params?.contactId)
        if(!getContact) return res.sendStatus(404)
        await Contact.delete(req.params?.contactId).then(() => {
            res.sendStatus(200)
        })
    }
}