const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")
const token = require("../../assets/js/function/generateToken")
require('dotenv').config()
const stripe = require("stripe")(process.env.STRIPE)
const compareArray = require('../../assets/js/function/compareArray')
const Desktop = require('./desktop')
const accountSchema = mongoose.Schema({
    account_id: String,
    stripe_account_id: String,
    email: Object,
    password: Object,
    name: { type: String, default: "" },
    surname: { type: String, default: "" },
    basket: { type: Array, default: [] },
    create_time: Number,
    last_connexion: Number,
    authToken: { type: String, default: null },
    role: { type: Number, default: 0 }
})

accountSchema.methods.clearBasket = async function () {
    this.basket = []
    this.save()
    return this
}

accountSchema.methods.checkBasket = async function () {
    const getAllDesktop = (await Desktop.getAll()).map(x => x.desktop_id)
    if (compareArray(this.basket.filter(x => getAllDesktop.includes(x.desktop_id)), this.basket)) {
        this.basket = this.basket.filter(x => getAllDesktop.includes(x.desktop_id))
        this.save()
    }
    return this
}

accountSchema.methods.addBasket = function (desktop) {
    this.basket.push(desktop)
    this.save()
    return this
}

accountSchema.methods.removeBasket = function (desktop_id, assembly) {
    this.basket = this.basket.filter(x => x.desktop_id !== desktop_id || x.assembly !== Number(assembly));
    this.save()
    return this
}

accountSchema.methods.editBasket = async function (desktop_id, lastAssembly, assembly, quantity) {
    const basket = this.basket.map(item => {
        if (item.desktop_id === desktop_id && item.assembly === lastAssembly) {
            return {
                ...item,
                assembly: assembly,
                quantity: quantity
            };
        }
        return item;
    });

    this.basket = basket;
    await this.save();
    return this;
};

accountSchema.methods.getBasket = function () {
    return this.basket
}

accountSchema.methods.editQuantity = async function (desktop_id, assembly, quantity) {
    const basket = this.basket.map(item => {
        if (item.desktop_id === desktop_id && item.assembly === assembly) {
            return {
                ...item,
                quantity: quantity
            };
        }
        return item;
    });

    this.basket = basket;
    await this.save();
    return this;
};

accountSchema.methods.saveBasket = function (newBasket) {
    this.basket = newBasket
    this.save()
    return this
}

accountSchema.methods.setJwtToken = async function () {
    const authToken = jwt.sign({ account_id: this.account_id }, process.env.JWT, { expiresIn: 432000000 })
    this.authToken = authToken
    await this.save()
    return authToken
}

accountSchema.methods.checkEmail = async function (email) {
    if (this.email.email === email) return true
    else return false
}

accountSchema.methods.checkPassword = async function (password) {
    if (await bcrypt.compare(password, this.password.password)) return true
    else return false
}

accountSchema.methods.editEmail = async function (newEmail) {
    let newHistory = this.email.history
    newHistory.push({ create_time: Date.now(), email: newEmail })
    this.email = {
        email: newEmail,
        last_edit: Date.now(),
        last_edit_admin: this.email.last_edit_admin,
        history: newHistory
    }
    this.save()
    return this
}

accountSchema.methods.editPassword = async function (newPassword) {
    let newHistory = (this.password.history)
    newHistory.push({ create_time: Date.now() })
    this.password = {
        password: await bcrypt.hash(newPassword.trim(), 8),
        last_edit: Date.now(),
        last_edit_admin: this.password.last_edit_admin,
        history: newHistory
    }
    this.save()
    return true
}

accountSchema.methods.editRole = async function (newRole) {
    this.role = newRole
    this.save()
    return true
}

accountSchema.methods.getHistoryEmail = async function () {
    return this.email.history
}

accountSchema.methods.getHistoryPassword = async function () {
    return this.password.history
}

accountSchema.statics.getAll = async function () {
    const accounts = await Account.find();
    return Array.isArray(accounts) ? accounts : [accounts];
}

accountSchema.statics.create = async (email, password, name, surname) => {
    const stripeAccountId = await stripe.customers.create({
        name: `${surname} ${name}`,
        email: email.trim(),
    });
    const newAccount = new Account({
        account_id: token(),
        stripe_account_id: stripeAccountId.id,
        email: {
            email: email.trim(),
            last_edit: Date.now(),
            last_edit_admin: Date.now(),
            history: []
        },
        password: {
            password: await bcrypt.hash(password.trim(), 8),
            last_edit: Date.now(),
            last_edit_admin: Date.now(),
            history: []
        },
        name: name.trim(),
        surname: surname.trim(),
        create_time: Date.now(),
        last_connexion: Date.now()
    }).save()
    return newAccount
}

accountSchema.statics.connect = async (email, password) => {
    const findEmail = await Account.findOne({ "email.email": email })
    if (!findEmail) return false
    if (!await bcrypt.compare(password, findEmail.password.password)) return { status: 0 }
    if (findEmail.role === 0) return { status: 1, account_id: findEmail.account_id }
    return { status: 2, account_id: findEmail.account_id }
}

accountSchema.statics.delete = async (account_id) => {
    const deleteAccount = await Account.findOneAndDelete({ account_id })
    return deleteAccount
}

accountSchema.statics.getAccountByEmail = async (email) => {
    let findEmail = await Account.findOne({ "email.email": email })
    if (findEmail) return findEmail
    else return false
}

accountSchema.statics.getAccountByAccountId = async (account_id) => {
    let findAccountId = await Account.findOne({ account_id })
    if (findAccountId) return findAccountId
    else return false
}

accountSchema.statics.checkJwt = async (account_id, jwtToken) => {
    const findAccountId = await Account.findOne({ account_id })
    if (!findAccountId || findAccountId.authToken !== jwtToken) return false
    else return true
}

accountSchema.statics.getRole = (role) => {
    if (role === 0) return "Non vérifié"
    else if (role === 1) return "Client"
    else if (role === 2) return "Administrateur"
}

const Account = mongoose.model('account', accountSchema)

module.exports = Account