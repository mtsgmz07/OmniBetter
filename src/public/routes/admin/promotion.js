require('dotenv').config()
const { request, response } = require("express")
const stripe = require('stripe')(process.env.STRIPE)
const convertTime = require('../../../assets/js/function/convertTime')
module.exports = {
    name: "/admin/promotion",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        let getAllPromitions = (await stripe.promotionCodes.list({
            limit: 100,
            active: true
        })).data.map(x => {
            return {
                code: x.code,
                value: x.coupon.percent_off ? x.coupon.percent_off + " %" : (x.coupon.amount_off / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " €",
                create_time: convertTime(x.created * 1000),
                expire: convertTime(x.expires_at * 1000),
                promotion_id: x.id,
                firstCommand: x.restrictions?.first_time_transaction ? "Oui" : "Non",
                limitRedemption: x?.max_redemptions ? `Oui (${x?.max_redemptions})` : "Non",
                minimumAmount: x.restrictions?.minimum_amount ? x.restrictions?.minimum_amount + " EUR" : "Non"
            }
        })
        let filter = {}
        if (Number(req.query?.filter) >= 0 && Number(req.query?.filter) <= 1) {
            filter.type = req.query?.filter
            getAllPromitions = getAllPromitions.filter(x => x.roleInNumber === Number(req.query?.filter))
        }
        if (req.query.create) return res.status(200).render("admin/promotion", { data: { basket: req?.basket, connect: req?.user, popup: true, totalPromotion: getAllPromitions.length, allPromotion: getAllPromitions.slice(0, 10) } })
        if (getAllPromitions.length <= 10) return res.status(200).render("admin/promotion", { data: { filter, connect: req?.user, totalPromotion: getAllPromitions.length, allPromotion: getAllPromitions } })
        else {
            let maxPage = Number((getAllPromitions.length / 10).toFixed())
            let page = isNaN(Number(req.query.page)) ? 0 : Number(req.query.page) > maxPage ? 0 : Number(req.query.page)
            return res.status(200).render("admin/promotion", { data: { basket: req?.basket, connect: req?.user, totalPromotion: getAllPromitions.length, allPromotion: getAllPromitions.slice(page * 10, (page * 10) + 10), arrow: { minus: page !== 0 ? page - 1 : 0, plus: page !== maxPage ? page + 1 : maxPage, end: maxPage } } })
        }
    }
}