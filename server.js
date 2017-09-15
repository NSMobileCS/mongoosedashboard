var PORT = 8000;
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var ejs = require('ejs');
var app = express();
var mongoose = require("mongoose");
var print = (str) => console.log(str); //i like python...

mongoose.connect('mongodb://localhost/my_first_database', {
    useMongoClient: true,
});

var CritterSchema = new mongoose.Schema({
    species: {type: String, required: true},
    name: {type: String},
    notes: {type: String},
    },
    {timestamps: true});

var Critter = mongoose.model('critters', CritterSchema);

mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({extended: true}));
// app.use(session({secret: 'mi_p@55w0rd_3S_muy_r@nd0m050!!y_muy_1337_t@mbi3n'}));

app.use(express.static('static'));

app.set('views', __dirname + '/views');
app.set('viewengine', 'ejs');


app.get('/', function (req, res){
    var mongooseArr = Critter.find({}, function(err, foundList){
        if (err){
            console.log(err);
        }
        res.render('index.ejs', {errors: [], mongooseArr: foundList});
    })
});

app.get('/mongooses/new', function(req, res){
    res.render("mongooses.ejs", {errors: []});
});

app.post('/mongooses', function (req, res){
    var goose = new Critter({name: req.body.name, species: req.body.species, notes: req.body.notes});
    goose.save(function (err){
        if (err){
            console.log("PROBLEM: "+err);
            res.render("index.ejs", {errors: ['post problem detected', err]});
        }
        else {
            res.redirect("/");
        }
    })
});

app.get('/mongooses/edit/:id', function (req, res){
    Critter.findById(req.params.id, function (err, foundCritter){
        if (err){
            console.log(err);
        }
        res.render('edit.ejs', {errors: [err], goose:foundCritter});
    })
});


app.post('/mongooses/:id', function (req, res){
    Critter.update({id: req.params.id}, 
            {
                name: req.body.name,
                species: req.body.species,
                notes: req.body.notes
            }, 
            function (err, foundCritter){
                if (err){
                    print(err);  //see line 8 for why this isnt a typo
                }
                res.redirect('/');
    })
});

app.get('/mongooses/destroy/:id', function (req, res){
    Critter.findByIdAndRemove(req.params.id, function (err, removed){
        if (err){
            print(err);
        }
        print('removed by id: '+req.params.id);
        print("remove called. redirecting now");
        res.redirect('/');
    })
});

app.listen(PORT, function(){
    console.log('listening on port '+PORT);
})
