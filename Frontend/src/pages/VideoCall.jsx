import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');

  .vc-page {
    font-family: 'DM Sans', sans-serif;
    background: #000;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .vc-container {
    width: 100%;
    max-width: 1400px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    height: 90vh;
  }

  .vc-video-wrapper {
    position: relative;
    background: #111;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .vc-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
  }

  .vc-placeholder {
    color: #888;
    text-align: center;
    font-size: 0.9rem;
  }

  .vc-name-tag {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 0.6rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .vc-status {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 0.6rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
  }

  .vc-controls {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 1rem;
    z-index: 100;
  }

  .vc-btn {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .vc-btn-mute {
    background: #3a3a3a;
    color: white;
  }

  .vc-btn-mute:hover {
    background: #4a4a4a;
  }

  .vc-btn-mute.active {
    background: #ff6b6b;
  }

  .vc-btn-video {
    background: #3a3a3a;
    color: white;
  }

  .vc-btn-video:hover {
    background: #4a4a4a;
  }

  .vc-btn-video.active {
    background: #ff6b6b;
  }

  .vc-btn-end {
    background: #ff4757;
    color: white;
    width: 80px;
  }

  .vc-btn-end:hover {
    background: #ff3838;
  }

  .vc-header {
    position: fixed;
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 20px;
    text-align: center;
    z-index: 100;
  }

  .vc-header-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.3rem;
  }

  .vc-header-time {
    font-size: 0.85rem;
    color: #ccc;
  }

  .vc-mini-video {
    position: fixed;
    bottom: 100px;
    right: 2rem;
    width: 200px;
    height: 150px;
    background: #111;
    border-radius: 12px;
    overflow: hidden;
    border: 3px solid #3a3a3a;
    z-index: 50;
  }

  .vc-waiting {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: white;
  }

  .vc-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #3a3a3a;
    border-top: 4px solid #ff4757;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @media (max-width: 1024px) {
    .vc-container {
      grid-template-columns: 1fr;
      height: auto;
    }

    .vc-video-wrapper {
      height: 400px;
      margin-bottom: 1rem;
    }

    .vc-mini-video {
      width: 150px;
      height: 120px;
      bottom: 80px;
      right: 1rem;
    }
  }
`;

export default function VideoCall() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isPeerConnected, setIsPeerConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    initializeCall();
    return () => {
      endCall();
    };
  }, [sessionId]);

  useEffect(() => {
    if (!isPeerConnected) return;
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPeerConnected]);

  const initializeCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Setup peer connection
      setupPeerConnection();
      
      toast.success('Camera and microphone ready');
      setIsPeerConnected(true);
    } catch (error) {
      console.error('Error accessing media devices', error);
      toast.error('Please allow camera and microphone access');
    }
  };

  const setupPeerConnection = () => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    peerConnectionRef.current = peerConnection;

    // Add local stream tracks
    localStreamRef.current.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStreamRef.current);
    });

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // In a real app, send this to the remote peer via signaling server
        console.log('ICE candidate:', event.candidate);
      }
    };

    peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', peerConnection.connectionState);
      if (peerConnection.connectionState === 'failed' || 
          peerConnection.connectionState === 'disconnected') {
        toast.error('Connection lost');
      }
    };
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    navigate('/menteedash');
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <>
      <style>{styles}</style>
      <div className="vc-page">
        {/* Header */}
        <div className="vc-header">
          <div className="vc-header-title">Video Call in Progress</div>
          <div className="vc-header-time">{formatTime(callDuration)}</div>
        </div>

        {/* Video Container */}
        <div className="vc-container">
          {/* Remote Video */}
          <div className="vc-video-wrapper">
            <video
              ref={remoteVideoRef}
              className="vc-video"
              autoPlay
              playsInline
            />
            <div className="vc-name-tag">Other Person</div>
            {!isPeerConnected && (
              <div className="vc-waiting">
                <div className="vc-spinner"></div>
                <div>Waiting for other participant...</div>
              </div>
            )}
          </div>

          {/* Local Video */}
          <div className="vc-video-wrapper">
            <video
              ref={localVideoRef}
              className="vc-video"
              autoPlay
              playsInline
              muted
            />
            <div className="vc-name-tag">You</div>
            <div className="vc-status">
              {isMuted && '🔇 Muted'}
              {isVideoOff && '📹 Video Off'}
              {!isMuted && !isVideoOff && '✓ Live'}
            </div>
          </div>
        </div>

        {/* Mini Local Video for Mobile */}
        <div className="vc-mini-video">
          <video
            ref={localVideoRef}
            className="vc-video"
            autoPlay
            playsInline
            muted
          />
        </div>

        {/* Controls */}
        <div className="vc-controls">
          <button
            className={`vc-btn vc-btn-mute ${isMuted ? 'active' : ''}`}
            onClick={toggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? '🔇' : '🎤'}
          </button>
          <button
            className={`vc-btn vc-btn-video ${isVideoOff ? 'active' : ''}`}
            onClick={toggleVideo}
            title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
          >
            {isVideoOff ? '📹' : '📷'}
          </button>
          <button
            className="vc-btn vc-btn-end"
            onClick={endCall}
            title="End call"
          >
            ☎️
          </button>
        </div>
      </div>
    </>
  );
}
