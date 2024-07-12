const { request, response } = require("express")
const DeleteAccount = require('../../public/models/delete-account')
const Account = require('../../public/models/account')
module.exports = {
    name: "/connect/account/delete/:id",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        const getDeleteAccount = await DeleteAccount.get(req.params.id)
        if (!getDeleteAccount) return res.status(404).redirect("/connect/account")
        if(getDeleteAccount.account_id !== req?.user?.account_id) return res.status(404).redirect("/connect/account")
        if (Date.now() > new Date(getDeleteAccount.expire)) return res.status(404).render("404", { data: { connect: req?.user } })
        await Account.delete(req.user.account_id).then(async () => {
            await DeleteAccount.delete(req.params.id).then(() => {
                return res.status(200).render("connect/delete", { data: { popup: { status: true } } })
            })
        })
    }
}