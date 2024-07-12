const { request, response } = require("express")
require('dotenv').config()
const Desktop = require('../models/desktop')
const Account = require('../models/account')
const jwt = require('jsonwebtoken')
module.exports = {
    name: "/basket",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        let basketOfUser;
        const getAllDesktop = (await Desktop.getAll()).map(x => x.desktop_id)
        if (req?.user) basketOfUser = (await Account.getAccountByAccountId(req.user.account_id)).getBasket()
        else {
            jwt.verify(req.cookies["basket"], process.env.JWT, async (err, decoded) => {
                if (err) basketOfUser = []
                else basketOfUser = decoded.basket
            })
        }
        basketOfUser = basketOfUser?.filter(x => getAllDesktop.includes(x.desktop_id))?.map(async x => {
            const getDesktop = await Desktop.getDesktopById(x.desktop_id)
            return {
                id: x.desktop_id,
                image: getDesktop.image.find(x => x.index === 0),
                title: getDesktop.title,
                priceInNumber: getDesktop.price,
                price: ((getDesktop.price + (x.assembly === 1 ? 3000 : x.assembly === 2 ? 5000 : 0)) / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
                assembly: getDesktop.getAssembly(x.assembly),
                assemblyInNumber: x.assembly,
                quantity: x.quantity,
                totalAmount: (getDesktop.price * x.quantity) + ((x.assembly === 1 ? 3000 : x.assembly === 2 ? 5000 : 0) * x.quantity)
            }
        })
        if (
            req.query?.id &&
            !isNaN(Number(req.query?.assembly)) &&
            (await Promise.all(basketOfUser)).find(x => x.id === req.query?.id && x.assemblyInNumber === Number(req.query?.assembly))
        ) return res.status(200).render("basket", {
            data:
            {
                basket: req?.basket,
                connect: req?.user,
                basketOfUser: await Promise.all(basketOfUser),
                popup: {
                    assembly: (await Promise.all(basketOfUser)).find(x => x.id === req.query?.id && x.assemblyInNumber === Number(req.query?.assembly)).assembly,
                    assemblyInNumber: (await Promise.all(basketOfUser)).find(x => x.id === req.query?.id && x.assemblyInNumber === Number(req.query?.assembly)).assemblyInNumber,
                    quantity: (await Promise.all(basketOfUser)).find(x => x.id === req.query?.id && x.assemblyInNumber === Number(req.query?.assembly)).quantity,
                    desktop_id: req.query?.id
                }
            }
        })
        return res.status(200).render("basket", { data: { connect: req?.user, basketOfUser: await Promise.all(basketOfUser), basket: req?.basket } })
    }
}