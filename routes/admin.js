const { Router, response } = require("express");
const router = Router();
const { Admin, User, Course } = require("../mongoDB/mongo");
const { JWT_SECRET } = require("../jwt_code/secret");
const adminMiddleware = require("../middleware/admin");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  await Admin.create({
    username: username,
    password: password,
  });
  res.json({
    message: "Admin Created Succefully",
  });
});

router.post("/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = await User.find({
    username,
    password,
  });
  if (user) {
    const token = jwt.sign(
      {
        username,
      },
      JWT_SECRET
    );
    res.json({
      token,
    });
  } else {
    res.status(411).json({
      message: "Incorret Username and Password",
    });
  }
});

router.post("/courses", adminMiddleware, async (req, res) => {
  try {
    const title = req.body.title;
    const description = req.body.description;
    const imageLink = req.body.imageLink;
    const price = req.body.price;
    const newCourse = await Course.create({
      title,
      description,
      imageLink,
      price,
    });
    res.json({
      message: "Course Created Successfully",
      courseId: newCourse._Id,
    });
  } catch {
    res.status(411).json({
      message : "Invalid Inputs",
    })
  }
});

router.get("/courses", adminMiddleware, async (req, res) => {
  const courses = await Course.find();
  res.json({
    courses: courses,
  });
});

module.exports = router;
