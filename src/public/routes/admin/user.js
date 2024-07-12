const { request, response } = require("express")
const Account = require('../../models/account')
const convertTime = require('../../../assets/js/function/convertTime')
module.exports = {
    name: "/admin/user",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        if (req.query?.id && await Account.getAccountByAccountId(req.query?.id)) {
            let getAccount = await Account.getAccountByAccountId(req.query?.id)
            if (!getAccount) return res.status(404).render("admin/user", { data: { connect: req?.user, basket: req?.basket } })
            getAccount = {
                account_id: getAccount.account_id,
                email: getAccount.email.email,
                name: getAccount.name,
                surname: getAccount.surname,
                create_time: convertTime(getAccount.create_time),
                role: Account.getRole(getAccount.role)
            }
            return res.status(200).render("admin/user", { data: { connect: req?.user, user: getAccount, basket: req?.basket } })
        } else {
            let getAllAccount = await (await Account.getAll()).map(x => {
                return {
                    account_id: x.account_id,
                    email: x.email.email,
                    name: x.name,
                    surname: x.surname,
                    create_time: convertTime(x.create_time),
                    role: Account.getRole(x.role),
                    roleInNumber: x.role
                }
            })
            let filter = {}
            if (Number(req.query?.filter) >= 0 && Number(req.query?.filter) <= 3) {
                filter.type = req.query?.filter
                getAllAccount = getAllAccount.filter(x => x.roleInNumber === Number(req.query?.filter))
            }
            if (getAllAccount.length <= 10) return res.status(200).render("admin/user", { data: { basket: req?.basket, filter, connect: req?.user, totalEmail: getAllAccount.length, account: getAllAccount } })
            else {
                let maxPage = Number((getAllAccount.length / 10).toFixed())
                let page = isNaN(Number(req.query.page)) ? 0 : Number(req.query.page) > maxPage ? 0 : Number(req.query.page)
                return res.status(200).render("admin/user", { data: { basket: req?.basket, filter, connect: req?.user, totalEmail: getAllAccount.length, account: getAllAccount.slice(page * 10, (page * 10) + 10), arrow: { minus: page !== 0 ? page - 1 : 0, plus: page !== maxPage ? page + 1 : maxPage, end: maxPage } } })
            }
        }
    }
}