const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://ahmednaeem5575:9026040An!@cluster0.47nh5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const client = new MongoClient(uri);

exports.getUser = (req, res) => {
    client.connect(async function(err, db) {
        if (err) throw err;
        const {username} = req.params;
        var dbo = db.db("myFirstDatabase");
        let data = await dbo.collection("footlockUser").findOne({email: username});
        res.send(data);
    });
}


exports.shipping = async (req, res) => {
    client.connect(async function(err, db) {
        if (err) throw err;
        const {username} = req.params;
        var dbo = db.db("myFirstDatabase");
        let user = req.body;
        let data = await dbo.collection("footlockUser").findOne({email: username});
        data["first"] = user.first;
        data["last"] = user.last;
        data["street"] = user.street;
        data["apt"] = user.apt;
        data["zip"] = user.zip;
        data["city"] = user.city;
        data["state"] = user.state;
        data["telephone"] = user.telephone;
        let response = await dbo.collection("footlockUser").updateOne({email:username}, {$set: data});
        if(response.acknowledged){
            res.send("success");
        }else{
            res.send("failed");
        }
    });
}

exports.card = async (req, res) => {
    client.connect(async function(err, db) {
        if (err) throw err;
        const {username} = req.params;
        var dbo = db.db("myFirstDatabase");
        let user = req.body;
        let data = await dbo.collection("footlockUser").findOne({email: username});
        data["cvc"] = user.cvc;
        data["expiry"] = user.expiry;
        data["card_name"] = user.name;
        data["card_number"] = user.number;
        let response = await dbo.collection("footlockUser").updateOne({email:username}, {$set: data});
        if(response.acknowledged){
            res.send("success");
        }else{
            res.send("failed");
        }
    });
}