const { request, response } = require("express")
require('dotenv').config()
const Payment = require('../../public/models/payment')
const stripe = require('stripe')(process.env.STRIPE)
const ejs = require('ejs')
const pdf = require('html-pdf')
const convertTime = require('../../assets/js/function/convertTime')
module.exports = {
    name: "/basket/invoice/:paymentId/download",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        if (req?.user) {
            const getPayment = await Payment.getPaymentById(req.params?.paymentId)
            if (!getPayment || getPayment.account_id !== req?.user.account_id) return res.status(404).json({ error: true })
            const getPaymentInStripe = await stripe.checkout.sessions.retrieve(getPayment.stripe_payment_id, {
                expand: ["total_details.breakdown.discounts"],
            }).catch(() => 0)
            if (!getPaymentInStripe) return res.status(404).json({ error: true })
            const getPromotion = getPaymentInStripe.total_details.breakdown.discounts[0] ?
                await stripe.promotionCodes.retrieve(getPaymentInStripe.total_details.breakdown.discounts[0].discount.promotion_code) :
                null
            const reformItems = getPayment.items.map(x => {
                return {
                    id: x.desktop_id,
                    image: x.image.find(x => x.index === 0),
                    title: x.title,
                    priceInNumber: x.price,
                    price: ((x.price + (x.assembly === 1 ? 3000 : x.assembly === 2 ? 5000 : 0)) / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
                    assembly: x.assemblyInText,
                    assemblyInNumber: x.assembly,
                    quantity: x.quantity,
                    totalAmount: ((x.price * x.quantity) + ((x.assembly === 1 ? 3000 : x.assembly === 2 ? 5000 : 0) * x.quantity))
                }
            })
            let totalAmount = (reformItems.reduce((acc, currentItem) => {
                return acc + currentItem.totalAmount;
            }, 0))
            totalAmount = getPromotion ? getPromotion.coupon.percent_off ? totalAmount -  (totalAmount * (getPromotion.coupon.percent_off / 100)) : totalAmount - getPromotion.coupon.amount_off : totalAmount
            const withoutTax = totalAmount * 0.8
            ejs.renderFile(
                "src/views/invoices/paymentInvoice.ejs",
                {
                    ref: getPayment.payment_id,
                    create_time: convertTime(getPayment.create_time),
                    icon: process.env.DOMAIN + "/upload/omnibetter_black.png",
                    user: {
                        name: getPaymentInStripe.customer_details.name,
                        email: getPaymentInStripe.customer_details.email,
                        address: `${getPaymentInStripe.customer_details.address.line1}, ${getPaymentInStripe.customer_details.address.city} ${getPaymentInStripe.customer_details.address.postal_code}`
                    },
                    items: reformItems,
                    delivery: {
                        name: getPaymentInStripe.shipping_cost.amount_total === 500 ? "Livraison standard" : "Livraison express",
                        price: (getPaymentInStripe.shipping_cost.amount_total / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                    },
                    total: {
                        withoutTax: (withoutTax / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
                        tax: ((totalAmount - withoutTax) / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
                        totalAmount: (totalAmount / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
                        promotion: getPromotion ? `${getPromotion.coupon.percent_off ? getPromotion.coupon.percent_off + "%" : getPromotion.coupon.amount_off + " €"}` : "Aucune"
                    }
                },
                async (err, data) => {
                    pdf.create(data, { format: "Letter" }).toBuffer((err, buffer) => {
                        res.status(200).json({ sucess: true, file: "data:application/octet-stream;base64," + Buffer.from(buffer).toString("base64") })
                    })

                }
            )
        } else return res.status(404).json({ error: true })
    }
}