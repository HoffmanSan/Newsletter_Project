const express = require('express');
const app = express();

const https = require('https');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

//-----------MAILCHIMP API------------------------------------------
const mailchimp = require("@mailchimp/mailchimp_marketing");
mailchimp.setConfig({
    apiKey: "63926c30f5b4c367d9c83c640fd47b1e-us21",
    server: "us21",
  });

//------------------------------------------------------------------

//------------------------------------------------------------------

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    const fName = req.body.first_name;
    const lName = req.body.last_name;
    const e_mail = req.body.email;

    const listId = "4ea7cc507e";
    const subscribingUser = {
        firstName: fName,
        lastName: lName,
        email: e_mail
    };

    async function run() {
        try {
        const response = await mailchimp.lists.addListMember(listId, {
          email_address: subscribingUser.email,
          status: "subscribed",
          merge_fields: {
            FNAME: subscribingUser.firstName,
            LNAME: subscribingUser.lastName
        }
        })
        res.sendFile(__dirname + "/success.html")
        } catch (err) {
            console.log(err);
            res.sendFile(__dirname + "/failure.html")
        }
    }
    run();
});

app.post("/failure", function(req, res) {
    setTimeout(() => {
        res.redirect("/");
}, 500);
});



//------------------------------------------------------------------
app.listen(3000, function() {
    console.log("The server is running on port 3000");
});
