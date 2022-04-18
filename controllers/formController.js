const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://ahmednaeem5575:9026040An!@cluster0.47nh5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const client = new MongoClient(uri);

exports.signin = async (req, res) => {
    client.connect(async function(err, db) {
        if (err) throw err;
        var dbo = db.db("myFirstDatabase");
        let user = req.body;
        let data = await dbo.collection("footlockUser").findOne({email: user.username, password: user.password})
        if(data){
            res.send("success")
        }else{
            res.send("failed")
        }
    });
}

exports.signup = async (req, res) => {
    client.connect(async function(err, db) {
        if (err) throw err;
        var dbo = db.db("myFirstDatabase");
        let user = req.body;
        let data = await dbo.collection("footlockUser").insertOne(user)
        if(data.acknowledged){
            res.send("success")
        }else{
            res.send("failed")
        }
    });
}