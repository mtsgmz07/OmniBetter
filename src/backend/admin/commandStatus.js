const { request, response } = require("express")
const Payment = require('../../public/models/payment')
const checkUrl = require('../../assets/js/function/checkUrl')
module.exports = {
    name: "/admin/command/manage/:paymentId/next",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        const getPayment = await Payment.getPaymentById(req.params?.paymentId)
        if (!getPayment || (getPayment.payment_status === 1 && !checkUrl(req.body?.url))) return res.status(404).json({ error: true })
        const nextStatus = await getPayment.nextStatus(req.body?.url)
        if (nextStatus) return res.status(200).json({ success: true })
        else return res.status(404).json({ error: true })
    }
}