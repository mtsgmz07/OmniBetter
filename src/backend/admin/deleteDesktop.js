const { request, response } = require("express");
const Desktop = require('../../public/models/desktop');

module.exports = {
    name: "/admin/shop/edit/:desktopId/delete",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        const getDesktop = await Desktop.getDesktopById(req.params.desktopId);
        if (!getDesktop) return res.status(404).json({ success: false });
        const deleteDesktop = await Desktop.delete(req.params.desktopId)
        if (!deleteDesktop) return res.status(404).json({ success: false });
        else return res.status(200).json({ success: true });
    }
}
