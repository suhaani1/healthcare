import { useEffect } from 'react';

const LiveChat = () => {
  useEffect(() => {
    var s1 = document.createElement("script");
    s1.async = true;
    s1.src = 'https://embed.tawk.to/6855408426a9b719089c1474/1iu6g82gb';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    document.body.appendChild(s1);
  }, []);

  return null;
};

export default LiveChat;
