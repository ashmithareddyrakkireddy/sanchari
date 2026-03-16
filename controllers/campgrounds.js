const { cloudinary } = require('../cloudinary');
const Campground =require('../models/campground');
const mpbox = require('@mapbox/mapbox-sdk/services/geocoding');
const token = process.env.MAPBOX_TOKEN
const geocoder = mpbox({accessToken : token});

module.exports.renderAll = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('index', { campgrounds });
}

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('edit', { campground });
}

module.exports.editCampground = async (req, res) => {
    console.log(req.body);
    const {id}=req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error',"campground not found");
        return res.redirect('/campgrounds');
    }
    const imgs = req.files.map(f=>({
        url: f.path,
        filename : f.filename
    }))

    await Campground.findByIdAndUpdate({ _id: id }, { ...req.body.campground });
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
        await campground.updateOne({$pull : {images : {filename :{
            $in : req.body.deleteImages
        }}}});

        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
    }
    req.flash('success',"Successfully updated the campground");
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success',"Deleted the campground");
    res.redirect('/campgrounds');
}

module.exports.renderNewForm = async (req, res) => {
    res.render('new');
}

module.exports.addNewCampground = async (req, res) => {

    const geodata = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit : 1
    }).send();
    // res.send('ehrbdui');

    const campground = new Campground(req.body.campground);
    campground.geometry = geodata.body.features[0].geometry;
    campground.images= req.files.map(f=>({
        url:f.path,
        filename : f.filename
    }))
    console.log(campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new Campground');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate(
        {
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');
    if (!campground) {
        req.flash('error', "Campground not found");
        return res.redirect('/campgrounds');
    }
    res.render('show', { campground });
}

