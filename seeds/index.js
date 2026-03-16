const mongoose = require('mongoose');
const path = require('path');
// const Campground = require('./models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const Campground = require('../models/campground');
// const campground = require('../models/campground');

let seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const rand = Math.floor(Math.random() * cities.length);
        const newcamp = new Campground({
            author : '6660937cb19356e0707b06ff',
            location: `${cities[rand].city} ${cities[rand].state}`,
            geometry: { 
              type: 'Point',
               coordinates: [cities[rand].lon,cities[rand].lat]
             },
            title: `${descriptors[Math.floor(Math.random() * descriptors.length)]} ${places[Math.floor(Math.random() * places.length)]}`,
            images: [
              
                {
                  url: 'https://res.cloudinary.com/dej07g3oj/image/upload/v1718005404/Yelpcamp/p4ti4kuw2snmk1ixa5mn.jpg',
                  filename: 'Yelpcamp/p4ti4kuw2snmk1ixa5mn'
                }
              ],
            price: Math.floor(Math.random()*200) + 100,
            description:'Kullu’s mountainous landscape makes it the best placeto enjoy camping. Peak summer is the best time to enjoy camping here. May andJune are the prime months.'

        });
    await newcamp.save();

    }
}

seedDB()
    .then(() => {
        db.close();
    })