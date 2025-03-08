import React, { useRef, useState, useEffect } from "react";
import styles from "./VideoPlayer.module.scss";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaTimes } from "react-icons/fa";

interface VideoPlayerProps {
  videoUrl: string;
  movieTitle: string;
  onExit: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, movieTitle, onExit }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  let hideControlsTimeout: NodeJS.Timeout;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
      setDuration(videoRef.current.duration || 0);
    }
    hideControls(); // Iniciar el temporizador para ocultar los controles
  }, []);

  // Ocultar controles después de 5 segundos
  const hideControls = () => {
    hideControlsTimeout = setTimeout(() => {
      setShowControls(false);
    }, 5000);
  };

  // Mostrar controles cuando el usuario interactúa
  const handleUserInteraction = () => {
    setShowControls(true);
    clearTimeout(hideControlsTimeout);
    hideControls(); // Reiniciar el temporizador
  };

  // Actualizar progreso del video
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress(videoRef.current.currentTime);
    }
  };

  // Cambiar el progreso manualmente haciendo clic en la barra
  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!videoRef.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const newTime = (clickX / rect.width) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setVolume(videoRef.current.muted ? 0 : 1);
  };

  // Formatear tiempo en "mm:ss"
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
      <div
          className={styles.videoContainer}
          onMouseMove={handleUserInteraction}
          onTouchStart={handleUserInteraction}
      >
        <video
            ref={videoRef}
            className={styles.video}
            src={videoUrl}
            autoPlay
            controls={false}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        />

        {/* Controles visibles solo cuando `showControls` es `true` */}
        <div className={`${styles.overlay} ${showControls ? styles.show : styles.hide}`}>
          {/* Barra superior con el título y botón de salida */}
          <div className={styles.topBar}>
            <h2 className={styles.movieTitle}>{movieTitle}</h2>
            <button className={styles.exitButton} onClick={onExit}>
              <FaTimes />
            </button>
          </div>

          {/* Barra de progreso */}
          <div className={styles.progressBar} onClick={handleProgressClick}>
            <div className={styles.progress} style={{ width: `${(progress / duration) * 100}%` }} />
          </div>

          {/* Controles de reproducción */}
          <div className={styles.controls}>
            <span>{formatTime(progress)}</span>
            <button onClick={togglePlay}>{isPlaying ? <FaPause /> : <FaPlay />}</button>
            <button onClick={toggleMute}>{volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}</button>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
  );
};

export default VideoPlayer;
