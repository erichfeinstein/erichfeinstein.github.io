import React, { useEffect, useRef } from 'react';
import "../styles/ribbons.css";

export default function RibbonContainer() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const baseColors = ['#FF5F6D', '#FFC371', '#9CECFB', '#65C7F7', '#0052D4'];
    let animationFrameId;

    function drawRibbons() {
      ctx.clearRect(0, 0, width, height);
      const time = Date.now() / 1000;
      const ribbonCount = 5;
      
      for (let i = 0; i < ribbonCount; i++) {
        // Each ribbon gets its own directional speeds
        const speedX = 30 + i * 10;
        const speedY = 20 + (i % 2 === 0 ? 10 : -10);

        // Calculate starting position without wrapping for smooth continuous motion
        let startX = i * 100 + time * speedX;
        let startY = i * 80 + time * speedY;
        // Add oscillation for dynamic movement
        startX += 50 * Math.sin(time + i);
        startY += 50 * Math.cos(time + i);

        // Define larger control points for bigger ribbons (and remove modulo to avoid glitchy jumps)
        const cp1X = startX + 200 + 20 * Math.cos(time + i);
        const cp1Y = startY - 150 + 20 * Math.sin(time + i);
        const cp2X = startX + 400 + 30 * Math.sin(time + i);
        const cp2Y = startY + 150 + 30 * Math.cos(time + i);
        const endX = startX + 600 + 40 * Math.cos(time + i);
        const endY = startY + 100 + 40 * Math.sin(time + i);

        // Create a gradient for the ribbon stroke
        let gradient = ctx.createLinearGradient(startX, startY, endX, endY);
        gradient.addColorStop(0, baseColors[i % baseColors.length]);
        gradient.addColorStop(1, "#ffffff22");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
        ctx.stroke();
      }
      
      animationFrameId = requestAnimationFrame(drawRibbons);
    }

    drawRibbons();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="ribbon-canvas"
      style={{ position: 'fixed', top: 0, left: 0, zIndex: 1 }}
    />
  );
}