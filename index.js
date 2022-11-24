const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("cookie-session");
const jwt = require("jsonwebtoken");
const app = express();
const Product = require("./model/product");
const passport = require("passport");
const User = require("./model/user");
const GoogleUser = require("./model/googleUser");
const stripe = require("stripe")(process.env.stripeKey);
const URL = "https://kevin-ecommerce.netlify.app";
const SubBlog = require("./model/subBlog");
// const URL = "http://localhost:3000";
const Blog = require("./model/blog");
const cookieParser = require("cookie-parser");
const axios = require("axios");
const path = require("path");
const subBlog = require("./model/subBlog");
const Comment = require("./model/comment");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

app.use(cookieParser());
app.use(
  session({
    name: "session",
    keys: [process.env.keys],
    maxAge: 24 * 60 * 60 * 1000,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: URL,
    credentials: true,
  })
);
// app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("connected");
});

//login with passport google

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: URL,
    failureRedirect: "/login/failed/google",
  })
);

app.get("/login/failed/google", (req, res) => {
  res.status(500).send("error");
});

app.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).send(req.user);
  } else {
    res.status(404).send("user not found");
  }
});

//logout

app.get("/logout", (req, res) => {
  req.logOut();
  res.redirect(URL);
  return;
});

//product

app.post("/product/add", async (req, res) => {
  const newProduct = Product.create(req.body);
  try {
    const saveNewProduct = await newProduct.save();
    res.send(saveNewProduct);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/products", async (req, res) => {
  try {
    const productPerPage = req.query.limit || 6;
    const page = req.query.p || 0;
    const qCategory = req.query.category;
    const qSearch = req.query.q;
    const qBrand = req.query.brand;
    const qMinPrice = req.query.min || 1;
    const qMaxPrice = req.query.max || 1;

    if (qSearch) {
      const product = await Product.find({
        title: { $regex: qSearch, $options: "i" },
        category: { $in: [qCategory] },
      })
        .skip(page * productPerPage)
        .limit(productPerPage);
      res.send(product);
    } else if (page) {
      const product = await Product.find()
        .skip(page * productPerPage)
        .limit(productPerPage);
      res.send(product);
    } else if (qCategory) {
      if (qCategory !== "all") {
        const product = await Product.find({
          category: {
            $in: [qCategory],
          },
        })
          .skip(page * productPerPage)
          .limit(productPerPage);

        res.send(product);
      } else {
        const product = await Product.find()
          .skip(productPerPage * page)
          .limit(productPerPage);
        res.send(product);
      }
    } else if (qBrand) {
      const product = await Product.find({
        brand: { $in: [qBrand], $options: "i" },
        price: { $gte: qMinPrice, $lte: qMaxPrice },
      })
        .skip(page * productPerPage)
        .limit(productPerPage);

      res.send(product);
    } else if (qMinPrice) {
      const product = await Product.find({
        price: { $gte: qMinPrice, $lte: qMaxPrice },
      })
        .skip(page * productPerPage)
        .limit(productPerPage);

      res.send(product);
    } else if (productPerPage) {
      const product = await Product.find({})
        .skip(page * productPerPage)
        .limit(productPerPage);
      res.send(product);
    } else {
      const product = await Product.find();

      res.send(product);
    }
  } catch (err) {
    res.send(err);
  }
});

app.get("/products/:productId", async (req, res) => {
  const singleProduct = await Product.findOne({ id: req.params.productId });
  res.send(singleProduct);
});

//blog

app.post("/blog/add", async (req, res) => {
  const newBlog = Blog.create(req.body);
  try {
    const saveNewBlog = await newBlog.save();
    res.send(saveNewBlog);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/blog", async (req, res) => {
  try {
    const blog = await Blog.find();
    res.send(blog);
  } catch (err) {
    res.status(500).send(err);
  }
});

//sub blog

app.post("/subBlog/add", async (req, res) => {
  const newSubBlog = subBlog.create(req.body);
  try {
    const saveNewSubBlog = await newSubBlog.save();
    res.send(saveNewSubBlog);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/subBlog", async (req, res) => {
  const subBlogPerPage = req.query.limit || 2;
  const page = req.query.p || 0;
  if (subBlogPerPage) {
    const blog = await SubBlog.find()
      .skip(page * subBlogPerPage)
      .limit(subBlogPerPage);
    res.send(blog);
  } else {
    try {
      const subBlog = await SubBlog.find();
      res.send(subBlog);
    } catch (err) {
      res.status(500).send(err);
    }
  }
});

app.get("/", (req, res) => {
  res.send("Home");
});

//comment

app.post("/comment/add", async (req, res) => {
  const newComment = Comment.create(req.body);
  try {
    const saveNewComment = await newComment.save();
    res.send(saveNewComment);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/comment", async (req, res) => {
  try {
    const comment = await Comment.find();
    res.send(comment);
  } catch (err) {
    res.status(500).send(err);
  }
});

//payment

app.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).send(stripeErr);
      } else {
        res.send(stripeRes);
      }
    }
  );
});

let port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`the port is running at server`);
});
