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
    //a function to seed the database
init() {
    this.db.insert({
    eventTitle: 'Circus Show',
    eventPrice: '£15 Adults £5 Children',
    eventDate: '2023-08-22',
    contactNumber: '07369 226536',
    published: '2020-02-16',
    author: 'Peter'
    });
    //for later debugging
    console.log('db entry Peter inserted');
    
    this.db.insert({
    eventTitle: 'Dancing Show',
    eventPrice: '£18 Adults £10 Children',
    eventDate: '2023-09-22',
    contactNumber: '07369 226536',
    published: '2020-02-16',
    author: 'Ann'
    });
    //for later debugging
    console.log('db entry Ann inserted');
}
//a function to return all entries from the database
getAllEntries() {
    //return a Promise object, which can be resolved or rejected
    return new Promise((resolve, reject) => {
    //use the find() function of the database to get the data,
    //error first callback function, err for error, entries for data
    this.db.find({}, function(err, entries) {
    //if error occurs reject Promise
    if (err) {
    reject(err);
    //if no error resolve the promise & return the data
    } else {
    resolve(entries);
    //to see what the returned data looks like
    console.log('function all() returns: ', entries);
    }
    })
    })
    }
    getPetersEntries() {
        //return a Promise object, which can be resolved or rejected
        return new Promise((resolve, reject) => {
        //find(author:'Peter) retrieves the data,
        //with error first callback function, err=error, entries=data
        this.db.find({ author: 'Peter' }, function(err, entries) {
        //if error occurs reject Promise
        if (err) {
        reject(err);
        //if no error resolve the promise and return the data
        } else {
        resolve(entries);
        //to see what the returned data looks like
        console.log('getPetersEntries() returns: ', entries);
        }
        })
        })
        }

addEntry(author, eventTitle, eventPrice, eventDate, contactNumber) {
            var entry = {
            author: author,
            eventTitle: eventTitle,
            eventPrice: eventPrice,
            eventDate: new Date(eventDate).toISOString().split('T')[0],
            contactNumber: contactNumber,
            published: new Date().toISOString().split('T')[0]
            }
            console.log('entry created', entry);
            this.db.insert(entry, function(err, doc) {
            if (err) {
            console.log('Error inserting document', subject);
            } else {
            console.log('document inserted into the database', doc);
            }
            }) 
        }       
getEntriesByUser(authorName) {
            return new Promise((resolve, reject) => {
                this.db.find({ 'author': authorName }, function(err, entries) {
                if (err) {
                    reject(err);
                } else {
                    resolve(entries);
                console.log('getEntriesByUser returns: ', entries);
            }
        })
    })
 }

}
module.exports = communityHall;