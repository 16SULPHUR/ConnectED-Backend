const jwt = require("jsonwebtoken")

function createJWT(id: String) {
    const token = jwt.sign(
        { id: id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
    return token;
}

export default createJWT