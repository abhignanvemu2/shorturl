
const User = require('../../Models/User');

const UpdatePassword = async (req, res) => {
    const { password } = req.body;  
    try {
      await User.findOneAndUpdate({_id: req.params.id}, {password: password}, {new: true});
      return res.status(200).send({message : "Password updated successfully"});
    }catch(error) { 
        res.status(500).send({message : error.message});
    }
    
}

module.exports = UpdatePassword