// src/components/MainPage.jsx
import React, { useRef, useState, useEffect } from "react";
import './MainPage.css';

export default function MainPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);     // overlay canvas (draw boxes)
  const sendCanvasRef = useRef(null); // offscreen canvas for sending frames
  const [cameraOn, setCameraOn] = useState(false);
  const [processing, setProcessing] = useState(false);
  const requestInterval = 500; // ms between frames sent (tweak: 300-800)
  const loopRef = useRef(null);

  useEffect(() => {
    // create offscreen canvas once
    sendCanvasRef.current = document.createElement("canvas");
    return () => {
      // cleanup if needed
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setCameraOn(true);
      runLoop();
      clearInterval(loopRef.current);
    } catch (err) {
      console.error("Camera error", err);
      alert("Cannot access camera: " + err.message);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
  };

  const handleToggle = () => {
    if (cameraOn) stopCamera();
    else startCamera();
  };

  // Capture frame, send to server, draw response
  const captureAndDetect = async () => {
    if (!videoRef.current || !canvasRef.current || !sendCanvasRef.current) return;
    if (processing) return; // throttle
    setProcessing(true);

    // target size to send => smaller size is faster (e.g., 416 or 640)
    const sendW = 640;
    const sendH = Math.round((videoRef.current.videoHeight / videoRef.current.videoWidth) * sendW);
    const sCanvas = sendCanvasRef.current;
    sCanvas.width = sendW;
    sCanvas.height = sendH;
    const sCtx = sCanvas.getContext("2d");
    sCtx.drawImage(videoRef.current, 0, 0, sendW, sendH);

    // convert to blob (JPEG) to reduce payload
    sCanvas.toBlob(async (blob) => {
      try {
        const fd = new FormData();
        fd.append("file", blob, "frame.jpg");

        // send to backend
        const resp = await fetch("http://127.0.0.1:8000/detect", {
          method: "POST",
          body: fd,
        });
        if (!resp.ok) {
          console.warn("Server returned", resp.status);
          setProcessing(false);
          return;
        }
        const data = await resp.json();
        drawDetections(data);
      } catch (err) {
        console.error("Detect error", err);
      } finally {
        setProcessing(false);
      }
    }, "image/jpeg", 0.7); // quality 0.7 - tweak to balance size/quality
  };

  // loop sending frames at interval while cameraOn
  const runLoop = () => {
    let stopped = false;
    (async function loop() {
      while (cameraOn && !stopped) {
        await captureAndDetect();
        await new Promise((res) => setTimeout(res, requestInterval));
      }
    })();
    return () => { stopped = true; };
  };

  const drawDetections = (response) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    // match canvas pixel size to video displayed size
    const displayW = videoRef.current.clientWidth;
    const displayH = videoRef.current.clientHeight;
    canvas.width = displayW;
    canvas.height = displayH;

    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!response || !response.detections) return;

    // backend returned image width/height that were used for detection
    const imgW = response.width;
    const imgH = response.height;

    // compute scale between backend image size and displayed video
    const scaleX = canvas.width / imgW;
    const scaleY = canvas.height / imgH;

    ctx.lineWidth = 2;
    ctx.font = "14px Arial";
    ctx.textBaseline = "top";

    response.detections.forEach(det => {
      const x = det.x1 * scaleX;
      const y = det.y1 * scaleY;
      const w = (det.x2 - det.x1) * scaleX;
      const h = (det.y2 - det.y1) * scaleY;
      const score = Math.round(det.score * 100);

      // box
      ctx.strokeStyle = "lime";
      ctx.strokeRect(x, y, w, h);

      // label background
      const label = `${det.label} ${score}%`;
      const textWidth = ctx.measureText(label).width;
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(x, y - 18, textWidth + 6, 18);

      // text
      ctx.fillStyle = "white";
      ctx.fillText(label, x + 3, y - 16);
    });
  };

  return (
    <div className="main-main-container">
      <h1>Click here to Enable the Camera</h1>
      <button id='button-main' onClick={handleToggle}>
        {cameraOn ? "Disable Camera" : "Enable Camera"}
      </button>

      <div style={{ position: "relative", marginTop: 20 }}>
        <video
          ref={videoRef}
          style={{ width: 640, height: "auto", borderRadius: 8 }}
          autoPlay
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            pointerEvents: "none",
            width: 640,
            height: "auto",
          }}
        />
      </div>
    </div>
  );
}
