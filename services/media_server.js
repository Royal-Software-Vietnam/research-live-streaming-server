const NodeMediaServer = require('node-media-server'),
    config = require('./config').rtmp_server;
const User = require('../database/models/user.model')
 
nms = new NodeMediaServer(config);
 
nms.on('prePublish', async (id, StreamPath, args) => {
    let stream_key = getStreamKeyFromStreamPath(StreamPath)
    console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`)

    /** @middleware kiểm tra tính hợp lệ của user */
    let user = await User.findOne({stream_key: stream_key})
    if (!user) {
        let session = nms.getSession(id);
        /** @reject the incoming RTMP connection */
        session.reject();
    } 
});
 
const getStreamKeyFromStreamPath = (path) => {
    let parts = path.split('/');
    return parts[parts.length - 1];
};
 
module.exports = nms;