const stripe = require('stripe')(process.env.STRIPE)

module.exports = async function (code) {
    const getAllCoupons = (await stripe.promotionCodes.list({ limit: 100, active: true })).data
    console.log(getAllCoupons.find(x => x.code === code) ? true : false);
    return getAllCoupons.find(x => x.code === code) ? true : false
}