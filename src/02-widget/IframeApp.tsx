import {useEffect, useLayoutEffect, useState} from "react";

export const IframeApp = () => {
  const [measurements, setMeasurements] = useState<{width: number, height: number}>({width: 0, height: 0});

  useLayoutEffect(() => {
    const container = document.querySelector('html');
    if(!container) return;

    setMeasurements({width: container.scrollWidth, height: container.scrollHeight});

    const handleResize = () => {
      const m = {width: container.scrollWidth, height: container.scrollHeight}
      setMeasurements(m);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    parent.postMessage({message: 'surferseo_iframe_dimensions', payload: measurements}, '*');
  }, [measurements]);

  return (
    <div
      style={{
        backgroundColor: "rebeccapurple",
        color: "white",
        padding: "2rem",
        borderRadius: "1rem",
        fontSize: "2rem",
      }}
    >
      Dynamic marketing content will be here
    </div>
  );
};
