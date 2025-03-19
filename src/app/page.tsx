
"use client"

import { useRef, useState } from "react";


export default function Home() {
  const [image, setImage] = useState<Blob | null>(null);
  const [response, setResponse] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current!.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context?.drawImage(videoRef.current, 0, 0);
      canvasRef.current.toBlob((blob) => {
        setImage(blob);
      }, "image/png");
    }
  };

  const sendToGPT4 = async () => {
    if (!image) return;
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    const formData = new FormData();
    formData.append("file", image, "image.png");
    formData.append("prompt", "Что изображено на этом фото?");

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    const data = await response.json();
    setResponse(data.choices?.[0]?.text || "Ответ не получен");
  };

  return (
    <div className="flex flex-col items-center p-4">
      <video ref={videoRef} autoPlay playsInline className="w-full max-w-md" />
      <canvas ref={canvasRef} className="hidden" />
      <button onClick={startCamera} className="p-2 bg-blue-500 text-white rounded mt-4">
        Включить камеру
      </button>
      <button onClick={takePhoto} className="p-2 bg-green-500 text-white rounded mt-4">
        Сделать фото
      </button>
      <button onClick={sendToGPT4} className="p-2 bg-red-500 text-white rounded mt-4">
        Отправить в ChatGPT-4.0
      </button>
      {response && <p className="mt-4 p-2 border">{response}</p>}
    </div>
  );
}
