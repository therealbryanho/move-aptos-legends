const verifyRequest = async (req, res, next) => {
    console.log("req verified");
    next()
}

module.exports = verifyRequest