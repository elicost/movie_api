const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

const app = express();

const port = 8080;

let users = [
    {
        id: 1,
        name: "Meredith",
        favoriteMovies: []
    },
    {
        id: 2,
        name: "Eli",
        favoriteMovies: [
            "Superbad",
            "Paris, Texas",
            "Thief"
        ]
    }
];

// Placeholder movie information
let movies = [
    {
        title: "The Fall",
        description: "In 1920s Los Angeles, a bedridden patient in a hospital captivates a young girl with a fantastic tale of heroes, myths, and villains on a desert island.",
        genre: {
            name: "Adventure",
            description: "The adventure genre features exciting journeys, quests, or expeditions undertaken by characters who often face challenges, obstacles, and risks in pursuit of a goal. Adventures can take place in a wide range of settings, from exotic and fantastical locations to historical or even everyday environments."
        },
        director: {
            name: "Tarsem Singh",
            bio: "Indian director Tarsem Singh is the son of an aircraft engineer. He was educated at Bishop Cotton Boy's School in Shimla and relocated to the USA to study business at Harvard and, significantly, film studies at the Art Center College of Design in California.",
            birth: 1961.0
        },
        imageUrl: "https://a.ltrbxd.com/resized/film-poster/4/2/8/2/2/42822-the-fall-0-1000-0-1500-crop.jpg?v=21978da70d",
        featured: false
    },
    {
        title: "One Battle After Another",
        description: "When their evil enemy resurfaces after 16 years, a group of ex-revolutionaries reunite to rescue the daughter of one of their own.",
        genre: {
            name: "Psychological Thriller",
            description: "The psychological thriller subgenre features the psychological and emotional states of characters, as well as the tension and suspense created through their mental and emotional experiences. These stories often involve intricate plots, complex characters, and situations that challenge the perceptions and sanity of the protagonists."
        },
        director: {
            name: "Paul Thomas Anderson",
            bio: "Anderson was one of the first of the 'video store' generation of film-makers. His father was the first man on his block to own a V.C.R., and from a very early age Anderson had an infinite number of titles available to him. While film-makers like Spielberg cut their teeth making 8 mm films, Anderson cut his teeth shooting films on video and editing them from VCR to VCR.",
            birth: 1970.0
        },
        imageUrl: "https://a.ltrbxd.com/resized/film-poster/9/5/1/2/7/7/951277-one-battle-after-another-0-1000-0-1500-crop.jpg?v=d27c4cc662",
        featured: false
    },
    {
        title: "Prisoners",
        description: "A desperate father takes the law into his own hands after police fail to find two kidnapped girls.",
        genre: {
            name: "Psychological Thriller",
            description: "The psychological thriller subgenre features the psychological and emotional states of characters, as well as the tension and suspense created through their mental and emotional experiences. These stories often involve intricate plots, complex characters, and situations that challenge the perceptions and sanity of the protagonists."
        },
        director: {
            name: "Denis Villeneuve",
            bio: "Denis Villeneuve is a French-Canadian film director and writer. He was born in Trois-Rivières, Québec, Canada. He started his career as a filmmaker at the National Film Board of Canada. He is best known for his feature films Arrival (2016), Sicario (2015), Prisoners (2013), Enemy (2013), and Incendies (2010). He is married to Tanya Lapointe.",
            birth: 1967.0
        },
        imageUrl: "https://a.ltrbxd.com/resized/sm/upload/iw/eg/4g/nm/3w79tTsv6tmlT8Jww6snyPrgVok-0-1000-0-1500-crop.jpg?v=778c7ae8b8",
        featured: false
    },
    {
        title: "Superbad",
        description: "Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry.",
        genre: {
            name: "Comedy",
            description: "The comedy genre refers to a category of entertainment that aims to amuse and entertain audiences by using humor, wit, and comedic situations. Comedies are created with the primary intention of eliciting laughter and providing lighthearted enjoyment. They encompass a wide range of styles, tones, and themes, appealing to various tastes and audiences."
        },
        director: {
            name: "Greg Mottola",
            bio: "Greg Mottola was born in Dix Hills, Long Island, New York, USA. He is a producer and director, known for The Daytrippers (1996), Adventureland (2009) and Superbad (2007). He is married to Sarah Allentuch. They have three children.",
            birth: 1964.0
        },
        imageUrl: "https://a.ltrbxd.com/resized/film-poster/4/7/7/7/6/47776-superbad-0-1000-0-1500-crop.jpg?v=b43686efcb",
        featured: false
    },
    {
        title: "Comeing to America",
        description: "An extremely pampered African prince travels to Queens, New York and goes undercover to find a wife that he can respect for her intelligence and strong will.",
        genre: {
            name: "Comedy",
            description: "The comedy genre refers to a category of entertainment that aims to amuse and entertain audiences by using humor, wit, and comedic situations. Comedies are created with the primary intention of eliciting laughter and providing lighthearted enjoyment. They encompass a wide range of styles, tones, and themes, appealing to various tastes and audiences."
        },
        director: {
            name: "John Landis",
            bio: "John Landis is an influential American director, screenwriter, producer, and actor known for shaping 1980s comedy and music video culture. Rising from a teenage production assistant to directing classics like Animal House (1978), The Blues Brothers (1980), and Trading Places (1983), he famously directed Michael Jackson's 'Thriller'.",
            birth: 1950.0
        },
        imageUrl: "https://a.ltrbxd.com/resized/film-poster/4/6/9/9/9/46999-coming-to-america-0-1000-0-1500-crop.jpg?v=c3f2f6328e",
        featured: false
    },
    {
        title: "The Northman",
        description: "A young Viking prince is on a quest to avenge his father's murder.",
        genre: {
            name: "Adventure",
            description: "The adventure genre features exciting journeys, quests, or expeditions undertaken by characters who often face challenges, obstacles, and risks in pursuit of a goal. Adventures can take place in a wide range of settings, from exotic and fantastical locations to historical or even everyday environments."
        },
        director: {
            name: "Robert Eggers",
            bio: "Robert Houston Eggers is an American filmmaker and production designer. He is best known for writing and directing the historical horror films The Witch (2015) and The Lighthouse (2019), as well as directing and co-writing the historical fiction epic film The Northman (2022). His films are noted for their folkloric elements, as well as his efforts to ensure historical authenticity.",
            birth: 1983.0
        },
        imageUrl: "https://a.ltrbxd.com/resized/film-poster/5/6/5/8/5/2/565852-the-northman-0-1000-0-1500-crop.jpg?v=8e3d277969",
        featured: false
    },
    {
        title: "Thief",
        description: "After spending years in prison, a top safe-cracker owns a couple of businesses, which are fronts for diamond heists. After his trusted fence is killed, he agrees to work with a powerful mobster, but to dire consequences.",
        genre: {
            name: "Heist",
            description: "The heist subgenre features meticulously planned and executed thefts, typically involving valuable objects, money, or high-stakes targets. Heist stories often center on a group of skilled individuals who collaborate to pull off a complex and often daring robbery, showcasing their expertise, strategy, and resourcefulness."
        },
        director: {
            name: "Michael Mann",
            bio: "As a director, screenwriter, and producer, four-time Academy Award nominee Michael Mann has established himself as one of the most innovative and influential filmmakers in American cinema. After writing and directing the Primetime Emmy Award-winning television movie The Jericho Mile (1979), Mann made his feature-film directorial debut with Thief (1981), followed by executive producing the television series Miami Vice (1984). He went on to direct Manhunter (1986), The Last of the Mohicans (1992), Heat (1995), and The Insider (1999), Ali (2001), Collateral (2004), a film adaptation of Miami Vice (2006), Public Enemies (2009), and Blackhat (2015).",
            birth: 1943.0
        },
        imageUrl: "https://a.ltrbxd.com/resized/film-poster/4/5/2/2/4/45224-thief-0-1000-0-1500-crop.jpg?v=775424c4c3",
        featured: false
    },
    {
        title: "The Seventh Seal",
        description: "A knight returning to Sweden after the Crusades seeks answers about life, death, and the existence of God as he plays chess against the Grim Reaper during the Black Plague.",
        genre: {
            name: "Drama",
            description: "The drama genre is a broad category that features stories portraying human experiences, emotions, conflicts, and relationships in a realistic and emotionally impactful way. Dramas delve into the complexities of human life, often exploring themes of love, loss, morality, societal issues, personal growth, with the aim to evoke an emotional response from the audience by presenting relatable and thought-provoking stories."
        },
        director: {
            name: "Ingmar Bergman",
            bio: "Ingmar Bergman was a seminal Swedish director, writer, and producer recognized as one of cinema's most influential auteurs. Known for exploring profound existential themes—mortality, faith, and human relationships—he directed over 60 films and 170 stage productions, with masterpieces including The Seventh Seal, Wild Strawberries, and Persona.",
            birth: 1918.0
        },
        imageUrl: "https://a.ltrbxd.com/resized/film-poster/5/1/6/2/0/51620-the-seventh-seal-0-1000-0-1500-crop.jpg?v=fa1963f0b2",
        featured: false
    },
    {
        title: "Hereditary",
        description: "A grieving family is haunted by tragic and disturbing occurrences.",
        genre: {
            name: "Horror",
            description: "The horror genre features stories that aim to elicit fear, suspense, and a sense of dread in its audience. Horror stories often explore themes related to the unknown, the supernatural, and the macabre, and they frequently evoke strong emotional reactions such as anxiety, terror, and unease."
        },
        director: {
            name: "Ari Aster",
            bio: "Ari Aster is an American film director, screenwriter, and producer. He is known for writing and directing the A24 horror films Hereditary (2018) and Midsommar (2019). Aster was born into a Jewish family in New York City on July 15, 1986, the son of a poet mother and musician father. He has a younger brother. He recalled going to see his first movie, Dick Tracy, when he was four years old.",
            birth: 1986.0
        },
        imageUrl: "https://a.ltrbxd.com/resized/film-poster/4/2/4/3/4/8/424348-hereditary-0-1000-0-1500-crop.jpg?v=470e48b681",
        featured: false
    },
    {
        title: "Paris, Texas",
        description: "Travis Henderson, an aimless drifter who has been missing for four years, wanders out of the desert and must reconnect with society, himself, his life, and his family.",
        genre: {
            name: "Drama",
            description: "The drama genre is a broad category that features stories portraying human experiences, emotions, conflicts, and relationships in a realistic and emotionally impactful way. Dramas delve into the complexities of human life, often exploring themes of love, loss, morality, societal issues, personal growth, with the aim to evoke an emotional response from the audience by presenting relatable and thought-provoking stories."
        },
        director: {
            name: "Wim Wenders",
            bio: "Wim Wenders is a renowned German filmmaker, photographer, and key figure of the 1970s New German Cinema movement. Known for contemplative road movies, themes of alienation, and poetic landscapes, he has directed acclaimed films like Paris, Texas (1984), Wings of Desire (1987), and Buena Vista Social Club (1999).",
            birth: 1945.0
        },
        imageUrl: "https://a.ltrbxd.com/resized/film-poster/5/1/4/6/9/51469-paris-texas-0-1000-0-1500-crop.jpg?v=c8f2743612",
        featured: false
    }
];

