const mongoose = require('mongoose')
const token = require("../../assets/js/function/generateToken")
require('dotenv').config()
const contactSchema = mongoose.Schema({
    contact_id: String,
    name: String,
    surname: String,
    email: String,
    reason: Number,
    message: String,
    create_time: { type: Number, default: Date.now() }
})

contactSchema.methods.checkEmail = async function (email) {
    if (this.email === email) return true
    else return false
}

contactSchema.statics.getAll = async function () {
    const contact = await Contact.find();
    return Array.isArray(contact) ? contact : [contact];
}

contactSchema.statics.create = async (name, surname, email, reason, message) => {
    const newContact = new Contact({
        contact_id: token(),
        name: name.trim(),
        surname: surname.trim(),
        email: email.trim(),
        reason,
        message: message.trim(),
    }).save()
    return newContact
}

contactSchema.statics.delete = async (contact_id) => {
    const deleteContact = await Contact.findOneAndDelete({ contact_id })
    return deleteContact
}

contactSchema.statics.getContactByEmail = async (email) => {
    let findEmail = await Contact.findOne({ email })
    if (findEmail) return findEmail
    else return false
}

contactSchema.statics.getContactByContactId = async (contact_id) => {
    let findContactId = await Contact.findOne({ contact_id })
    if (findContactId) return findContactId
    else return false
}

contactSchema.statics.getReason = (reasonNumber) => {
    if (reasonNumber === 0) return "Demande de remboursement"
    else if (reasonNumber === 1) return "Demande de partenariat"
    else if (reasonNumber === 2) return "Ordinateur sur mesure"
    else if (reasonNumber === 3) return "Question sur ma commande"
    else if (reasonNumber === 4) return "Autres"
}

const Contact = mongoose.model('contact', contactSchema)

module.exports = Contact