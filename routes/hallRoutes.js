const express = require('express');
const router = express.Router();
const controller = require('../controllers/hallControllers.js');
const auth = require('../auth/auth.js');

const ensureLoggedIn = require('connect-ensure-login');

router.get('/availability', controller.show_availability_page);

router.get('/about', controller.show_about_page);


router.get("/", controller.landing_page);


router.get('/new', ensureLoggedIn.ensureLoggedIn(), controller.show_new_entries);
router.post('/new', ensureLoggedIn.ensureLoggedIn(), controller.post_new_entry);

router.get('/posts/:author', controller.show_user_entries);

router.get('/register', controller.show_register_page);
router.post('/register', controller.post_new_user);

router.get('/login', controller.show_login_page);
router.post("/login", auth.authorize("/login"), controller.post_login);


router.get("/loggedIn", controller.loggedIn_landing);

router.get("/logout", controller.logout);

router.get('/delete', ensureLoggedIn.ensureLoggedIn(), controller.show_delete_page);
router.post('/delete', ensureLoggedIn.ensureLoggedIn(), controller.delete_entry);

router.get('/edit', ensureLoggedIn.ensureLoggedIn(), controller.show_edit_page);
router.post('/edit', ensureLoggedIn.ensureLoggedIn(), controller.update_entry);

router.use(function (req, res) {
    res.status(404);
    res.type('text/plain');
    res.send('404 Not found.');
});

router.use(function (err, req, res, next) {
    res.status(500);
    res.type('text/plain');
    res.send('Internal Server Error.');
});



module.exports = router;