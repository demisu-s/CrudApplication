const express = require("express");
const router = express.Router();
const User = require("../models/users");
const multer = require("multer");
const fs=require('fs')

// image uploading
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("image");

// insert user to database route
router.post('/add', async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        return res.json({ message: err.message, type: 'danger' });
      }

      const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename
      });

      await user.save();

      req.session.message = {
        type: 'success',
        message: "User added successfully"
      };
      res.redirect('/');
    });
  } catch (err) {
    res.json({
      message: err.message,
      type: 'danger'
    });
  }
});



//fetch to add users rout
router.get("/", async (req, res) => {
  try {
    const users = await User.find().exec();
    res.render('index', {
      title: 'Home Page',
      users: users,
    });
  } catch (err) {
    res.json({ message: err.message });
  }
});


router.get("/add", (req, res) => {
  res.render("add_users", { title: "Add User", message: req.session.message });
});

// Edit user route
router.get('/edit/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).exec();

    if (user === null) {
      return res.redirect('/');
    }

    res.render("edit_users", {
      title: "Edit User",
      user: user,
    });
  } catch (err) {
    res.redirect('/');
  }
});
// Update users
router.post('/update/:id', upload, async (req, res) => {
  try {
    const id = req.params.id;
    let new_image = '';

    if (req.file) {
      new_image = req.file.filename;
      try {
        fs.unlinkSync("./uploads/" + req.body.old_image);
      } catch (err) {
        console.log(err);
      }
    } else {
      new_image = req.body.old_image;
    }

    await User.findByIdAndUpdate(id, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: new_image,
    });

    req.session.message = {
      type: 'success',
      message: 'User updated successfully',
    };
    res.redirect('/');
  } catch (err) {
    res.json({
      message: err.message,
      type: 'danger',
    });
  }
}); 

// Delete user route
router.get('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndRemove(id);

    if (user === null) {
      return res.redirect('/');
    }

    // Also, remove the image file associated with the deleted user
    try {
      fs.unlinkSync("./uploads/" + user.image);
    } catch (err) {
      console.log(err);
    }

    req.session.message = {
      type: 'success',
      message: 'User deleted successfully',
    };
    res.redirect('/');
  } catch (err) {
    res.redirect('/');
  }
});




// contact  
router.post('/contact', async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        return res.json({ message: err.message, type: 'danger' });
      }

      const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename
      });

      await user.save();

      req.session.message = {
        type: 'success',
        message: "User added successfully"
      };
      res.redirect('/');
    });
  } catch (err) {
    res.json({
      message: err.message,
      type: 'danger'
    });
  }
});



//fetch to add users rout
router.get("/", async (req, res) => {
  try {
    const users = await User.find().exec();
    res.render('index', {
      title: 'Home Page',
      users: users,
    });
  } catch (err) {
    res.json({ message: err.message });
  }
});


router.get("/contact", (req, res) => {
  res.render("contact_us", { title: "Contact Us page", message: req.session.message });
});





module.exports = router;
