const { request, response } = require("express");
const Desktop = require('../../public/models/desktop');

module.exports = {
    name: "/admin/shop/edit/:desktopId/game",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        const getDesktop = await Desktop.getDesktopById(req.params.desktopId);
        if (!getDesktop || !req.body.fortniteHigh || !req.body.fortniteUltra || !req.body.apexHigh || !req.body.apexUltra || !req.body.valorantHigh || !req.body.valorantUltra || !req.body.cyberpunkHigh || !req.body.cyberpunkUltra || !req.body.battlefieldHigh || !req.body.battlefieldUltra || !req.body.rainbowsixHigh || !req.body.rainbowsixUltra) {
            return res.status(404).json([
                {
                    label: "body__main__editDesktop__game__h2",
                    class: "body__main__editDesktop__game__error",
                    value: ""
                }
            ]);
        }

        let errorArray = [];

        const fieldLabels = {
            fortniteHigh: {
                small: "small__form__editfortnitehigh",
                label: "body__main__editDesktop__component__manager__editFortniteHigh label"
            },
            fortniteUltra: {
                small: "small__form__editfortniteultra",
                label: "body__main__editDesktop__component__manager__editFortniteUltra label"
            },
            apexHigh: {
                small: "small__form__editapexhigh",
                label: "body__main__editDesktop__component__manager__editApexHigh label"
            },
            apexUltra: {
                small: "small__form__editapexultra",
                label: "body__main__editDesktop__component__manager__editApexUltra label"
            },
            valorantHigh: {
                small: "small__form__editvaloranthigh",
                label: "body__main__editDesktop__component__manager__editValorantHigh label"
            },
            valorantUltra: {
                small: "small__form__editvalorantultra",
                label: "body__main__editDesktop__component__manager__editValorantUltra label"
            },
            cyberpunkHigh: {
                small: "small__form__editcyberpunkhigh",
                label: "body__main__editDesktop__component__manager__editCyberpunkHigh label"
            },
            cyberpunkUltra: {
                small: "small__form__editcyberpunkultra",
                label: "body__main__editDesktop__component__manager__editCyberpunkUltra label"
            },
            battlefieldHigh: {
                small: "small__form__editbattlefieldhigh",
                label: "body__main__editDesktop__component__manager__editBattlefieldHigh label"
            },
            battlefieldUltra: {
                small: "small__form__editbattlefieldultra",
                label: "body__main__editDesktop__component__manager__editBattlefieldUltra label"
            },
            rainbowsixHigh: {
                small: "small__form__editrainbowsixhigh",
                label: "body__main__editDesktop__component__manager__editRainbowsixHigh label"
            },
            rainbowsixUltra: {
                small: "small__form__editrainbowsixultra",
                label: "body__main__editDesktop__component__manager__editRainbowsixUltra label"
            }
        };

        const fieldsToCheck = [
            { name: "fortniteHigh", value: req.body.fortniteHigh },
            { name: "fortniteUltra", value: req.body.fortniteUltra },
            { name: "apexHigh", value: req.body.apexHigh },
            { name: "apexUltra", value: req.body.apexUltra },
            { name: "valorantHigh", value: req.body.valorantHigh },
            { name: "valorantUltra", value: req.body.valorantUltra },
            { name: "cyberpunkHigh", value: req.body.cyberpunkHigh },
            { name: "cyberpunkUltra", value: req.body.cyberpunkUltra },
            { name: "battlefieldHigh", value: req.body.battlefieldHigh },
            { name: "battlefieldUltra", value: req.body.battlefieldUltra },
            { name: "rainbowsixHigh", value: req.body.rainbowsixHigh },
            { name: "rainbowsixUltra", value: req.body.rainbowsixUltra }
        ];

        fieldsToCheck.forEach(field => {
            if (field.value.length < 1 || field.value.length > 3) {
                errorArray.push({
                    label: fieldLabels[field.name].label,
                    small: fieldLabels[field.name].small,
                    value: `Ce champ doit contenir entre 1 et 3 caractères.`
                });
            }
        });

        if (errorArray.length > 0) return res.status(404).json(errorArray);

        let editGame = await getDesktop.editGame({
            game: {
                fortnite: {
                    high: Number(req.body.fortniteHigh),
                    ultra: Number(req.body.fortniteUltra)
                },
                apex: {
                    high: Number(req.body.apexHigh),
                    ultra: Number(req.body.apexUltra)
                },
                valorant: {
                    high: Number(req.body.valorantHigh),
                    ultra: Number(req.body.valorantUltra)
                },
                cyberpunk: {
                    high: Number(req.body.cyberpunkHigh),
                    ultra: Number(req.body.cyberpunkUltra)
                },
                battlefield: {
                    high: Number(req.body.battlefieldHigh),
                    ultra: Number(req.body.battlefieldUltra)
                },
                rainbowsix: {
                    high: Number(req.body.rainbowsixHigh),
                    ultra: Number(req.body.rainbowsixUltra)
                }
            }
        });
        if (editGame) return res.status(200).json({ success: true });
        else return res.status(404).json([
            {
                label: "body__main__editDesktop__game__h2",
                class: "body__main__editDesktop__game__error",
                value: ""
            }
        ])
    }
}
