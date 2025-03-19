
"use client"

import Camera from "@/components/Camera";
import Image from "next/image";
import {  useState } from "react";


export default function Home() {
  const [image, setImage] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCapture = (imageSrc) => {
    setImage(imageSrc)
  }

  const resetCamera = () => {
    setImage(null)
    setResponse('')
  }

  const sendToChatGPT = async () => {
    if (!image || !prompt.trim()) {
      alert('Пожалуйста, сделайте фото и введите вопрос')
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: image,
          prompt: prompt,
        }),
      })

      if (!response.ok) {
        throw new Error('Ошибка при отправке запроса')
      }

      const data = await response.json()
      setResponse(data.text)
    } catch (error) {
      console.error('Error:', error)
      setResponse('Произошла ошибка: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-center mb-4">Фото + ChatGPT</h1>
      
      {!image ? (
        <Camera onCapture={handleCapture} />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
            <Image 
              src={image} 
              alt="Captured" 
              width={100}
              height={100}
              fill 
              style={{ objectFit: 'cover' }} 
            />
          </div>
          
          <button 
            onClick={resetCamera}
            className="bg-gray-600 text-white py-2 px-4 rounded-lg"
          >
            Новое фото
          </button>
          
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Задайте вопрос о фотографии..."
            className="w-full p-2 border rounded-lg text-black"
            rows={3}
          />
          
          <button 
            onClick={sendToChatGPT}
            disabled={loading}
            className={`py-2 px-4 rounded-lg ${loading ? 'bg-gray-400' : 'bg-blue-600'} text-white`}
          >
            {loading ? 'Отправка...' : 'Отправить в ChatGPT'}
          </button>
          
          {response && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h2 className="text-xl font-bold mb-2">Ответ ChatGPT:</h2>
              <p className="whitespace-pre-wrap">{response}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
