import svc from './service.js'
import passport from 'passport'
import GoogleStrategy from 'passport-google-oauth20'
import FacebookStrategy from 'passport-facebook'
import 'dotenv/config'

let GGStr = GoogleStrategy.Strategy


passport.use(new GGStr({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSec,
    callbackURL: "/user/google/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        return cb(null, profile)

    }
));
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/user/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null,profile) 
  }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});






const GGoauth = async (req, res, next) => {
    return res.status(200).json(req.user)
}

const FBoauth = async (req, res, next) => {
    return res.status(200).json(req.user)
}

const register = async (req, res, next) => {
    try {
        let userData = await svc.register(req.body)
        return res.status(200).json(userData)

    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        let user = await svc.login(req.body)

        return res.status(200).json(user)

    } catch (error) {
        next(error)
    }
}

const updateUser = async (req, res, next) => {
    try {
        let userInfo = req.body
        userInfo.id = req.data.id
        await svc.updateUser(userInfo, req.file)

        return res.status(200).send("DONE")
    } catch (error) {
        next(error)
    }
}

const updatePassword = async (req, res, next) => {
    try {

        let id = req.data.id
        let cre = { id, password: req.body.password }
        await svc.updatePassword(cre)
        return res.status(200).send("DONE")
    } catch (error) {
        next(error)
    }
}

const newPassword = async (req, res, next) => {
    try {

        let cre = { email: req.body.email, password: req.body.password }
        await svc.newPassword(cre)
        return res.status(200).send("DONE")
    } catch (error) {
        next(error)
    }
}


const getUser = async (req, res, next) => {
    try {

        let userData = await svc.getUser(req.query.id)
        return res.status(200).json(userData)
    } catch (error) {
        next(error)
    }
}

const getMyData = async (req, res, next) => {
    try {
        let id = req.data.id
        let mydata = await svc.getMyData(id)
        return res.status(200).json(mydata)

    } catch (error) {
        next(error)
    }
}

const getAllUser = async (req, res, next) => {
    try {
        if (req.data.role != 'admin') {
            return res.status(400).send("You are not allowed")
        }
        let users = await svc.getAllUser()
        return res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

const addResetEmail = async (req, res, next) => {
    try {
        let e_id = await svc.addResetEmail(req.body.email)
        return res.status(200).json(e_id)
    } catch (error) {
        next(error)
    }
}

const getResetEmail = async (req, res, next) => {
    try {
        let email = await svc.getEmail(req.query.id)
        return res.status(200).json(email)
    } catch (error) {
        next(error)
    }
}

const deleteResetEmail = async (req, res, next) => {
    try {
        await svc.deleteResetEmail(req.query.id)
        return res.status(200).send("done")
    } catch (error) {
        next(error)
    }
}

export default {FBoauth, GGoauth, addResetEmail, getResetEmail, deleteResetEmail, register, login, updateUser, updatePassword, getUser, getAllUser, getMyData, newPassword }