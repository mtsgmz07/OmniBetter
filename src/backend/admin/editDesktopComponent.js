const { request, response } = require("express")
const Desktop = require('../../public/models/desktop')
module.exports = {
    name: "/admin/shop/edit/:desktopId/component",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        const getDesktop = await Desktop.getDesktopById(req.params.desktopId);
        if (!getDesktop || !req.body.case || !req.body.processor || !req.body.motherboard || !req.body.graphic || !req.body.ram || !req.body.cooling || !req.body.storage || !req.body.powerSupply || !req.body.os) {
            return res.status(404).json([
                {
                    label: "body__main__editDesktop__component__h2",
                    class: "body__main__editDesktop__component__error",
                    value: ""
                }
            ]);
        }

        let errorArray = [];

        const fieldLabels = {
            case: "body__main__editDesktop__component__manager__editCase label",
            processor: "body__main__editDesktop__component__manager__editProcessor label",
            motherboard: "body__main__editDesktop__component__manager__editMotherBoard label",
            graphic: "body__main__editDesktop__component__manager__editGraphic label",
            ram: "body__main__editDesktop__component__manager__editRam",
            cooling: "body__main__editDesktop__component__manager__editCooling",
            storage: "body__main__editDesktop__component__manager__editStorage",
            powerSupply: "body__main__editDesktop__component__manager__editPowerSupply",
            os: "body__main__editDesktop__component__manager__editOs"
        };

        const fieldsToCheck = [
            { name: "case", value: req.body.case },
            { name: "processor", value: req.body.processor },
            { name: "motherboard", value: req.body.motherboard },
            { name: "graphic", value: req.body.graphic },
            { name: "ram", value: req.body.ram },
            { name: "cooling", value: req.body.cooling },
            { name: "storage", value: req.body.storage },
            { name: "powerSupply", value: req.body.powerSupply },
            { name: "os", value: req.body.os }
        ];

        fieldsToCheck.forEach(field => {
            if (field.value.length < 3 || field.value.length > 100) {
                errorArray.push({
                    label: fieldLabels[field.name],
                    message: `Ce champ doit contenir entre 3 et 100 caractères.`
                });
            }
        });

        if (errorArray.length > 0) return res.status(404).json(errorArray);

        let editComponent = await getDesktop.editComponent({
            config: {
                case: req.body.case,
                processor: req.body.processor,
                motherboard: req.body.motherboard,
                graphic: req.body.graphic,
                ram: req.body.ram,
                cooling: req.body.cooling,
                storage: req.body.storage,
                powerSupply: req.body.powerSupply,
                os: req.body.os
            }
        });
        if (editComponent) return res.status(200).json({ success: true });
        else return res.status(404).json([
            {
                label: "body__main__editDesktop__component__h2",
                class: "body__main__editDesktop__component__error",
                value: ""
            }
        ])
    }
}                 