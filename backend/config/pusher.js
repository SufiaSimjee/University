import Pusher from 'pusher';

const pusher = new Pusher({
    appId: '1950378',
    key: 'd515d193601eae0c654b',
    secret: 'dd23b42147e7b02e4f9c',
    cluster: 'mt1',
    useTLS: true,
});

export default pusher;