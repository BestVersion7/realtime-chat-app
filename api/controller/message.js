const Message = require('../model/message')

exports.deleteAll = async (req, res) => {
    try {
        await Message.deleteMany()
        return res.status(202).send('deleted all records')
    } catch(err) {
        res.status(500).send(err)
    }
}