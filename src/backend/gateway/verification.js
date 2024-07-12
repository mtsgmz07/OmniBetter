const { request, response } = require("express")
const Verification = require('../../public/models/verification')
module.exports = {
    name: "/verification",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        if (req.body?.id && req.body?.code) {
            const isValideCode = await Verification.check(req.body?.id, req.body?.code, res, req)
            if (isValideCode) return res.status(200).json({ check: true, redirect_url: isValideCode })
            else return res.status(404).json({ check: false })
        } else return res.status(404).json({ check: false })
    }
}