const { request, response } = require("express")
const Desktop = require('../../public/models/desktop')
const Account = require('../../public/models/account')
const jwt = require("jsonwebtoken")
module.exports = {
    name: "/basket/edit",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        if ((!req.body?.desktop_id || !req.body?.lastAssembly || !req.body?.assembly || !req.body?.quantity) || !await Desktop.getDesktopById(req.body?.desktop_id)) return res.status(404).json({ error: true, message: "missing parameter or invalid computer identifier" })
        if (req?.user) {
            const getAccount = await Account.getAccountByAccountId(req.user.account_id)
            let getDeskptopInBasket = (getAccount.getBasket()).find(x => x.desktop_id === req.body?.desktop_id && x.assembly === Number(req.body?.lastAssembly))
            if (!getDeskptopInBasket) return res.status(404).json({ error: true, message: "invalid computer identifier" })
            getAccount.editBasket(
                req.body?.desktop_id,
                Number(req.body?.lastAssembly),
                (req.body?.assembly !== "" && !isNaN(Number(req.body?.assembly)) && req.body?.assembly >= 0 && req.body?.assembly <= 3) ? Number(req.body?.assembly) : getDeskptopInBasket.assembly,
                req.body?.quantity ? (!isNaN(Number(req.body?.quantity)) ? (Number(req.body?.quantity) < 10 ? Number(req.body?.quantity) : 10) : getDeskptopInBasket.quantity) : getDeskptopInBasket.quantity
            ).then(() => {
                return res.status(200).json({ success: true })
            })
        }
        else {
            jwt.verify(req.cookies["basket"], process.env.JWT, async (err, decoded) => {
                if (err) return res.status(404).json({ error: true })
                if (decoded) {
                    let getBasket = decoded.basket.find(x => x.desktop_id === req.body?.desktop_id && x.assembly === Number(req.body?.lastAssembly))
                    if (!getBasket) return res.status(404).json({ error: true, message: "invalid computer identifier" })
                    getBasket.assembly = (req.body?.assembly !== "" && !isNaN(Number(req.body?.assembly)) && req.body?.assembly >= 0 && req.body?.assembly <= 3) ? Number(req.body?.assembly) : getBasket.assembly
                    getBasket.quantity = req.body?.quantity ? (!isNaN(Number(req.body?.quantity)) ? (Number(req.body?.quantity) < 10 ? Number(req.body?.quantity) : 10) : getBasket.quantity) : getBasket.quantity
                    let newJWT = jwt.sign({ basket: decoded.basket }, process.env.JWT, { expiresIn: 432000000 })
                    res.cookie("basket", newJWT, { maxAge: 5 * 24 * 60 * 60 * 1000, httpOnly: true })
                    return res.status(200).json({ success: true })
                }
            })
        }
    }
}