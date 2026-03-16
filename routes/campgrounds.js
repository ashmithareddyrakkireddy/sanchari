const express = require('express')
const router = express.Router();
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../utils/middleware');
const multer= require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});


router.route('/')
    .get(catchAsync(campgrounds.renderAll))
    // .post(upload.single('image'),(req,res,next)=>{
    //     console.log(req.file)
    //     console.log(req.body);
    //     res.send('4g3frd')
    // })
    .post(isLoggedIn,upload.array('image'),validateCampground, catchAsync(campgrounds.addNewCampground));




router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))
router.get('/new', isLoggedIn, catchAsync(campgrounds.renderNewForm));



router.route('/:id')
    .patch(isLoggedIn, isAuthor,upload.array('image'), validateCampground, catchAsync(campgrounds.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))
    .get( catchAsync(campgrounds.showCampground))

// router.get('/makecampground', async (req, res) => {
//     const camp = new Campground({ title: "hall lawn", description: "easy camping" });
//     await camp.save();
//     res.send(camp);
// })

module.exports = router;