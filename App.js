const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const multer = require("multer");
const path = require("path");

const app=express()

const sendMail = require("./Sendmail"); // Make sure the path is correct






app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:true}))

app.use('/uploads', express.static('uploads'));


mongoose.connect("mongodb+srv://karthikr:karthik2002@cluster0.wg5kjh4.mongodb.net/lostandfoundDb?retryWrites=true&w=majority&appName=Cluster0")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage });

// Load model
const foundModel = require("./models/Founddata");


app.post("/found", upload.single("image"), async (req, res) => {

    const category = req.body.category
    const description = req.body.description
    const place = req.body.place
    const email = req.body.email
    const phone = req.body.phone
    const imagePath = req.file ? req.file.path : "";

    let store_data=new foundModel(
        {
            category:category,
            description:description,
            place:place,
            email:email,
            phone:phone,
            image:imagePath


        }
    )


   await store_data.save()

    res.json({

        Category: category,
        Description: description,
        Place:place,
        Email:email,
        Phone:phone,
        Image:imagePath
        

    })
})

app.get("/viewall",(req,res)=>{

    foundModel.find().then(
        (items)=>{
             res.json(items)
        }
    ).catch()
   
})



app.get("/search/:category", (req, res) => {
    const category = req.params.category;

    foundModel.find({ category: { $regex: new RegExp(category, 'i') } })
        .then((items) => {
            res.json(items);
        })
        .catch((err) => {
            res.status(500).json({ error: "Search failed" });
        });
});


app.delete("/found/:id", async (req, res) => {
    const id = req.params.id;
    await foundModel.findByIdAndDelete(id);
    res.json({ message: "Item deleted successfully" });
});

app.post("/sendemail", async (req, res) => {
    const { phno, emailid, to } = req.body;

    const message = {
        phno,
        emailid
    };

    try {
        await sendMail(to, "Someone is trying to contact you about a found item", message);
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error while sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});






app.listen(4000,(error)=>{console.log("server running"+error)})

