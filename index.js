const express = require('express'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    Models = require('./models.js');

const { check, validationResult } = require('express-validator');

    const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/cfDB');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

const cors = require('cors');
app.use(cors());

// Replace app.use(cors()); with following to allow only certain origins:
// app.use(cors({
//     origin: (origin, callback) => {
//         if(!origin) return callback(null, true);
//         if(allowedOrigins.indexOf(origin) === -1){
//             let message = 'The CORS policy for this application does not allow access from origin ' + origin;
//             return callback(new Error(message), false);
//         }
//         return callback(null, true);
//     }
// }));

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

const port = 8080;


// MIDDLEWARE
app.use(morgan('common')); // Invoke Morgan logger
app.use(express.static('public')); // Serve `documentation.html` from public folder

// GET route for default text response
app.get('/', (req, res) => {
    res.send('Welcome to my Movie API!');
});

// Return list of all movies (Mongoose GET route)
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});


// Return information about single movie by title (Mongoose GET route)
app.get('/movies/:Title', passport.authenticate('jwt', { session: false}), async (req, res) => {
    await Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            if (movie) {
                res.json(movie);
            } else {
                res.status(404).send('Movie not found.');
            }
            })
        .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error)
    });
});


// Return information about single genre by name (Mongoose GET route)
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ 'Genre.Name': req.params.genreName })
        .then((movie) => {
            if (movie) {
                res.json(movie.Genre);
            } else {
                res.status(404).send('Genre not found.');
            }
            })
        .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error)
    });
});


// Return information about single director by name (Mongoose GET route)
app.get('/movies/director/:directorName', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ 'Director.Name': req.params.directorName })
        .then((movie) => {
            if (movie) {
                res.json(movie.Director);
            } else {
                res.status(404).send('Director not found.');
            }
            })
        .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error)
    });
});


// Add user (Mongoose-compatible POST request)
app.post('/users',
    [
        check('Username', 'Username is required.').isLength({min: 5}),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required.').not().isEmpty(),
        check('Email', 'Email does not appear to be valid.').isEmail()
    ], async (req, res) => {

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + ' already exists.');
            } else {
                Users
                    .create({
                        Username: req.body.Username,
                        Password: hashedPassword,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    })
                    .then((user) => {res.status(201).json(user) })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send('Error: ' + error);
                    })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});


// Allow users to update *birthday ONLY* without re-entry of login details (Mongoose PUT route)
app.put('/users/:Username/profile', passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        if(req.user.Username !== req.params.Username){
            return res.status(400).send('Permission denied.');
        }

        await Users.findOneAndUpdate({ Username: req.params.Username },
            { $set: {
                Birthday: req.body.Birthday
            }},
            { new: true })
            .then((updatedUser) => {
                if (updatedUser) {
                    res.json(updatedUser);
                } else {
                    res.status(404).send('Username not found.');
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error)
            });
    });

// Allow users to update secure info *only* with re-entry of login details (Mongoose PUT route)
app.put('/users/:Username/security',
    [
        check('CurrentPassword', 'Current password is required.').not().isEmpty(),
        check('Username', 'Username must be at least 5 characters.').optional().isLength({min: 5}),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').optional().isAlphanumeric(),
        check('NewPassword', 'New password must be at least 5 characters.').optional().isLength({min: 5}),
        check('Email', 'Email does not appear to be valid.').optional().isEmail()
    ],
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }

        if(req.user.Username !== req.params.Username){
            return res.status(400).send('Permission denied.');
        }

        const user = await Users.findOne({ Username: req.params.Username });
        if (!user) {
            return res.status(404).send('User not found.');
        }

        if (!user.validatePassword(req.body.CurrentPassword)) {
            return res.status(401).send('Current password is incorrect.');
        }

        let updateFields = {};
        if (req.body.Username) updateFields.Username = req.body.Username;
        if (req.body.Email) updateFields.Email = req.body.Email;
        if (req.body.NewPassword) updateFields.Password = Users.hashPassword(req.body.NewPassword);

        await Users.findOneAndUpdate(
            { Username: req.params.Username },
            { $set: updateFields },
            { new: true }
        )
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error)
    });
});


// Allow user to add movie to favorites list (Mongoose POST route)
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied.');
    }
    const movie = await Movies.findById(req.params.MovieID);
    if (!movie) {
        return res.status(404).send('Movie not found.');
    }
    await Users.findOneAndUpdate(
        { Username: req.params.Username },
        { $push: { FavoriteMovies: req.params.MovieID }},
        { new: true }
    )
    .then((updatedUser) => {
        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).send('Username not found.');
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error)
    });
});


// Allow users to remove movie from list of favorites (Mongoose DELETE route)
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied.');
    }
    const movie = await Movies.findById(req.params.MovieID);
    if (!movie) {
        return res.status(404).send('Movie not found.');
    }
    await Users.findOneAndUpdate(
        { Username: req.params.Username },
        { $pull: { FavoriteMovies: req.params.MovieID }},
        { new: true }
    )
    .then((updatedUser) => {
        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).send('Username not found.');
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error)
    })
});


// Allow existing users to deregister only after password validation (Mongoose DELETE route)
app.delete('/users/:Username',
    [
        check('Password', 'Password is required to delete user.').not().isEmpty()
    ],
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        if (req.user.Username !== req.params.Username){
            return res.status(400).send('Permission denied.');
        }

        const user = await Users.findOne({ Username: req.params.Username });
        if (!user) {
            return res.status(404).send('User not found.');
        }

        if (!user.validatePassword(req.body.Password)) {
            return res.status(401).send('Password is incorrect.');
        }

    await Users.findOneAndDelete({ Username: req.params.Username })
    .then((user) => {
        if (!user) {
            res.status(400).send(req.params.Username + ' was not found.');
        } else {
            res.status(200).send(req.params.Username + ' was deleted.')
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error); 
    });
});


// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something isn\'t working right!');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});