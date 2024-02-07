const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.header("auth-token");
    if (!token) {
      return res
        .status(401)
        .json({ massage: "Please authenticate using a valid token" });
    }
    const id = jwt.verify(token, process.env.JWT_SECRET);
    req.user = id;
  } catch (error) {
    return res
      .status(401)
      .json({ massage: "Please authenticate using a valid token" });
  }
  next();
};
