import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

const IdeasScreen = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const pusher = new Pusher('d515d193601eae0c654b', {
      cluster: 'mt1',
    });

    const channel = pusher.subscribe('science-channel');
    channel.bind('my-event', (data) => {
      setMessage(data.message);
      console.log(data.message);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  return (
    <div>
      <h2>Listening for updates...</h2>
      {console.log(message)}
      {message && <p>New Message: {message}</p>}
    </div>
  );
};

export default IdeasScreen;
