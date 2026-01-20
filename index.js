const express = require('express'),
    morgan = require('morgan');

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
    }

    // Up to ten movies here
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