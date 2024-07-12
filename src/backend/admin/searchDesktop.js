const { request, response } = require("express")
const Desktop = require('../../public/models/desktop')
module.exports = {
    name: "/admin/shop/:desktopName/search",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        function rechercheSimilaire(mots, recherche) {
            const resultats = [];
            for (let i = 0; i < mots.length; i++) {
                if (mots[i].title.startsWith(recherche)) {
                    resultats.push(mots[i]);
                }
            }
            return resultats;
        }
        const getAllDesktop = await (await Desktop.getAll()).map(x => { return { title: x.title.toLowerCase(), desktop_id: x.desktop_id } })
        const approximateResults = rechercheSimilaire(getAllDesktop, req.params.desktopName);
        if (!approximateResults[0]) return res.sendStatus(404)
        else {
            let searchDesktop = []
            for (let i = 0; i < approximateResults.slice(0, 10).length; i++) {
                const getDesktop = await Desktop.getDesktopById(approximateResults[i].desktop_id)
                if (!getDesktop) return
                searchDesktop.push({
                    desktop_id: getDesktop.desktop_id,
                    image: getDesktop.image,
                    title: getDesktop.title,
                    price: (getDesktop.price / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
                    category: Desktop.getCategory(getDesktop.category),
                    config: {
                        processor: getDesktop.config.processor,
                        graphic: getDesktop.config.graphic,
                        ram: getDesktop.config.ram,
                        storage: getDesktop.config.storage
                    }
                })
            }
            return res.status(200).json({ desktop: searchDesktop })
        }
    }
}