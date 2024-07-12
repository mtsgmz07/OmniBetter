const { request, response } = require("express")
require('dotenv').config()
const stripe = require("stripe")(process.env.STRIPE)
const Payment = require("../../models/payment")
const Account = require("../../models/account")
const nodemailer = require('../../../assets/js/function/nodemailer')
module.exports = {
    name: "/payment/success",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        if (req.query.paymentId) {
            const getPaymentWithMongo = await Payment.getPaymentByStripeId(req.query.paymentId)
            const getPaymentInStripe = await stripe.checkout.sessions.retrieve(req.query.paymentId, {
                expand: ["total_details.breakdown.discounts"],
            }).catch(() => 0)
            if (
                (getPaymentWithMongo && getPaymentInStripe) &&
                (getPaymentWithMongo?.checkValidity() && getPaymentInStripe?.status === "complete" && getPaymentInStripe?.payment_status === "paid")
            ) {
                getPaymentWithMongo.changeValidity()
                const getAccount = await Account.getAccountByAccountId(getPaymentWithMongo.account_id)
                const reformItems = getPaymentWithMongo.items.map(x => {
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
                const getPromotion = getPaymentInStripe.total_details.breakdown.discounts[0] ?
                    await stripe.promotionCodes.retrieve(getPaymentInStripe.total_details.breakdown.discounts[0].discount.promotion_code) :
                    null
                let totalAmount = (reformItems.reduce((acc, currentItem) => {
                    return acc + currentItem.totalAmount;
                }, 0))
                totalAmount = getPromotion ? getPromotion.coupon.percent_off ? totalAmount - (totalAmount * (getPromotion.coupon.percent_off / 100)) : totalAmount - getPromotion.coupon.amount_off : totalAmount
                const withoutTax = totalAmount * 0.8
                if (getAccount) {
                    nodemailer(
                        "no-reply",
                        getAccount.email.email,
                        "Récapitulatif de votre commande",
                        "src/public/email/summaryPayment.ejs",
                        {
                            promotion: getPromotion ? `${getPromotion.coupon.percent_off ? getPromotion.coupon.percent_off + "%" : getPromotion.coupon.amount_off + " €"}` : "Aucune",
                            items: reformItems,
                            withoutTax: (withoutTax / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
                            tax: ((totalAmount - withoutTax) / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
                            totalAmount: (totalAmount / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                        }
                    )
                    getAccount.clearBasket()
                }
                res.status(200).render("payment/success", {
                    data:
                    {
                        connect: req?.user,
                        basket: [],
                        paymentId: getPaymentWithMongo.payment_id,
                        reformItems
                    }
                })
            } else return res.status(404).render("404", { data: { connect: req?.user, basket: req?.basket } })
        } else return res.status(404).render("404", { data: { connect: req?.user, basket: req?.baskte } })
    }
}