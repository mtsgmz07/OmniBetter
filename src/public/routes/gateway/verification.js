const { request, response } = require("express")
const Account = require('../../models/account')
const Verification = require('../../models/verification')
module.exports = {
    name: "/verification",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        if (req.query?.id && await Verification.get(req.query?.id)) {
            const account_email = await Account.getAccountByAccountId((await Verification.get(req.query?.id)).account_id)
            return res.status(200).render("gateway/verification",
                {
                    data: {
                        value: {
                            email: account_email.email.email,
                            id: req.query?.id
                        },
                        connect: req?.user
                    }
                })
        } else return res.status(404).redirect("/signup")
    }
}