const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../mongoDB/mongo");
const { JWT_SECRET } = require("../jwt_code/secret");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  await User.create({
    username: username,
    password: password,
  });
  res.json({
    message: "User Created Successfully",
  });
});

router.post("/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = await User.find({
    username,
    password,
  });
  if (user.length > 0) {
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
      message: "Incorrect Username and Pssword",
    });
  }
});

router.get("/courses", async (req, res) => {
  const response = await Course.find();
  res.json({
    courses: response,
  });
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  const courseId = req.params.courseId;
  const username = req.headers.username;
  try {
    await User.updateOne(
      {
        username: username,
      },
      {
        $push: {
          purchasedCourses: courseId,
        },
      }
    );
  } catch (e) {
    console.log(e);
  }
  res.json({
    message: "Purchase Completed!",
  });
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  const user = await User.findOne({
    username: req.headers.username,
  });
  const courses = await Course.find({
    _id: {
      $in: user.purchasedCourses,
    },
  });
  return res.send(courses)
});

module.exports = router;
