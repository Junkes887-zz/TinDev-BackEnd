const Dev = require('../models/Dev');

module.exports = {
    async store(req, res) {

        const { devId } = req.params;
        const { user } = req.headers;

        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(devId);

        if (!targetDev) {
            return res.status(400).json({ error: 'Dev not exists' });
        }

        if (targetDev.likes.includes(loggedDev._id)) {
            const loogedSocket = req.connectUsers[user];
            const targetSocket = req.connectUsers[devId];

            if (loogedSocket) {
                req.io.to(loogedSocket).emit('match',targetDev);
            }

            if (targetSocket) {
                req.io.to(targetSocket).emit('match',loggedDev);
            }
        }

        loggedDev.likes.push(targetDev._id);

        await loggedDev.save();

        return res.json(loggedDev);
    }
};