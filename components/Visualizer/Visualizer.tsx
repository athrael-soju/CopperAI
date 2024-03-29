import { useEffect, useRef } from 'react';

type VisualizerProps = {
  audioElement: HTMLAudioElement | null;
};

const Visualizer: React.FC<VisualizerProps> = ({ audioElement }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (audioElement && canvasRef.current) {
      const canvas = canvasRef.current;
      const canvasContext = canvas.getContext('2d');
      const audioContext = new AudioContext();
      const source = audioContext.createMediaElementSource(audioElement);
      const analyser = audioContext.createAnalyser();

      source.connect(analyser);
      analyser.connect(audioContext.destination);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const palette = ['#50423d', '#8d7361', '#c9bbae', '#eeebe7', '#8b8da0'];

      function draw() {
        if (canvasContext) {
          analyser.getByteFrequencyData(dataArray);

          canvasContext.clearRect(0, 0, canvas.width, canvas.height);

          const baseRadius = 75;
          const numBars = 100;
          const barWidth = (2 * Math.PI) / numBars;

          for (let i = 0; i < numBars; i++) {
            const barHeight = dataArray[i % dataArray.length];

            const scaledBarHeight = Math.log(1 + barHeight) * 25;

            const rads = i * barWidth;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            const x = centerX + Math.cos(rads) * baseRadius;
            const y = centerY + Math.sin(rads) * baseRadius;
            const xEnd =
              centerX + Math.cos(rads) * (baseRadius + scaledBarHeight);
            const yEnd =
              centerY + Math.sin(rads) * (baseRadius + scaledBarHeight);

            // Create a gradient for each bar
            const gradient = canvasContext.createLinearGradient(
              x,
              y,
              xEnd,
              yEnd
            );
            const colorIndex = Math.min(
              palette.length - 1,
              Math.floor(barHeight / (255 / palette.length))
            );
            gradient.addColorStop(0, palette[colorIndex]);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Transparent at the end

            canvasContext.strokeStyle = gradient;

            // Dynamic bar width based on its height
            canvasContext.lineWidth = 3 + scaledBarHeight / 200;

            canvasContext.beginPath();
            canvasContext.moveTo(x, y);
            canvasContext.lineTo(xEnd, yEnd);
            canvasContext.stroke();
          }

          requestAnimationFrame(draw);
        }
      }

      draw();
    }
  }, [audioElement]);

  return (
    <canvas
      ref={canvasRef}
      id="visualizer"
      width="600"
      height="600"
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
};

export default Visualizer;
