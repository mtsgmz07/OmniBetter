const { request, response } = require("express")
const Verification = require('../../public/models/verification')
module.exports = {
    name: "/verification/send/:id",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        const getVerification = await Verification.get(req.params?.id)
        if (!getVerification) return res.status(404).redirect("/signup")
        const sendMailFunction = await getVerification.sendMail()
        if (!sendMailFunction) return res.sendStatus(404)
        return res.status(200).json({ check: true })
    }
}