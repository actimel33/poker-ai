import { useRef, useState, useCallback, useEffect } from 'react'
import Webcam from 'react-webcam'

export default function Camera({ onCapture }: {onCapture: (imageSrc: string) => void}) {
  const webcamRef = useRef<Webcam | null>(null)
  const [facingMode, setFacingMode] = useState('environment') // Начать с задней камеры
  const [cameraPermission, setCameraPermission] = useState('pending')
  const [videoConstraints, setVideoConstraints] = useState({
    facingMode: 'environment',
    width: { ideal: 1280 },
    height: { ideal: 720 }
  })

  // Проверка доступности камеры при монтировании компонента
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true })
        setCameraPermission('granted')
      } catch (err) {
        console.error('Ошибка доступа к камере:', err)
        setCameraPermission('denied')
      }
    }

    checkCameraPermission()
  }, [])

  const switchCamera = useCallback(() => {
    setFacingMode(prevMode => 
      prevMode === 'user' ? 'environment' : 'user'
    )
    setVideoConstraints(prevConstraints => ({
      ...prevConstraints,
      facingMode: facingMode === 'user' ? 'environment' : 'user'
    }))
  }, [facingMode])

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      if (imageSrc && onCapture) {
        onCapture(imageSrc)
      }
    }
  }, [webcamRef, onCapture])

  if (cameraPermission === 'pending') {
    return <div className="text-center p-4">Запрос доступа к камере...</div>
  }

  if (cameraPermission === 'denied') {
    return (
      <div className="text-center p-4">
        <p className="text-red-500 mb-2">Доступ к камере запрещен</p>
        <p>Пожалуйста, разрешите доступ к камере в настройках браузера и перезагрузите страницу.</p>
      </div>
    )
  }

  return (
    <div className="camera-container relative w-full">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="w-full rounded-lg"
      />
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
        <button
          onClick={switchCamera}
          className="bg-white text-black p-3 rounded-full opacity-80"
          aria-label="Переключить камеру"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
            <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2"></path>
            <path d="M12 14v3"></path>
            <path d="M10 7V5a2 2 0 0 1 4 0v2"></path>
          </svg>
        </button>
        
        <button
          onClick={capture}
          className="bg-white text-black p-3 rounded-full opacity-80"
          aria-label="Сделать фото"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
        </button>
      </div>
    </div>
  )
}