const { request, response } = require("express")
const Desktop = require('../../public/models/desktop')
module.exports = {
    name: "/admin/shop/edit/:desktopId/information",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        const getDesktop = await Desktop.getDesktopById(req.params.desktopId)
        if (
            !getDesktop ||
            (
                !req.body.category ||
                !req.body.title ||
                !req.body.description ||
                !req.body.price
            )
        ) return res.status(404).json([
            {
                label: "body__main__editDesktop__information__h2",
                class: "small__form__category",
                value: `Catégorie invalide`
            },
            {
                label: "body__main__editDesktop__information__manager__title",
                class: "small__form__editTitle",
                value: `Nom d'ordinateur invalide`
            },
            {
                label: "body__main__editDesktop__information__manager__description",
                class: "small__form__editDescription",
                value: `Description de l'ordinateur invalide`
            },
            {
                label: "body__main__editDesktop__information__manager__price",
                class: "small__form__editPrice",
                value: `Prix de l'ordinateur invalide`
            }
        ])

        let errorArray = []

        if (req.body.category !== "0" && req.body.category !== "1") {
            errorArray.push({
                label: "body__main__editDesktop__information__manager__selectCategory__placeholder label",
                class: "small__form__category",
                value: `Catégorie invalide`
            })
        }

        if (req.body.title.length < 1 && req.body.title.length > 100) {
            errorArray.push({
                label: "body__main__editDesktop__information__manager__title label",
                class: "small__form__editTitle",
                value: `Nom de l'ordinateur invalide`
            })
        }

        if (req.body.description.length < 10 && req.body.description.length > 2048) {
            errorArray.push({
                label: "body__main__editDesktop__information__manager__description label",
                class: "small__form__editDescription",
                value: `Description de l'ordinateur invalide`
            })
        }

        if (isNaN(Number(req.body.price.replace(",", "").replace(".", "")))) {
            errorArray.push({
                label: "body__main__editDesktop__information__manager__price label",
                class: "small__form__editPrice",
                value: `Prix de l'ordinateur invalide`
            })
        }

        if (req.body.price.indexOf('.') !== -1 && req.body.price.split('.')[1].length > 2) {
            errorArray.push({
                label: "body__main__editDesktop__information__manager__price label",
                class: "small__form__editPrice",
                value: `Le prix de l'ordinateur peut avoir uniquement 2 nombre après la virgule`
            })
        }

        if (errorArray[0]) return res.status(404).json(errorArray)

        let editInformation = await getDesktop.editInformation(Number(req.body.category), req.body.title, req.body.description, Number(req.body.price.replace(",", "").replace(".", "")))
        if (editInformation) return res.status(200).json({ success: true })
        else return res.status(404).json([{
            label: "body__main__editDesktop__information__h2",
            class: "small__form__category",
            value: `Une erreur vient de se produire sur ce champ`
        },
        {
            label: "body__main__editDesktop__information__manager__title",
            class: "small__form__editTitle",
            value: `Une erreur vient de se produire sur ce champ`
        },
        {
            label: "body__main__editDesktop__information__manager__description",
            class: "small__form__editDescription",
            value: `Une erreur vient de se produire sur ce champ`
        },
        {
            label: "body__main__editDesktop__information__manager__price",
            class: "small__form__editPrice",
            value: `Une erreur vient de se produire sur ce champ`
        }])
    }
}