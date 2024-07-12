const { request, response } = require("express")
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE)
const checkCodeStripe = require('../../assets/js/function/checkCodeStripe')
module.exports = {
    name: "/admin/promotion/:promotionId/delete",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        const fetchPromotion = (await stripe.promotionCodes.list({ limit: 100, active: true })).data.find(x => x.id === req.params.promotionId)
        if (!fetchPromotion) return res.status(404).json({ error: true })
        const deletePromotion = await stripe.coupons.del(fetchPromotion.coupon.id);
        if (!deletePromotion) return res.status(404).json({ error: true })
        return res.status(200).json({ success: true })
    }
}