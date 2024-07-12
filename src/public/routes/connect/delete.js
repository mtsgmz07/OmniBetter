const { request, response } = require("express")
const DeleteAccount = require("../../models/delete-account")
module.exports = {
    name: "/connect/account/delete/:id",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        const getDeleteAccount = await DeleteAccount.get(req.params.id)
        if (!getDeleteAccount) return res.status(404).redirect("/connect/account")
        if (getDeleteAccount.account_id !== req?.user?.account_id) return res.status(404).redirect("/connect/account")
        if (Date.now() > new Date(getDeleteAccount.expire)) return res.status(404).render("404", { data: { connect: req?.user, basket: req?.basket } })
        return res.status(200).render("connect/delete", { data: { basket: req?.basket } })
    }
}