const { request, response } = require("express")
const Account = require('../../public/models/account')
module.exports = {
    name: "/admin/user/delete/:accountId",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        if ((await Account.getAll()).length === 1) return res.sendStatus(404)
        await Account.delete(req.params.accountId).then(() => {
            res.sendStatus(200)
        })
    }
}