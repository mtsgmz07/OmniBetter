const mongoose = require('mongoose')
const token = require("../../assets/js/function/generateToken")
require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE)
const Desktop = require("./desktop")
const Account = require("./account")
const compareArray = require("../../assets/js/function/compareArray")
const nodemailer = require('../../assets/js/function/nodemailer')
const paymentSchema = mongoose.Schema({
    payment_id: { type: String, default: token() },
    stripe_payment_id: { type: String, default: "" },
    account_id: { type: String, default: null },
    payment_validity: { type: Boolean, default: false },
    payment_tracker: { type: String, default: null },
    payment_status: { type: Number, default: 0 },
    items: { type: Array, default: [] },
    create_time: { type: Number, default: Date.now() },
    expire: { type: Number, default: new Date().setHours(new Date().getHours() + 1) }
})

paymentSchema.methods.nextStatus = async function (url) {
    const getStripePayment = await stripe.checkout.sessions.retrieve(this.stripe_payment_id, {
        expand: ["total_details.breakdown.discounts"],
    }).catch(() => 0)
    if (this.payment_status === 3) return false
    if (!getStripePayment || (this.payment_status === 2 && !url)) return false
    if (this.payment_status >= 0 && this.payment_status <= 2) this.payment_status = this.payment_status + 1
    const getPromotion = getStripePayment.total_details.breakdown.discounts[0] ?
        await stripe.promotionCodes.retrieve(getStripePayment.total_details.breakdown.discounts[0].discount.promotion_code) :
        null
    const reformItems = this.items.map(x => {
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
    const withoutTax = totalAmount * 0.8
    switch (this.payment_status) {
        case 1:
            nodemailer(
                "no-reply",
                getStripePayment.customer_details.email,
                "Suivis de votre commande",
                "src/public/email/assemblyPayment.ejs",
                {
                    promotion: getPromotion ? `${getPromotion.coupon.percent_off ? getPromotion.coupon.percent_off + "%" : getPromotion.coupon.amount_off + " €"}` : "Aucune",
                    items: reformItems,
                    withoutTax: (withoutTax / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
                    tax: ((totalAmount - withoutTax) / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
                    totalAmount: (totalAmount / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                }
            )
            break
        case 2:
            nodemailer(
                "no-reply",
                getStripePayment.customer_details.email,
                "Suivis de votre commande",
                "src/public/email/onDelivery.ejs",
                {
                    promotion: getPromotion ? `${getPromotion.coupon.percent_off ? getPromotion.coupon.percent_off + "%" : getPromotion.coupon.amount_off + " €"}` : "Aucune",
                    items: reformItems,
                    withoutTax: (withoutTax / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
                    tax: ((totalAmount - withoutTax) / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
                    totalAmount: (totalAmount / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                }
            )
            this.payment_traker = url
            break
        case 3:
            nodemailer(
                "no-reply",
                getStripePayment.customer_details.email,
                "Votre commande est arrivée",
                "src/public/email/delivery.ejs",
                {
                    promotion: getPromotion ? `${getPromotion.coupon.percent_off ? getPromotion.coupon.percent_off + "%" : getPromotion.coupon.amount_off + " €"}` : "Aucune",
                    items: reformItems,
                    withoutTax: (withoutTax / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
                    tax: ((totalAmount - withoutTax) / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
                    totalAmount: (totalAmount / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                }
            )
            break
    }
    this.save()
    return this
}

paymentSchema.methods.changeValidity = function () {
    if (this.payment_validity === false) this.payment_validity = true
    this.save()
    return this
}

paymentSchema.methods.checkValidity = function () {
    if (this.payment_validity === false) return true
    else return false
}

paymentSchema.statics.getAll = async function () {
    const payments = await Payment.find();
    return Array.isArray(payments) ? payments : [payments];
}

paymentSchema.statics.create = async function (items, account_id) {
    const getAccount = await Account.getAccountByAccountId(account_id)
    if (!getAccount) return false
    const getAllDesktop = (await Desktop.getAll()).map(x => x.desktop_id)
    if (!(items.filter(x => getAllDesktop.includes(x.desktop_id)))[0]) return false
    const newStripePayment = await stripe.checkout.sessions.create({
        line_items: await Promise.all(items.filter(x => getAllDesktop.includes(x.desktop_id)).map(async x => {
            const getDesktop = await Desktop.getDesktopById(x.desktop_id)
            return {
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: getDesktop.title,
                        description: getDesktop.getAssembly(x.assembly),
                        images: getDesktop.image.sort((a, b) => a.index - b.index).map(x => x.link)
                    },
                    unit_amount: getDesktop.price + (x.assembly === 1 ? 3000 : x.assembly === 2 ? 5000 : 0),
                },
                quantity: x.quantity,
                adjustable_quantity: {
                    enabled: true,
                    minimum: 1,
                    maximum: 10,
                }
            }
        })),
        mode: 'payment',
        customer: getAccount.stripe_account_id,
        success_url: `${process.env.DOMAIN}/payment/success?paymentId={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.DOMAIN}/basket`,
        allow_promotion_codes: true,
        billing_address_collection: "required",
        phone_number_collection: {
            enabled: true
        },
        shipping_address_collection: {
            allowed_countries: ["FR", "ES", "BE", "CH"]
        },
        shipping_options: [
            {
                shipping_rate_data: {
                    display_name: "Livraison standard",
                    delivery_estimate: {
                        minimum: {
                            unit: "business_day",
                            value: 7
                        },
                        maximum: {
                            unit: "business_day",
                            value: 10
                        }
                    },
                    fixed_amount: {
                        amount: 500,
                        currency: "EUR"
                    },
                    type: 'fixed_amount'
                }
            },
            {
                shipping_rate_data: {
                    display_name: "Livraison express",
                    delivery_estimate: {
                        minimum: {
                            unit: "business_day",
                            value: 5
                        },
                        maximum: {
                            unit: "business_day",
                            value: 7
                        }
                    },
                    fixed_amount: {
                        amount: 1000,
                        currency: "EUR"
                    },
                    type: 'fixed_amount'
                }
            }
        ]
    });
    const newPayment = new Payment({
        stripe_payment_id: newStripePayment.id,
        items: await Promise.all(items.map(async x => {
            const getDesktop = await Desktop.getDesktopById(x.desktop_id)
            return {
                desktop_id: getDesktop.desktop_id,
                title: getDesktop.title,
                description: getDesktop.description,
                image: getDesktop.image,
                price: getDesktop.price,
                category: getDesktop.category,
                config: getDesktop.config,
                quantity: x.quantity,
                assemblyInText: getDesktop.getAssembly(x.assembly),
                assemblyInNumber: x.assembly,
            }
        })),
        account_id
    }).save()
    return newPayment
}

paymentSchema.statics.check = async function (basket, account_id) {
    let findArray = []
    for (let i = 0; (await Payment.getAll()).filter(x => x.payment_validity !== true).length > i; i++) {
        if (!compareArray(
            await Promise.all((await Payment.getAll()).filter(x => x.payment_validity !== true)[i].items.map(async x => {
                return {
                    account_id: (await Payment.getAll())[i].account_id,
                    desktop_id: x.desktop_id,
                    assembly: x.assemblyInNumber,
                    quantity: x.quantity
                }
            })),
            basket.map(x => {
                return {
                    account_id: account_id,
                    desktop_id: x.desktop_id,
                    assembly: x.assembly,
                    quantity: x.quantity
                }
            })
        )[0]) findArray.push((await Payment.getAll())[i])
    }
    if (
        findArray.find(x => x.account_id === account_id)
    ) return (await stripe.checkout.sessions.retrieve(findArray.find(x => x.account_id === account_id).stripe_payment_id)).url
    else return false
}

paymentSchema.statics.delete = async function (payment_id, reason) {
    const getPayment = await Payment.findOne({ payment_id })
    const getStripePayment = await stripe.checkout.sessions.retrieve(getPayment.stripe_payment_id, {
        expand: ["total_details.breakdown.discounts"],
    }).catch(() => 0)
    const getPromotion = getStripePayment.total_details.breakdown.discounts[0] ?
        await stripe.promotionCodes.retrieve(getStripePayment.total_details.breakdown.discounts[0].discount.promotion_code) :
        null
    const reformItems = getPayment.items.map(x => {
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
    const withoutTax = totalAmount * 0.8
    if (!getPayment || !getStripePayment) return false
    if (getStripePayment.status === "open") await stripe.checkout.sessions.expire(getPayment.stripe_payment_id)
    await Payment.findOneAndDelete({ payment_id })
    nodemailer(
        "no-reply",
        getStripePayment.customer_details.email,
        "Suppression de votre commande",
        "src/public/email/paymentDelete.ejs",
        {
            payment_id,
            reason,
            promotion: getPromotion ? `${getPromotion.coupon.percent_off ? getPromotion.coupon.percent_off + "%" : getPromotion.coupon.amount_off + " €"}` : "Aucune",
            items: reformItems,
            withoutTax: (withoutTax / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
            tax: ((totalAmount - withoutTax) / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
            totalAmount: (totalAmount / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        }
    )
    return true
}

paymentSchema.statics.getPaymentById = async function (payment_id) {
    const getPayment = await Payment.findOne({ payment_id })
    if (!getPayment) return false
    return getPayment
}

paymentSchema.statics.getPaymentByStripeId = async function (stripe_payment_id) {
    const getPayment = await Payment.findOne({ stripe_payment_id })
    if (!getPayment) return false
    return getPayment
}

const Payment = mongoose.model('payment', paymentSchema)

module.exports = Payment