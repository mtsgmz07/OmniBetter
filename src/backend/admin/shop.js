const { request, response } = require("express")
const Desktop = require('../../public/models/desktop')
module.exports = {
    name: "/admin/shop",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        if (
            !req.body?.["filepond[]"] ||
            !req.body?.category ||
            !req.body?.title ||
            !req.body?.description ||
            !req.body?.price ||
            !req.body?.case ||
            !req.body?.processor ||
            !req.body?.motherboard ||
            !req.body?.graphic ||
            !req.body?.ram ||
            !req.body?.cooling ||
            !req.body?.storage ||
            !req.body?.powerSupply ||
            !req.body?.os
        ) return res.status(404).json({})


        let objectError = []

        const champsLongueur = ["title", "case", "processor", "graphic", "cooling", "storage", "powerSupply", "os", "price"];
        const champsNombre = ["fortniteHigh", "fortniteUltra", "apexHigh", "apexUltra", "valorantHigh", "valorantUltra", "cyberpunkHigh", "cyberpunkUltra", "battlefieldHigh", "battlefieldUltra", "rainbowsixHigh", "rainbowsixUltra"];

        const limitesLongueur = {
            title: [3, 100, "small__form__title", "body__main__popup__content__form__titleOfProduct label"],
            case: [3, 100, "small__form__case", "body__main__popup__content__form__caseOfProduct label"],
            processor: [3, 100, "small__form__processor", "body__main__popup__content__form__processorOfProduct label"],
            graphic: [3, 100, "small__form__graphic", "body__main__popup__content__form__graphicOfProduct label"],
            ram: [3, 100, "small__form__ram", "body__main__popup__content__form__ram label"],
            cooling: [3, 100, "small__form__cooling", "body__main__popup__content__form__cooling label"],
            storage: [3, 100, "small__form__storage", "body__main__popup__content__form__storage label"],
            powerSupply: [3, 100, "small__form__powerSupply", "body__main__popup__content__form__powerSupply label"],
            os: [3, 100, "small__form__os", "body__main__popup__content__form__os label"],
            price: [0, 10, "small__form__price", "body__main__popup__content__form__priceOfProduct label"],
            fortniteHigh: [1, 3, "small__form__fortniteHigh", "body__main__popup__content__form__fortniteHigh label"],
            fortniteUltra: [1, 3, "small__form__fortniteUltra", "body__main__popup__content__form__fortniteUltra label"],
            apexHigh: [1, 3, "small__form__apexHigh", "body__main__popup__content__form__apexHigh label"],
            apexUltra: [1, 3, "small__form__apexUltra", "body__main__popup__content__form__apexUltra label"],
            valorantHigh: [1, 3, "small__form__valorantHigh", "body__main__popup__content__form__valorantHigh label"],
            valorantUltra: [1, 3, "small__form__valorantUltra", "body__main__popup__content__form__valorantUltra label"],
            cyberpunkHigh: [1, 3, "small__form__cyberpunkHigh", "body__main__popup__content__form__cyberpunkHigh label"],
            cyberpunkUltra: [1, 3, "small__form__cyberpunkUltra", "body__main__popup__content__form__cyberpunkUltra label"],
            battlefieldHigh: [1, 3, "small__form__battlefieldHigh", "body__main__popup__content__form__battlefieldHigh label"],
            battlefieldUltra: [1, 3, "small__form__battlefieldUltra", "body__main__popup__content__form__battlefieldUltra label"],
            rainbowsixHigh: [1, 3, "small__form__rainbowsixHigh", "body__main__popup__content__form__rainbowsixHigh label"],
            rainbowsixUltra: [1, 3, "small__form__rainbowsixUltra", "body__main__popup__content__form__rainbowsixUltra label"]

        };

        if (isNaN(Number(req.body?.category)) || (Number(req.body?.category) !== 0 && Number(req.body?.category) !== 1)) {
            objectError.push({
                label: "body__main__popup__content__form__selectCategory label",
                class: "small__form__category",
                value: `Catégorie invalide`
            })
        }

        if (req.body?.description.length > 2048) {
            objectError.push({
                label: "body__main__popup__content__form__descriptionOfProduct label",
                class: "small__form__description",
                value: `Ce champs doit faire maximum 2048 caractères`
            })
        }

        for (let champ of champsLongueur) {
            const [min, max, input, label] = limitesLongueur[champ];
            if (req.body[champ].length < min || req.body[champ].length > max) {
                objectError.push({
                    label: label,
                    class: input,
                    value: `Ce champ doit contenir entre ${min} et ${max} caractères`
                })
            }
            if (champ === "price") {
                const nombreString = req.body[champ].toString();
                if (isNaN(Number(req.body[champ]))) {
                    objectError.push({
                        label: label,
                        class: input,
                        value: `Ce champ doit être un nombre`
                    })
                }
                if (nombreString.indexOf('.') !== -1 && nombreString.split('.')[1].length > 2) {
                    objectError.push({
                        label: label,
                        class: input,
                        value: `Ce champ ne peut pas avoir plus de 2 chiffres après la virgule`
                    })
                }
            }
        }

        if (Number(req.body?.category) === 0) {
            for (let champ of champsNombre) {
                const [min, max, input, label] = limitesLongueur[champ];
                if (req.body[champ].length < min || req.body[champ].length > max) {
                    objectError.push({
                        label: label,
                        class: input,
                        value: `Ce champ doit contenir entre ${min} et ${max} caractères`
                    })
                }
                if (isNaN(Number(req.body[champ]))) {
                    objectError.push({
                        label: label,
                        class: input,
                        value: `Ce champ doit être un nombre`
                    })
                }
            }
        }

        if (Object.keys(objectError).length > 0) return res.status(404).json(objectError)

        function chiffresApresVirgule(nombre) {
            var nombreString = nombre.toString();
            if (nombreString.indexOf('.') === -1) {
                return Number(nombre + "00");
            } else {
                let chiffresApresVirgule = nombreString.split('.')[1];
                if (chiffresApresVirgule.length === 1) return Number((nombre * 10) + "0")
                else return Number(nombre).toFixed(2)
            }
        }

        await Desktop.create(
            Array.isArray(req.body["filepond[]"]) ? req.body["filepond[]"] : [req.body["filepond[]"]],
            req.body?.title,
            req.body?.description,
            chiffresApresVirgule(Number(req.body?.price)),
            Number(req.body?.category),
            {
                case: req.body?.case,
                processor: req.body?.processor,
                motherboard: req.body?.motherboard,
                graphic: req.body?.graphic,
                ram: req.body?.ram,
                cooling: req.body?.cooling,
                storage: req.body?.storage,
                powerSupply: req.body?.powerSupply,
                os: req.body?.os,
            },
            {
                fortnite: {
                    high: req.body?.fortniteHigh,
                    ultra: req.body?.fortniteUltra,
                },
                apex: {
                    high: req.body?.apexHigh,
                    ultra: req.body?.apexUltra,
                },
                valorant: {
                    high: req.body?.valorantHigh,
                    ultra: req.body?.valorantUltra,
                },
                cyberpunk: {
                    high: req.body?.cyberpunkHigh,
                    ultra: req.body?.cyberpunkUltra,
                },
                battlefield: {
                    high: req.body?.battlefieldHigh,
                    ultra: req.body?.battlefieldUltra,
                },
                rainbowsix: {
                    high: req.body?.rainbowsixHigh,
                    ultra: req.body?.rainbowsixUltra,
                }
            }
        ).then(() => {
            res.status(200).json({ success: true })
        })
            .catch((err) => res.status(404).json({}))
    }
}