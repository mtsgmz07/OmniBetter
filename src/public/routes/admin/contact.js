const { request, response } = require("express")
const Contact = require('../../models/contact')
const convertTime = require('../../../assets/js/function/convertTime')
module.exports = {
    name: "/admin/contact",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        if (req.query?.id && await Contact.getContactByContactId(req.query?.id)) {
            let getContact = await Contact.getContactByContactId(req.query?.id)
            if (!getContact) return res.status(200).render("admin/contact", { data: { connect: req?.user, basket: req?.basket } })
            getContact = {
                name: getContact.name,
                surname: getContact.surname,
                email: getContact.email,
                reason: Contact.getReason(getContact.reason),
                message: getContact.message,
                contact_id: getContact.contact_id
            }
            return res.status(200).render("admin/contact", { data: { connect: req?.user, contact: getContact, basket: req?.basket } })
        } else {
            const getAllContact = await (await Contact.getAll()).map(x => {
                return {
                    contact_id: x.contact_id,
                    email: x.email,
                    create_time: convertTime(x.create_time),
                    message: x.message.length > 200 ? x.message.slice(0, 200) + " ..." : x.message,
                    reason: Contact.getReason(x.reason)
                }
            })
            if (getAllContact.length <= 10) return res.status(200).render("admin/contact", { data: { connect: req?.user, totalEmail: getAllContact.length, email: getAllContact, basket: req?.basket } })
            else {
                let maxPage = Number((getAllContact.length / 10).toFixed())
                let page = isNaN(Number(req.query.page)) ? 0 : Number(req.query.page) > maxPage ? 0 : Number(req.query.page)
                return res.status(200).render("admin/contact", { data: { basket: req?.basket, connect: req?.user, totalEmail: getAllContact.length, email: getAllContact.slice(page * 10, (page * 10) + 10), arrow: { minus: page !== 0 ? page - 1 : 0, plus: page !== maxPage ? page + 1 : maxPage, end: maxPage } } })
            }
        }
    }
}