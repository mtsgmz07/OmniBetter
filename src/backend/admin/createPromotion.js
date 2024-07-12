const { request, response } = require("express")
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE)
const checkCodeStripe = require('../../assets/js/function/checkCodeStripe')
module.exports = {
    name: "/admin/promotion/create",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        if (
            !req.body?.code ||
            !req.body?.type ||
            !req.body?.reduction ||
            !req.body?.expire ||
            !req.body?.firstCommand ||
            !req.body?.limitCheck ||
            !req.body?.minPriceCheck
        ) return res.status(404).json({ error: "missing parameter" })

        let errorArray = []

        if (req.body.code.length < 2 || req.body.code.length > 20) {
            errorArray.push({
                label: "body__main__popup__content__form__code label",
                class: "small__form__code",
                value: `Ce champ doit contenir entre 2 et 20 caractères`
            })
        }

        if (await checkCodeStripe(req.body.code.trim().toUpperCase())) {
            errorArray.push({
                label: "body__main__popup__content__form__code label",
                class: "small__form__code",
                value: `Ce code exite déjà`
            })
        }

        if (Number(req.body.type) !== 0 && Number(req.body.type) !== 1) {
            console.log(Number(req.body.type));
            errorArray.push({
                label: "body__main__popup__content__form__selectType label",
                class: "small__form__type",
                value: `Type de réduction invalide`
            })
        }

        if (isNaN(Number(req.body.reduction))) {
            errorArray.push({
                label: "body__main__popup__content__form__reduction label",
                class: "small__form__reduction",
                value: `Ce champs doit contenir un nombre`
            })
        }

        if (Number(req.body.reduction) > 100 && Number(req.body.type) === 0) {
            errorArray.push({
                label: "body__main__popup__content__form__reduction label",
                class: "small__form__reduction",
                value: `Ce champs doit contenir un nombre inférieur a 100`
            })
        }

        if (isNaN(new Date(req.body.expire).getTime())) {
            errorArray.push({
                label: "body__main__popup__content__form__expire label",
                class: "small__form__expire",
                value: `Veuillez entrer une date valide`
            })
        }

        if (new Date(req.body.expire) > new Date(new Date().setFullYear(new Date().getFullYear() + 1))) {
            errorArray.push({
                label: "body__main__popup__content__form__expire label",
                class: "small__form__expire",
                value: `La date saisie doit être inférieure à un an à partir de la date actuelle`
            })
        }

        if (new Date(req.body.expire) < new Date()) {
            errorArray.push({
                label: "body__main__popup__content__form__expire label",
                class: "small__form__expire",
                value: `La date saisie doit être supérieur à la date actuelle`
            })
        }

        if (JSON.parse(req.body.limitCheck) && !req.body.limitInput) {
            errorArray.push({
                label: "body__main__popup__content__form__condition__limitUse__input label",
                class: "small__form__limitUse",
                value: `Ce champ est obligatoire lorsque l'option est cochée`
            })
        }

        if (JSON.parse(req.body.limitCheck) && Number(req.body.limitInput).toString().indexOf(".") !== -1) {
            errorArray.push({
                label: "body__main__popup__content__form__condition__limitUse__input label",
                class: "small__form__limitUse",
                value: `Ce champ ne peut pas avoir de chiffres après la virgule`
            })
        }

        if (JSON.parse(req.body.minPriceCheck) && !req.body.minPriceInput) {
            errorArray.push({
                label: "body__main__popup__content__form__condition__minPrice__input label",
                class: "small__form__minPrice",
                value: `Ce champ est obligatoire lorsque l'option est cochée`
            })
        }

        if (JSON.parse(req.body.minPriceCheck) && Number(req.body.minPriceInput).toString().indexOf(".") !== -1) {
            errorArray.push({
                label: "body__main__popup__content__form__condition__minPrice__input label",
                class: "small__form__minPrice",
                value: `Ce champ ne peut pas avoir de chiffres après la virgule`
            })
        }

        if (errorArray[0]) return res.status(404).json(errorArray)

        let objCoupon = {
            duration: 'once',
            name: "TITLE_" + req.body.code.toUpperCase()
        }

        Number(req.body.type) === 0 ?
            (objCoupon.percent_off = Number(req.body.reduction)) :
            (objCoupon.currency = "EUR", objCoupon.amount_off = Number((Math.abs(Number(req.body.reduction)) % 1 === 0) ? (Number(req.body.reduction) * 100).toFixed(0) : (Number(req.body.reduction) * 100).toFixed(0)));

        await stripe.coupons.create(objCoupon).then(async (newCoupon) => {
            let objPromotionCodes = {
                coupon: newCoupon.id,
                code: req.body.code.toUpperCase(),
                expires_at: new Date(req.body.expire),
                restrictions: {}
            }

            if (JSON.parse(req.body.firstCommand)) objPromotionCodes.restrictions.first_time_transaction = true
            if (JSON.parse(req.body.limitCheck)) objPromotionCodes.max_redemptions = Number(req.body.limitInput)
            if (JSON.parse(req.body.minPriceCheck)) {
                objPromotionCodes.restrictions.minimum_amount = Number(req.body.minPriceInput)
                objPromotionCodes.restrictions.minimum_amount_currency = "EUR"
            }

            await stripe.promotionCodes.create(objPromotionCodes).then(() => {
                return res.status(200).json({ success: true })
            })
        })
    }
}