// MIDDLEWARE
app.use(morgan('common')); // Invoke Morgan logger
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(express.static('public')); // Serve `documentation.html` from public folder

// GET route for default text response
app.get('/', (req, res) => {
    res.send('Welcome to my Movie API!');
});

// GET route for returning list of all movies
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

// GET route for returning information about single movie by title
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find( movie => movie.title === title );

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('Movie not found.')
    }
});

// GET route for returning information about single genre by name
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find( movie => movie.genre.name === genreName ).genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('Genre not found.')
    }
});

// GET route for returning information about single director by name
app.get('/movies/director/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find( movie => movie.director.name === directorName ).director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('Director not found.')
    }
});

// POST route for allowing new user to register
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    } else {
        res.status(400).send('New user creation missing name.')
    }
});

// PUT route for allowing existing users to update name
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find( user => user.id == id );

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('User not found.')
    }
});

// POST route for allowing user to add movie to favorites list
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id );

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been addded to ${id}'s array.`);
    } else {
        res.status(400).send('User or movie not found.')
    }
});

// DELETE route for allowing user to delete movie from favorites list
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id );

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle )
        res.status(200).send(`${movieTitle} has been removed from ${id}'s array.`);
    } else {
        res.status(400).send('User or movie not found.')
    }
});

// DELETE route for allowing existing user to deregister
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find( user => user.id == id );

    if (user) {
        users = users.filter( user => user.id != id )
        res.status(200).send(`User ${id}'s has been deleted.`);
    } else {
        res.status(400).send('User not found.')
    }
});



// Error handling function
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something isn\'t working right!');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});