import { useState, useRef, useEffect } from 'react';

import './widget.css';

export const Widget = () => {
  const [dimensions, setDimensions] = useState<{width: number, height: number}>({width: 0, height: 0});
  const iframeContainer = useRef<any>();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.message == 'surferseo_iframe_dimensions') {
        setDimensions(event.data.payload);
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    }
  }, []);

  return (
    <div className="widget" style={{visibility: dimensions.height ? 'visible' : 'hidden'}}>
      <h1>App content</h1>
      <p>Check out our latest podcast</p>
      <div
        style={{
          width: '100%',
          overflow: 'hidden',
        }}
        ref={iframeContainer}
      >
        <iframe
          src="/iframe"
          style={{
            border: 0,
            width: '100%',
            ...(dimensions.height ? {height: dimensions.height} : {})
          }}
        />
      </div>
    </div>
  );
};
