const { request, response } = require("express")
const Payment = require('../../models/payment')
require('dotenv').config()
const stripe = require("stripe")(process.env.STRIPE)
const formatDate = require('../../../assets/js/function/formatDate')
module.exports = {
    name: "/admin/command/manage/:paymentId",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        const findPayment = await Payment.getPaymentById(req.params?.paymentId)
        if (!findPayment) return res.status(404).render("404", { data: { connect: req.user, basket: req.basket } })
        const getStripePayment = await stripe.checkout.sessions.retrieve(findPayment.stripe_payment_id,
            {
                expand: ["total_details.breakdown.discounts"],
            }
        ).catch(() => 0)
        if (!getStripePayment) return res.status(404).render("404", { data: { connect: req.user, basket: req.basket } })
        const getPromotion = getStripePayment.total_details.breakdown.discounts[0] ?
            await stripe.promotionCodes.retrieve(getStripePayment.total_details.breakdown.discounts[0].discount.promotion_code) :
            null
        const reformItems = findPayment.items.map(x => {
            return {
                id: x.desktop_id,
                title: x.title,
                priceInNumber: x.price,
                price: ((x.price + (x.assembly === 1 ? 3000 : x.assembly === 2 ? 5000 : 0)) / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
                assemblyInText: x.assemblyInText,
                assemblyInNumber: x.assemblyInNumber,
                quantity: x.quantity,
                totalAmount: ((x.price * x.quantity) + ((x.assembly === 1 ? 3000 : x.assembly === 2 ? 5000 : 0) * x.quantity)),
                totalAmountInText: ((((x.price * x.quantity) + ((x.assembly === 1 ? 3000 : x.assembly === 2 ? 5000 : 0) * x.quantity))) / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
                config: x.config
            }
        })
        let totalAmount = (reformItems.reduce((acc, currentItem) => {
            return acc + currentItem.totalAmount;
        }, 0))
        totalAmount = getPromotion ? getPromotion.coupon.percent_off ? totalAmount - (totalAmount * (getPromotion.coupon.percent_off / 100)) : totalAmount - getPromotion.coupon.amount_off : totalAmount
        const command = {
            payment_id: req.params?.paymentId,
            payment_status_number: findPayment.payment_status,
            payment_status: findPayment.payment_status === 0 ? "Traitement de la commande" :
                findPayment.payment_status === 1 ? "Assemblage de l'ordinateur" :
                    findPayment.payment_status === 2 ? "Livraison en cours" :
                        findPayment.payment_status === 3 ? "Livré" : "Status indisponible",
            delivery: `${getStripePayment.customer_details.address.line1}, ${getStripePayment.customer_details.address.city} ${getStripePayment.customer_details.address.postal_code}`,
            totalAmount: (totalAmount / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
            code: findPayment.payment_promotion,
            items: reformItems,
            phone: getStripePayment.customer_details.phone,
            code: getPromotion ? `${getPromotion.code} (${getPromotion.coupon.percent_off ? getPromotion.coupon.percent_off + "%" : getPromotion.coupon.amount_off + " €"})` : "Aucun",
            name: getStripePayment.customer_details.name,

        }
        res.status(200).render("admin/command", { data: { connect: req.user, basket: req.basket, command } })
    }
}