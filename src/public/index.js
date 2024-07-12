(async () => {
    const express = require("express")
    const app = express()
    const jwt = require('jsonwebtoken')
    require('dotenv').config()
    const path = require('path')
    const cookieParser = require('cookie-parser');
    const bodyParser = require('body-parser')
    const fs = require('fs')
    const cors = require('cors')
    const mongoose = require('mongoose')
    const rateLimit = require('express-rate-limit');
    app.listen(process.env.PORT, () => {
        console.log(`Le serveur est bien lancé sur le port 3000`);
    })
    mongoose.set("strictQuery", false)
    mongoose.connect(process.env.MONGOOSE)
        .then(() => console.log("Connexion a mongoDB effectué"))
        .catch(() => console.log("Erreur lors de la connexion a MongoDB"))
    app.use(cookieParser())
    app.set("view engine", "ejs")
    app.set("views", path.join("src/views"))
    app.use(express.static(path.join("src/assets/css")))
    app.use(express.static(path.join("src/assets/img")))
    app.use(express.static(path.join("src/assets/js")))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({
        extended: false,
        limit: '500mb',
        parameterLimit: 100000,
    }));
    app.use(cors())
    const limiter = rateLimit({
        windowMs: 60 * 1000,
        max: 50
    });
    app.use(limiter);
    const Account = require('../public/models/account')
    const Desktop = require('../public/models/desktop')
    const Payment = require('../public/models/payment')
    const Verification = require('../public/models/verification')
    const DeleteAccount = require('../public/models/delete-account')
    const compareArray = require("../assets/js/function/compareArray")
    setInterval(async () => {
        const allVerification = await Verification.getAll()
        allVerification.forEach(async (verification) => {
            if (Date.now() > new Date(verification.expire)) {
                await Account.delete(verification.account_id)
                await Verification.delete(verification.verification_id)
            } else return
        })

        const allDeleteAccount = await DeleteAccount.getAll()
        allDeleteAccount.forEach(async (deleteAccount) => {
            if (Date.now() > new Date(deleteAccount.auto_delete)) {
                await DeleteAccount.delete(deleteAccount.deleteAccount_id)
            } else return
        })

        const allPayment = await Payment.getAll()
        allPayment.filter(x => x.payment_validity !== true).forEach(async (payment) => {
            if (Date.now() > new Date(payment.expire)) {
                await Payment.delete(payment.payment_id)
            }
        })
    }, 1000)



    fs.readdirSync("./src/public/routes/").forEach(dir => {
        let itemPath = path.join("./src/public/routes/", dir)
        if (fs.statSync(itemPath).isDirectory()) {
            fs.readdirSync(`./src/public/routes/${dir}`).forEach(file => {
                let getFile = require(`./routes/${dir}/${file}`)
                const verifyToken = (req, res, next) => {
                    const token = req.cookies['authorization'];
                    jwt.verify(token, process.env.JWT, async (err, decoded) => {
                        let getAccount;
                        if (!err && await Account.checkJwt(decoded.account_id, token)) getAccount = await Account.getAccountByAccountId(decoded.account_id)

                        if (decoded && !await Account.checkJwt(decoded.account_id, token)) {
                            res.clearCookie("authorization")
                            return res.status(404).redirect(`/login`)
                        }

                        if (decoded) {
                            decoded.role = getAccount?.role
                            req.basket = getAccount.getBasket() ? getAccount.getBasket() : []
                            req.user = decoded
                            getAccount.checkBasket()
                        }

                        const decodedBasket = await new Promise((resolve, reject) => {
                            jwt.verify(req.cookies["basket"], process.env.JWT, (err, decodedBasket) => {
                                if (!err) resolve({ status: true, basket: decodedBasket.basket });
                                else resolve({ status: false })
                            });
                        });

                        if (decodedBasket.status) {
                            const getAllDesktop = (await Desktop.getAll()).map(x => x.desktop_id);
                            if (compareArray(decodedBasket.basket.filter(x => getAllDesktop.includes(x.desktop_id)), decodedBasket.basket).length >= 1) {
                                decodedBasket.basket = decodedBasket.basket.filter(x => getAllDesktop.includes(x.desktop_id));
                                let newJWT = jwt.sign({ basket: decodedBasket.basket }, process.env.JWT, { expiresIn: 5 * 24 * 60 * 60 * 1000 });
                                res.clearCookie("basket");
                                res.cookie("basket", newJWT, { maxAge: 5 * 24 * 60 * 60 * 1000, httpOnly: true });
                            }
                            req.basket = decodedBasket.basket;
                        }

                        if (getFile.name.startsWith("/admin/")) {
                            if (err || !await Account.checkJwt(decoded.account_id, token)) return res.status(404).redirect(`/login`)
                            if (getAccount.role !== 2) return res.status(404).redirect("/")
                            next();
                        } else if (getFile.name.startsWith("/connect/account/delete/")) {
                            if (err || !await Account.checkJwt(decoded.account_id, token)) return res.status(404).redirect(`/login?redirect_url=${req.path}`)
                            next();
                        } else if (getFile.name.startsWith("/connect/")) {
                            if (err || !await Account.checkJwt(decoded.account_id, token)) return res.status(404).redirect("/login")
                            next();
                        } else if (getFile.name === "/signup" || getFile.name === "/login" || getFile.name === "reset-password") {
                            if (decoded) return res.status(404).redirect("/connect/account")
                            next();
                        } else next()
                    });
                };
                if (getFile && getFile.name) {
                    app.get(getFile.name, verifyToken, getFile.run)
                }
            })
        } else {
            let getFile = require(`./routes/${dir}`);
            const verifyToken = (req, res, next) => {
                const token = req.cookies['authorization'];
                jwt.verify(token, process.env.JWT, async (err, decoded) => {
                    let getAccount;
                    if (!err && await Account.checkJwt(decoded.account_id, token)) getAccount = await Account.getAccountByAccountId(decoded.account_id)

                    if (decoded && !await Account.checkJwt(decoded.account_id, token)) {
                        res.clearCookie("authorization")
                        return res.status(404).redirect(`/login`)
                    }

                    if (decoded) {
                        decoded.role = getAccount?.role
                        req.basket = getAccount.getBasket()
                        req.user = decoded
                        getAccount.checkBasket()
                    }

                    const decodedBasket = await new Promise((resolve, reject) => {
                        jwt.verify(req.cookies["basket"], process.env.JWT, (err, decodedBasket) => {
                            if (!err) resolve({ status: true, basket: decodedBasket.basket });
                            else resolve({ status: false })
                        });
                    });

                    if (decodedBasket.status) {
                        const getAllDesktop = (await Desktop.getAll()).map(x => x.desktop_id);
                        if (compareArray(decodedBasket.basket.filter(x => getAllDesktop.includes(x.desktop_id)), decodedBasket.basket).length >= 1) {
                            decodedBasket.basket = decodedBasket.basket.filter(x => getAllDesktop.includes(x.desktop_id));
                            let newJWT = jwt.sign({ basket: decodedBasket.basket }, process.env.JWT, { expiresIn: 5 * 24 * 60 * 60 * 1000 });
                            res.clearCookie("basket");
                            res.cookie("basket", newJWT, { maxAge: 5 * 24 * 60 * 60 * 1000, httpOnly: true });
                        }
                        req.basket = decodedBasket.basket;
                    }

                    next()
                });
            };
            if (getFile && getFile.name) {
                app.get(getFile.name, verifyToken, getFile.run);
            }
        }
    })

    fs.readdirSync("./src/backend/").forEach(dir => {
        fs.readdirSync(`./src/backend/${dir}`).forEach(file => {
            let getFile = require(`../backend/${dir}/${file}`)
            const verifyToken = (req, res, next) => {
                const token = req.cookies['authorization'];
                jwt.verify(token, process.env.JWT, async (err, decoded) => {
                    let getAccount;
                    if (!err && await Account.checkJwt(decoded.account_id, token)) getAccount = await Account.getAccountByAccountId(decoded.account_id)
                    if (decoded && !await Account.checkJwt(decoded.account_id, token)) {
                        res.clearCookie("authorization")
                        return res.status(404).redirect(`/login`)
                    }

                    if (decoded) {
                        decoded.role = getAccount?.role
                        req.basket = getAccount.getBasket()
                        req.user = decoded
                        getAccount.checkBasket()
                    }

                    const decodedBasket = await new Promise((resolve, reject) => {
                        jwt.verify(req.cookies["basket"], process.env.JWT, (err, decodedBasket) => {
                            if (!err) resolve({ status: true, basket: decodedBasket.basket });
                            else resolve({ status: false })
                        });
                    });

                    if (decodedBasket.status) {
                        const getAllDesktop = (await Desktop.getAll()).map(x => x.desktop_id);
                        if (compareArray(decodedBasket.basket.filter(x => getAllDesktop.includes(x.desktop_id)), decodedBasket.basket).length >= 1) {
                            decodedBasket.basket = decodedBasket.basket.filter(x => getAllDesktop.includes(x.desktop_id));
                            let newJWT = jwt.sign({ basket: decodedBasket.basket }, process.env.JWT, { expiresIn: 5 * 24 * 60 * 60 * 1000 });
                            res.clearCookie("basket");
                            res.cookie("basket", newJWT, { maxAge: 5 * 24 * 60 * 60 * 1000, httpOnly: true });
                        }
                        req.basket = decodedBasket.basket;
                    }

                    if (getFile.name.startsWith("/admin/")) {
                        if (err || !await Account.checkJwt(decoded.account_id, token)) return res.status(404).redirect(`/login`)
                        if (getAccount.role !== 2) return res.status(404).redirect("/")
                        next();
                    } else if (getFile.name.startsWith("/connect/account/delete/")) {
                        if (err || !await Account.checkJwt(decoded.account_id, token)) return res.status(404).redirect(`/login?redirect_url=${req.path}`)
                        next();
                    } else if (getFile.name.startsWith("/connect/")) {
                        if (err || !await Account.checkJwt(decoded.account_id, token)) return res.status(404).redirect("/login")
                        next();
                    } else if (getFile.name === "/signup" || getFile.name === "/login" || getFile.name === "reset-password") {
                        if (decoded) return res.status(404).redirect("/connect/account")
                        next();
                    }
                    else next()


                })
            };
            if (getFile && getFile.name) {
                app.post(getFile.name, verifyToken, getFile.run)
            }
        })
    })
})()