//jshint esversion:10
require('dotenv').config();

const express = require('express');
const path = require('path');
const hbs = require('hbs');
const Publication = require('./models/publication');
const mongoose = require('mongoose');
const { appendFile } = require('fs');


const app = express();

hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
    extended: true
}));


app.get('/', ((req, res) => {
    Publication.find({})
    .then(publications => {
        res.render('home', {
            publications
        });
    })
    .catch(error => {
        next(error);
    });
}));

app
    .get('/publish', ((req, res) => {
        res.render('publish');
    }))
    .get('/publication/:id', (req, res) => {
        const id = req.params.id;
        Publication.findById(id)
            .then((publication)=> {
                res.render('publication-detail', {
                    publication
                });
            })
            .catch(error => {
                next(error);
            })
    })
    .get('/error', (req, res) => {
        res.render('error');
    })
    .post('/publish', (req, res) => {
        console.log(req.body);

        let title = req.body.title;
        let url = req.body.url;

        Publication.create({
            title: title,
            url: url
        })
            .then((publication) => {
                res.redirect('/');
            })
            .catch(error => {
                next(error);
            });

    });

    app.get('*', (req, res) => {
        res.render('error');
    });

    app.use((error, req, res, next) => {
        res.render('/error');
    })

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('Server fired @ port 3000.');
        });
    })
    .catch(error => {
        console.log(error.message);
    });
