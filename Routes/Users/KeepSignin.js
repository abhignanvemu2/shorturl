const KeepSignin = async(req, res) => {
try{
res.json({message: 'success'});
} catch (error) {   
    res.status(500).send(error.message);
}
}

module.exports = KeepSignin