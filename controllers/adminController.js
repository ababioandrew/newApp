
const getdata = async (req, res) => {
try {
res.status(200).json({
    "statuscode" :200,
    "Success" :true,
    "message" :"data fetched",
    "data" : {
        "name" : "testet"
    }
})
} catch (err) {
res.status(500).json({
    "statuscode" :500,
    "Success" :false,
    "message" :"Internal Server Error",
    "data" : {
        "Error" : error.message
    }
})
}
};

module.exports = {getdata}
