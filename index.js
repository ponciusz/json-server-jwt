const fs = require("fs");
const bodyParser = require("body-parser");
const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");

const config = require("./config");
const tokenList = {};

const server = jsonServer.create();
const router = jsonServer.router("./database.json");
const userdb = JSON.parse(fs.readFileSync("./users.json", "UTF-8"));

// # generate private key
// openssl genrsa -out private.pem 2048
// # extatract public key from it
// openssl rsa -in private.pem -pubout > public.pem
const privateCert = fs.readFileSync("private.pem");
const publicCert = fs.readFileSync("public.pem");

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(jsonServer.defaults());

// Verify the token
function verifyToken(token, res, next) {
  jwt.verify(token, publicCert, function(err) {
    if (err) {
      return res.status(401).json({
        status: 401,
        message: err.message
      });
    }
    return next();
  });
}

// Check if the user exists in database
function isAuthenticated(email, password) {
  return (
    userdb.users.findIndex(
      user => user.email === email && user.password === password
    ) !== -1
  );
}

server.post("/auth/login", (req, res) => {
  const postData = req.body;
  const { email, password } = postData;

  if (isAuthenticated(email, password) === false) {
    const status = 401;
    const message = "Incorrect email or password";
    res.status(status).json({ status, message });
    return;
  }

  // Use Object.assign to avoid mutation of the object
  const userData = Object.assign(
    {},
    userdb.users.find(function(element) {
      return element.email === postData.email;
    })
  );
  delete userData.password;

  const accessToken = jwt.sign({ id: userData.id }, privateCert, {
    algorithm: "RS256",
    expiresIn: config.TOKEN_LIFE
  });
  const refreshToken = jwt.sign({ id: userData.id }, privateCert, {
    algorithm: "RS256",
    expiresIn: config.REFRESH_TOKEN_LIFE
  });

  const response = {
    accessToken,
    refreshToken,
    ...userData
  };
  // Update refresh token in memory so server can invalidate it anytime
  // In this example nodemon restart cause clearing it
  tokenList[refreshToken] = {
    id: userData.id
  };
  res.status(200).json(response);
});

server.post("/auth/token", (req, res) => {
  const postData = req.body;
  const {refreshToken} = postData;

  if (refreshToken && refreshToken in tokenList) {
    const token = jwt.sign(
      { id: tokenList[refreshToken].id }, // use id from memory
      privateCert,
      {
        algorithm: "RS256",
        expiresIn: config.TOKEN_LIFE
      }
    );
    const response = {
      token: token
    };

    res.status(200).json(response);
  } else {
    res.status(404).send("Invalid request");
  }
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

  verifyToken(req.headers.authorization.split(" ")[1], res, next);
});

server.use(router);

server.listen(config.PORT, () => {
  console.log(`Json Server JWT running at: http://localhost:${config.PORT}`);
});
