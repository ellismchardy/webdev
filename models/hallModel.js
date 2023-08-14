const nedb = require('nedb');
class communityHall {
    constructor(dbFilePath) {
        if (dbFilePath) {
            this.db = new nedb({ filename: dbFilePath, autoload: true });
            console.log('DB connected to ' + dbFilePath);
        } else {
            this.db = new nedb();
        }
    }

    init() {
        this.db.insert({
            eventTitle: 'Circus Show',
            eventType: 'Class',
            eventPrice: '£15 Adults £5 Children',
            eventDate: '2023-08-22',
            contactNumber: '07369 226536',
            published: '2020-02-16',
            author: 'Peter'
        });

        this.db.insert({
            eventTitle: 'Clothing Sale',
            eventType: 'Community',
            eventPrice: 'Free Entry',
            eventDate: '2023-08-19',
            contactNumber: '07369 226536',
            published: '2020-02-16',
            author: 'Ann'
        });

        this.db.insert({
            eventTitle: 'Birthday Party',
            eventType: 'Private',
            eventPrice: 'N/A',
            eventDate: '2023-08-21',
            contactNumber: '07369 226536',
            published: '2020-02-16',
            author: 'Ellis'
        });

    }


    getAllClassEntries(eventType) {
        return new Promise((resolve, reject) => {

            this.db.find({ eventType: 'Class' }, function (err, classEntries) {

                if (err) {
                    reject(err);

                } else {
                    resolve(classEntries);
                    console.log('function all() returns: ', classEntries);
                }
            })
        })
    }

    getAllCommunityEntries(eventType) {
        return new Promise((resolve, reject) => {

            this.db.find({ eventType: 'Community' }, function (err, communityEntries) {

                if (err) {
                    reject(err);

                } else {
                    resolve(communityEntries);
                    console.log('function all() returns: ', communityEntries);
                }
            })
        })
    }

    getAllEntries() {
        return new Promise((resolve, reject) => {

            this.db.find({}, function (err, entries) {

                if (err) {
                    reject(err);

                } else {
                    resolve(entries);
                    console.log('function all() returns: ', entries);
                }
            })
        })
    }


    addEntry(author, eventTitle, eventType, eventPrice, eventDate, contactNumber) {
        var entry = {
            author: author,
            eventTitle: eventTitle,
            eventType: eventType,
            eventPrice: eventPrice,
            eventDate: new Date(eventDate).toISOString().split('T')[0],
            contactNumber: contactNumber,
            published: new Date().toISOString().split('T')[0]
        }
        console.log('entry created', entry);
        this.db.insert(entry, function (err, doc) {
            if (err) {
                console.log('Error inserting document', subject);
            } else {
                console.log('document inserted into the database', doc);
            }
        })



    }

    getEntriesByUser(authorName) {
        return new Promise((resolve, reject) => {
            this.db.find({ 'author': authorName }, function (err, entries) {
                if (err) {
                    reject(err);
                } else {
                    resolve(entries);
                    console.log('getEntriesByUser returns: ', entries);
                }
            })
        })
    }

    // Add the deleteEntry function to the communityHall class
    deleteEntry(id) {
        return new Promise((resolve, reject) => {
            this.db.remove({ _id: id }, {}, function (err, numRemoved) {
                if (err) {
                    reject(err);
                } else {
                    console.log(id);
                    console.log(`Deleted ${numRemoved} entries`);
                    resolve();
                }
            });
        });
    }

    updateEntry(id, updatedEntry) {
        return new Promise((resolve, reject) => {
            this.db.update({ _id: id }, { $set: updatedEntry }, {}, function (err, numUpdated) {
                if (err) {
                    reject(err);
                } else {
                    console.log(`Updated ${numUpdated} entry`);
                    resolve();
                }
            });
        });
    }

}
module.exports = communityHall;