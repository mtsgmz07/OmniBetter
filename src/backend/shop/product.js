const { request, response } = require("express")
require('dotenv').config()
const jwt = require('jsonwebtoken')
const Desktop = require('../../public/models/desktop')
const Account = require('../../public/models/account')
module.exports = {
    name: "/shop/product/:desktopId",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        let getDesktop = await Desktop.getDesktopById(req.params.desktopId)
        if (!getDesktop) return res.status(404).render("404", { data: { connect: req?.user, basket: req?.basket } })
        getDesktop = {
            desktop_id: getDesktop.desktop_id,
            quantity: req.body?.quantity ? (!isNaN(Number(req.body?.quantity)) ? (Number(req.body?.quantity) < 10 ? Number(req.body?.quantity) : 10) : 1) : 1,
            assembly: (req.body?.assembly !== "" && !isNaN(Number(req.body?.assembly)) && req.body?.assembly >= 0 && req.body?.assembly <= 3) ? Number(req.body?.assembly) : 0

        }
        if (req?.user) {
            let getAccount = await Account.getAccountByAccountId(req.user.account_id)
            if (!getAccount) return res.status(404).render("404", { data: { connect: req?.user } })
            let basketOfAccount = getAccount.getBasket()
            if (!basketOfAccount[0] || !basketOfAccount.find(x => x.desktop_id === req.params.desktopId && x.assembly === getDesktop.assembly)) getAccount.addBasket(getDesktop)
            else {
                let getQuantity = basketOfAccount.find(x => x.desktop_id === req.params.desktopId && x.assembly === getDesktop.assembly).quantity
                getQuantity === 10 ? getAccount.editQuantity(req.params.desktopId, getDesktop.assembly, 10) : getQuantity + getDesktop.quantity > 10 ? getAccount.editQuantity(req.params.desktopId, getDesktop.assembly, 10) : getAccount.editQuantity(req.params.desktopId, getDesktop.assembly, (getQuantity + getDesktop.quantity))
            }
            let basketOfUser = (getAccount.getBasket()).map(async x => {
                const getDesktop = await Desktop.getDesktopById(x.desktop_id)
                return {
                    id: x.desktop_id,
                    image: getDesktop.image.find(x => x.index === 0),
                    title: getDesktop.title,
                    priceInNumber: getDesktop.price,
                    price: (getDesktop.price / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
                    assembly: getDesktop.getAssembly(x.assembly),
                    assemblyInNumber: x.assembly,
                    quantity: x.quantity,
                    totalAmount: x.assembly === 0 ? (getDesktop.price * x.quantity) : (getDesktop.price * x.quantity) + ((x.assembly === 1 ? 3000 : 5000) * x.quantity)
                }
            })
            return res.status(200).render("basket", { data: { basket: getAccount.getBasket(), connect: req?.user, check: true, basketOfUser: await Promise.all(basketOfUser) } })
        } else {
            jwt.verify(req.cookies["basket"], process.env.JWT, async (err, decoded) => {
                let basketOfUser;
                if (err) {
                    let newJWT = jwt.sign({ basket: [getDesktop] }, process.env.JWT, { expiresIn: 5 * 24 * 60 * 60 * 1000 })
                    res.cookie("basket", newJWT, { maxAge: 5 * 24 * 60 * 60 * 1000, httpOnly: true })
                    basketOfUser = [getDesktop].map(async x => {
                        const getDesktop = await Desktop.getDesktopById(x.desktop_id)
                        return {
                            id: x.desktop_id,
                            image: getDesktop.image.find(x => x.index === 0),
                            title: getDesktop.title,
                            priceInNumber: getDesktop.price,
                            price: (getDesktop.price / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
                            assembly: getDesktop.getAssembly(x.assembly),
                            assemblyInNumber: x.assembly,
                            quantity: x.quantity,
                            totalAmount: x.assembly === 0 ? (getDesktop.price * x.quantity) : (getDesktop.price * x.quantity) + ((x.assembly === 1 ? 3000 : 5000) * x.quantity)
                        }
                    })
                } else {
                    let getBasket = decoded.basket
                    if (!getBasket[0] || !getBasket.find(x => x.desktop_id === req.params.desktopId && x.assembly === getDesktop.assembly)) getBasket.push(getDesktop)
                    else {
                        let getQuantity = getBasket.find(x => x.desktop_id === req.params.desktopId && x.assembly === getDesktop.assembly).quantity
                        getBasket.find(x => x.desktop_id === req.params.desktopId && x.assembly === getDesktop.assembly).quantity = getQuantity === 10 ? 10 : getQuantity + getDesktop.quantity > 10 ? 10 : getQuantity + getDesktop.quantity
                    }
                    let newJWT = jwt.sign({ basket: getBasket }, process.env.JWT, { expiresIn: 432000000 })
                    res.cookie("basket", newJWT, { maxAge: 5 * 24 * 60 * 60 * 1000, httpOnly: true })
                    basketOfUser = getBasket.map(async x => {
                        const getDesktop = await Desktop.getDesktopById(x.desktop_id)
                        return {
                            id: x.desktop_id,
                            image: getDesktop.image.find(x => x.index === 0),
                            title: getDesktop.title,
                            priceInNumber: getDesktop.price,
                            price: (getDesktop.price / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
                            assembly: getDesktop.getAssembly(x.assembly),
                            assemblyInNumber: x.assembly,
                            quantity: x.quantity,
                            totalAmount: getDesktop.price * x.quantity
                        }
                    })
                }
                return res.status(200).render("basket", { data: { basket: basketOfUser, connect: req?.user, check: true, basketOfUser: await Promise.all(basketOfUser) } })
            })
        }
    }
}