const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

const app = express();

const port = 8080;

// Placeholder movie information
let topMovies = [
    {
        title: 'The Fall',
        director: 'Tarsem Singh'
    },
    {
        title: 'One Battle After Another',
        director: 'Paul Thomas Anderson'
    },
    {
        title: 'Prisoners',
        director: 'Denis Villeneuve'
    },
    {
        title: 'Superbad',
        director: 'Greg Mottola'
    },
    {
        title: 'The Holdovers',
        director: 'Alexander Payne'
    },
    {
        title: 'Thief',
        director: 'Michael Mann'
    },
    {
        title: 'No Country for Old Men',
        director: 'Joel and Ethan Coen'
    },
    {
        title: 'The Seventh Seal',
        director: 'Ingmar Bergman'
    },
    {
        title: 'Hereditary',
        director: 'Ari Aster'
    },
    {
        title: 'Paris, Texas',
        director: 'Wim Wenders'
    },
    {
        title: 'Sorry to Bother You',
        director: 'Boots Riley'
    },
    {
        title: 'Casino',
        director: 'Martin Scorcese'
    },
    {
        title: 'Perfect Blue',
        director: 'Satoshi Kon'
    },
    {
        title: 'Mulholland Drive',
        director: 'David Lynch'
    },
    {
        title: 'High and Low',
        director: 'Akira Kurosawa'
    },
    {
        title: 'Children of Men',
        director: 'Alfonso Cuarón'
    }
];

// Invoke Morgan logger
app.use(morgan('common'));

// Serve `documentation.html` from public folder
app.use(express.static('public'));

// GET route for default text response
app.get('/', (req, res) => {
    res.send('Welcome to my Movie API!');
});

// GET route for returning JSON object
app.get('/movies', (req, res) => {
    res.json(topMovies);
});

// Error handling function
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something isn\'t working right!');
});

app.listen(port, () => {
    console.log('Listening on port ${port}');
});