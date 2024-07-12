const { request, response } = require("express")
const Archivement = require('../../public/models/archivement')
module.exports = {
    name: "/admin/archivement",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        if (!req.body?.["filepond[]"]) return res.status(404).json({})

        await Archivement.create(
            Array.isArray(req.body["filepond[]"]) ? req.body["filepond[]"] : [req.body["filepond[]"]],
        ).then(() => {
            res.status(200).json({ success: true })
        })
            .catch((err) => res.status(404).json({}))
    }
}