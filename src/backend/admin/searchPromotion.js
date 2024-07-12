const { request, response } = require("express")
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE)
const convertTime = require('../../assets/js/function/convertTime')
module.exports = {
    name: "/admin/promotion/:promotionCode/search",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        function rechercheSimilaire(mots, recherche) {
            const resultats = [];
            for (let i = 0; i < mots.length; i++) {
                if (mots[i].code.startsWith(recherche)) {
                    resultats.push(mots[i]);
                }
            }
            return resultats;
        }
        const getAllPromotion = (await stripe.promotionCodes.list({ active: true, limit: 100 })).data.map(x => { return { code: x.code, id: x.id } })
        const approximateResults = rechercheSimilaire(getAllPromotion, req.params.promotionCode.toUpperCase());
        if (!approximateResults[0]) return res.sendStatus(404)
        else {
            let searchPromotion = []
            for (let i = 0; i < approximateResults.slice(0, 10).length; i++) {
                const getPromotion = (await stripe.promotionCodes.list({ active: true, limit: 100 })).data.find(x => x.code === approximateResults[i].code)
                if (!getPromotion) return
                searchPromotion.push({
                    code: getPromotion.code,
                    value: getPromotion.coupon.percent_off ? getPromotion.coupon.percent_off + " %" : (getPromotion.coupon.amount_off / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " €",
                    create_time: convertTime(getPromotion.created * 1000),
                    expire: convertTime(getPromotion.expires_at * 1000),
                    promotion_id: getPromotion.id,
                    firstCommand: getPromotion.restrictions?.first_time_transaction ? "Oui" : "Non",
                    limitRedemption: getPromotion?.max_redemptions ? `Oui (${getPromotion?.max_redemptions})` : "Non",
                    minimumAmount: getPromotion.restrictions?.minimum_amount ? getPromotion.restrictions?.minimum_amount + " EUR" : "Non"
                })
            }
            return res.status(200).json({ promotion: searchPromotion })
        }
    }
}