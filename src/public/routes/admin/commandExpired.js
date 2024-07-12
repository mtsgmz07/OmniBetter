const { request, response } = require("express")
const Payment = require('../../models/payment')
require('dotenv').config()
const stripe = require("stripe")(process.env.STRIPE)
const formatDate = require('../../../assets/js/function/formatDate')
module.exports = {
    name: "/admin/command/expired",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        let allPayment = await Promise.all((await Payment.getAll()).filter(x => x.payment_status === 3).map(async x => {
            const getStripePayment = await stripe.checkout.sessions.retrieve(x.stripe_payment_id, {
                expand: ["total_details.breakdown.discounts"],
            }).catch(() => 0)
            const getPromotion = getStripePayment.total_details.breakdown.discounts[0] ?
                await stripe.promotionCodes.retrieve(getStripePayment.total_details.breakdown.discounts[0].discount.promotion_code) :
                null
            const reformItems = x.items.map(x => {
                return {
                    id: x.desktop_id,
                    image: x.image.find(x => x.index === 0),
                    title: x.title,
                    priceInNumber: x.price,
                    price: ((x.price + (x.assembly === 1 ? 3000 : x.assembly === 2 ? 5000 : 0)) / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
                    assembly: x.assemblyInText,
                    assemblyInNumber: x.assemblyInNumber,
                    quantity: x.quantity,
                    totalAmount: ((x.price * x.quantity) + ((x.assembly === 1 ? 3000 : x.assembly === 2 ? 5000 : 0) * x.quantity))
                }
            })
            let totalAmount = (reformItems.reduce((acc, currentItem) => {
                return acc + currentItem.totalAmount;
            }, 0))
            totalAmount = getPromotion ? getPromotion.coupon.percent_off ? totalAmount - (totalAmount * (getPromotion.coupon.percent_off / 100)) : totalAmount - getPromotion.coupon.amount_off : totalAmount
            return {
                id: x.payment_id,
                delivery: `${getStripePayment.customer_details.address.line1}, ${getStripePayment.customer_details.address.city} ${getStripePayment.customer_details.address.postal_code}`,
                totalAmount: (totalAmount / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
                statusInText: x.payment_status === 0 ? "Traitement de la commande" :
                    x.payment_status === 1 ? "Assemblage de l'ordinateur" :
                        x.payment_status === 2 ? "Livraison en cours" :
                            x.payment_status === 3 ? "Livré" : "Status indisponible",
                status: x.payment_status,
                create_time: formatDate(x.create_time),
                items: reformItems
            }
        }))
        res.status(200).render("admin/commandExpired", { data: { connect: req.user, basket: req.basket, allPayment } })
    }
}