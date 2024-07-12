const { request, response } = require("express")
const Archivement = require('../../public/models/archivement')
module.exports = {
    name: "/admin/:achivementId/delete",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        const deleteArchivement = await Archivement.delete(req.params?.achivementId)
        if (!deleteArchivement) return res.status(404).json({ error: true })
        else return res.status(200).json({ success: true })
    }
}