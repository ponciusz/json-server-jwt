const fs = require("fs");
const bodyParser = require("body-parser");
const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");

const server = jsonServer.create();
const router = jsonServer.router("./database.json");
const userdb = JSON.parse(fs.readFileSync("./users.json", "UTF-8"));

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(jsonServer.defaults());

const SECRET_KEY = "123456789";

const expiresIn = "1h";

// Create a token from a payload
function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// Verify the token
// function verifyToken(token) {
//   jwt.verify(token, SECRET_KEY, function(err, decoded) {
//     if (err) {
//       console.log(err);
//       return err;
//     }
//     console.log(decoded.email);
//     return decoded.email;
//   });
// }

// Check if the user exists in database
function isAuthenticated({ email, password }) {
  return (
    userdb.users.findIndex(
      user => user.email === email && user.password === password
    ) !== -1
  );
}

server.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (isAuthenticated({ email, password }) === false) {
    const status = 401;
    const message = "Incorrect email or password";
    res.status(status).json({ status, message });
    return;
  }
  const access_token = createToken({ email, password });
  res.status(200).json({ access_token, email  });
});

server.use(/^(?!\/auth).*$/, (req, res, next) => {
  if (
    req.headers.authorization === undefined ||
    req.headers.authorization.split(" ")[0] !== "Bearer"
  ) {
    const status = 401;
    const message = "Error in authorization format";
    res.status(status).json({ status, message });
    return;
  }

  jwt.verify(req.headers.authorization.split(" ")[1], SECRET_KEY, function(
    err,
    decoded
  ) {
    if (err) {
      console.log(err);
      const status = 401;
      const message = "Error access_token is revoked";
      res.status(status).json({ status, message });
    }
    console.log('Auth as: ',decoded.email);
    next();
  });

});

server.use(router);

server.listen(3000, () => {
  console.log("Run Auth API Server");
});
