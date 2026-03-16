const { ref } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const ImageSchema = new Schema({
    url : String,
    filename : String
})
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
})

const opts = {toJSON : { virtuals : true}};

const CampgroundSchema = new Schema({
    images : [
        ImageSchema
    ],
    geometry:{
        type:{
            type: String,
            enum : ['Point'],
            required:true

        },
        coordinates:{
            type:[Number],
            required : true
        }
    },
    title: String,
    price: Number,
    description: String,
    image: String,
    location: String,
    author : {
        type : Schema.Types.ObjectId,
        ref:'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
},opts);

CampgroundSchema.virtual('properties.popUp').get(function(){
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    `
});
CampgroundSchema.post('findOneAndDelete',async function(campground){
    if(campground){
        await Review.deleteMany({_id: {$in : campground.reviews}});
        
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);