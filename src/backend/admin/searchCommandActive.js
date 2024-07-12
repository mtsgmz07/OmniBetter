const { request, response } = require("express")
require('dotenv').config()
const Payment = require('../../public/models/payment')
const stripe = require('stripe')(process.env.STRIPE)
module.exports = {
    name: "/admin/command/manage/:commandName/search",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        function rechercheSimilaire(mots, recherche) {
            const resultats = [];
            for (let i = 0; i < mots.length; i++) {
                if (mots[i].id.startsWith(recherche)) {
                    resultats.push(mots[i]);
                }
            }
            return resultats;
        }
        const getAllCommandActive = (await stripe.promotionCodes.list({ active: true, limit: 100 })).data.map(x => { return { code: x.code, id: x.id } })
        const approximateResults = rechercheSimilaire(getAllCommandActive, req.params.commandName.toUpperCase());
        if (!approximateResults[0]) return res.sendStatus(404)
        else {
            let searchCommandActive = []
            for (let i = 0; i < approximateResults.slice(0, 10).length; i++) {
                await Promise.all(approximateResults.filter(x => x.payment_status !== 3).map(async x => {
                    const getStripePayment = await stripe.checkout.sessions.retrieve(x.stripe_payment_id)
                    const reformItems = x.items.map(x => {
                        return {
                            id: x.desktop_id,
                            image: x.image.find(x => x.index === 0),
                            title: x.title,
                            priceInNumber: x.price,
                            price: ((x.price + (x.assembly === 1 ? 3000 : x.assembly === 2 ? 5000 : 0)) / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
                            assembly: x.assemblyInText,
                            assemblyInNumber: x.assemblyInNumber,
                            quantity: x.quantity,
                            totalAmount: ((x.price * x.quantity) + ((x.assembly === 1 ? 3000 : x.assembly === 2 ? 5000 : 0) * x.quantity))
                        }
                    })
                    searchCommandActive.push({
                        id: x.payment_id,
                        delivery: `${getStripePayment.customer_details.address.line1}, ${getStripePayment.customer_details.address.city} ${getStripePayment.customer_details.address.postal_code}`,
                        totalAmount: (reformItems.reduce((acc, currentItem) => {
                            return acc + currentItem.totalAmount;
                        }, 0) / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
                        statusInText: x.payment_status === 0 ? "Traitement de la commande" :
                            x.payment_status === 1 ? "Assemblage de l'ordinateur" :
                                x.payment_status === 2 ? "Livraison en cours" :
                                    x.payment_status === 3 ? "Livré" : "Status indisponible",
                        status: x.payment_status,
                        create_time: formatDate(x.create_time),
                        items: reformItems
                    })
                }))
            }
            return res.status(200).json({ commandActive: searchCommandActive })
        }
    }
}