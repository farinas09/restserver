const jwt = require("jsonwebtoken");

//Verify token

let verifyToken = (req, res, next) => {
  let token = req.get("Authorization");

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }

    req.user = decoded.user;
    next();
  });
};

let verifyRole = (req, res, next) => {
  let user = req.user;

  if (user.role === "ADMIN_ROLE") {
    next();
  } else {
    return res.status(401).json({
      ok: false,
      err: {
        message: "El usuario no tiene permisos",
      },
    });
  }
};

module.exports = {
  verifyToken,
  verifyRole,
};
