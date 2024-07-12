const { request, response } = require("express")
const Desktop = require('../../public/models/desktop')
module.exports = {
    name: "/admin/shop/edit/:desktopId/image",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        const getDesktop = await Desktop.getDesktopById(req.params.desktopId)
        if (!getDesktop || !req.body?.["editImage[]"]) return res.status(404).json({
            label: "body__main__editDesktop__image__h2",
            class: "small__form__filepond",
            value: `Une erreur vient de se produire, veuillez réessayer ultérieurement`
        })

        let editImage = await getDesktop.editImage(Array.isArray(req.body["editImage[]"]) ? req.body["editImage[]"] : [req.body["editImage[]"]])
        if (editImage) return res.status(200).json({ success: true })
        else return res.status(404).json({
            label: "body__main__editDesktop__image__h2",
            class: "small__form__filepond",
            value: `Une erreur vient de se produire, veuillez vérifier la taille de vos images`
        })
    }
}