const { request, response } = require("express")
require('dotenv').config()
const Desktop = require('../../public/models/desktop')
const Account = require('../../public/models/account')
const jwt = require('jsonwebtoken')
module.exports = {
    name: "/basket/delete",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        if ((!req.body?.desktop_id || !req.body?.assembly) || !await Desktop.getDesktopById(req.body?.desktop_id)) return res.status(404).json({ error: true })
        if (req?.user) {
            (await Account.getAccountByAccountId(req.user.account_id)).removeBasket(req.body?.desktop_id, req.body?.assembly)
            return res.status(200).json({ success: true })
        }
        else {
            jwt.verify(req.cookies["basket"], process.env.JWT, async (err, decoded) => {
                if (err) return res.status(404).json({ error: true })
                if (decoded) {
                    let getBasket = decoded.basket.filter(x => x.desktop_id !== req.body?.desktop_id || x.assembly !== Number(req.body?.assembly))
                    let newJWT = jwt.sign({ basket: getBasket }, process.env.JWT, { expiresIn: 432000000 })
                    res.cookie("basket", newJWT, { maxAge: 5 * 24 * 60 * 60 * 1000, httpOnly: true })
                    return res.status(200).json({ success: true })
                }
            })
        }
    }
}