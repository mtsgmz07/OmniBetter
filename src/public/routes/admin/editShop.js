const { request, response } = require("express")
const Desktop = require('../../models/desktop')
module.exports = {
    name: "/admin/shop/edit/:desktopId",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        if (await Desktop.getDesktopById(req.params?.desktopId)) return res.status(200).render("admin/editShop", { data: { basket: req?.basket, connect: req?.user, desktop: await Desktop.getDesktopById(req.params?.desktopId) } })
        else res.status(404).redirect("/admin/shop")
    }
}