const hallDAO = require('../models/hallModel');
const userDao = require('../models/userModel.js');
const auth = require('../auth/auth.js');
const { ensureLoggedIn } = require('connect-ensure-login');
const db = new hallDAO();
const moment = require('moment');

db.init();

exports.landing_page = function (req, res) {
  const classPromise = db.getAllClassEntries();
  const communityPromise = db.getAllCommunityEntries();

  Promise.all([classPromise, communityPromise])
    .then(([classEntries, communityEntries]) => {
      res.render('entries', {
        'title': 'Community Hall',
        'classEntries': classEntries,
        'communityEntries': communityEntries,
        'user': req.user
      });
      console.log('promises resolved');
    })
    .catch((err) => {
      console.log('promises rejected', err);
    });
}


exports.show_new_entries = function (req, res) {
  res.render('newEntry', {
    'title': 'Community Hall',
    'user': req.user
  })
}


exports.post_new_entry = function (req, res) {
  console.log('processing post-new_entry controller');
  if (!req.body.author) {
    res.status(400).send("Entries must have an author.");
    return;
  }

  console.log('adding');
  db.addEntry(
    req.body.author,
    req.body.eventTitle,
    req.body.eventType,
    req.body.eventPrice,
    req.body.eventDate,
    req.body.contactNumber,
  );
  res.redirect('/');
}




exports.show_user_entries = function (req, res) {
  let user = req.params.author;
  db.getEntriesByUser(user)
    .then((entries) => {
      res.render('entries', {
        'title': 'Community Hall',
        'user': req.user,
        'entries': entries
      });
    })
    .catch((err) => {
      console.log('Error: ')
      console.log(JSON.stringify(err))
    });
}

exports.show_register_page = function (req, res) {
  res.render("user/register", {
    'title': 'Register',
    'user': req.user
  });
}

exports.post_new_user = function (req, res) {
  const user = req.body.username;
  const password = req.body.password;

  if (!user || !password) {
    res.send(401, 'Username and password are required');
    return;
  }
  userDao.lookup(user, function (err, u) {
    if (u) {
      res.send(401, "User already exists:", user);
      return;
    }
    userDao.create(user, password);
    console.log("register user", user, "password", password);
    res.redirect('/login');
  });
}

exports.show_login_page = function (req, res) {
  res.render("user/login");
};

exports.show_about_page = function (req, res) {
  res.render('about', {
    'title': 'About Us',
    'user': req.user
  })
}

exports.show_delete_page = function (req, res) {
  db.getAllEntries().then((entries) => {
    res.render('deleteEntry', {
      'title': 'Delete Entry',
      'user': req.user,
      'entries': entries
    });
  }).catch((err) => {
    console.log('promise rejected', err);
    res.status(500).send("Error fetching entries");
  });
}

exports.show_edit_page = function (req, res) {
  db.getAllEntries().then((entries) => {
    res.render('editEntry', {
      'title': 'Edit Entry',
      'user': req.user,
      'entries': entries
    });
  }).catch((err) => {
    console.log('promise rejected', err);
    res.status(500).send("Error fetching entries");
  });
}

exports.authorize = function (redirect) {
  return passport.authenticate('local',
    { failureRedirect: redirect });
};

exports.post_login = function (req, res) {
  res.redirect("/");
};

exports.logout = function (req, res) {
  req.logout();
  res.redirect("/");
};

exports.loggedIn_landing = function (req, res) {
  db.getAllEntries().then((list) => {
    res.render('entries', {
      'title': 'Community Hall',
      'user': req.user,
      'entries': list
    });

  }).catch((err) => {
    console.log('promise rejected', err);
  })
}


exports.delete_entry = function (req, res) {
  const entryIdToDelete = req.body.entryToDelete;
  if (entryIdToDelete) {
    db.deleteEntry(entryIdToDelete).then(() => {
      res.redirect("/");
    }).catch((err) => {
      console.log('Error deleting entry:', err);
      res.status(500).send("Error deleting entry");
    });
  } else {
    res.status(400).send("Invalid entry id");
  }
};


exports.update_entry = function (req, res) {
  const entryIdToUpdate = req.body.entryToUpdate;
  console.log(entryIdToUpdate);
  const updatedEntry = {
    author: req.body.author,
    eventTitle: req.body.eventTitle,
    eventType: req.body.eventType,
    eventPrice: req.body.eventPrice,
    eventDate: req.body.eventDate,
    contactNumber: req.body.contactNumber

  };

  if (entryIdToUpdate) {
    db.updateEntry(entryIdToUpdate, updatedEntry).then(() => {
      res.redirect("/");
    }).catch((err) => {
      console.log('Error updating entry:', err);
      res.status(500).send("Error updating entry");
    });
  } else {
    res.status(400).send("Invalid entry id");
  }
};

exports.show_availability_page = function (req, res) {
  const today = moment();
  const nextMonth = req.query.nextMonth ? today.clone().add(2, 'months') : today.clone().add(1, 'months');

  const unavailableDates = new Set();

  db.getAllEntries()
    .then((entries) => {
      entries.forEach((entry) => {
        const entryDate = moment(entry.eventDate);
        if (entryDate.isBetween(today, nextMonth, null, '[]')) {
          unavailableDates.add(entryDate.format('YYYY-MM-DD'));
        }
      });

      let currentDate = today.clone();
      const availability = [];

      while (currentDate.isBefore(nextMonth)) {
        const currentDateStr = currentDate.format('YYYY-MM-DD');
        availability.push({
          date: currentDateStr,
          status: unavailableDates.has(currentDateStr) ? 'Unavailable' : 'Available',
          statusClass: unavailableDates.has(currentDateStr) ? 'unavailable' : ''
        });
        currentDate.add(1, 'days');
      }

      res.render('availability', {
        'title': 'Hall Availability',
        'availability': availability,
        'user': req.user
      });
    })
    .catch((err) => {
      console.log('promise rejected', err);
      res.status(500).send("Error fetching entries");
    });
};


