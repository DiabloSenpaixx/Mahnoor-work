"use client";
import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Send } from 'lucide-react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Model Component
function RobotModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const { gl } = useThree();
  const modelRef = useRef<THREE.Group>(null);
  
  const headBone = useRef<THREE.Object3D | null>(null);
  const neckBone = useRef<THREE.Object3D | null>(null);
  const initialHeadQuat = useRef<THREE.Quaternion>(new THREE.Quaternion());
  const initialNeckQuat = useRef<THREE.Quaternion>(new THREE.Quaternion());

  // Mouse tracking (normalized -1 to 1)
  const mouseNDC = useRef({ x: 0, y: 0 });

  // Breathing animation clock
  const breathClock = useRef(0);

  useEffect(() => {
    if (!scene) return;
    
    headBone.current = null;
    neckBone.current = null;

    // Two-pass: first find exact "Head" bone, then "Neck" as secondary
    scene.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }

      const name = node.name.toLowerCase();
      
      // Exact match for "Head" bone (not Head_end, not HeadTop)
      if (name === 'head' && !headBone.current) {
        headBone.current = node;
        initialHeadQuat.current.copy(node.quaternion);
      }
      // Exact match for "Neck"
      if (name === 'neck' && !neckBone.current) {
        neckBone.current = node;
        initialNeckQuat.current.copy(node.quaternion);
      }
    });

    // Fallback: if no exact "Head", try includes
    if (!headBone.current) {
      scene.traverse((node) => {
        const name = node.name.toLowerCase();
        if (name.includes('head') && !name.includes('end') && !name.includes('top') && !headBone.current) {
          headBone.current = node;
          initialHeadQuat.current.copy(node.quaternion);
        }
      });
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const canvasCenterX = rect.left + rect.width / 2;
      const canvasCenterY = rect.top + rect.height / 2;
      
      mouseNDC.current.x = THREE.MathUtils.clamp(
        (event.clientX - canvasCenterX) / (rect.width / 2),
        -1, 1
      );
      mouseNDC.current.y = THREE.MathUtils.clamp(
        (event.clientY - canvasCenterY) / (rect.height / 2),
        -1, 1
      );
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [scene, gl]);

  useFrame((_, delta) => {
    // --- Breathing / Idle Animation ---
    breathClock.current += delta;
    if (modelRef.current) {
      // Gentle vertical bob (breathing)
      const breathY = Math.sin(breathClock.current * 1.2) * 0.025;
      modelRef.current.position.y = -1.5 + breathY;
      
      // Very subtle body sway side to side
      const sway = Math.sin(breathClock.current * 0.7) * 0.008;
      modelRef.current.rotation.z = sway;

      // Subtle scale pulse for breathing effect
      const breathScale = 1.5 + Math.sin(breathClock.current * 1.2) * 0.005;
      modelRef.current.scale.setScalar(breathScale);
    }

    const maxYaw = Math.PI / 4;    // 45 degrees left/right
    const maxPitch = Math.PI / 4;   // 45 degrees up/down
    const lerpSpeed = 0.08;

    // --- Head Bone Tracking ---
    if (headBone.current) {
      const targetQuat = new THREE.Quaternion();
      const yawQuat = new THREE.Quaternion();
      const pitchQuat = new THREE.Quaternion();

      // Flipped: positive x = look right (was inverted before)
      yawQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), mouseNDC.current.x * maxYaw);
      // Use Z-axis for pitch (nodding up/down) since X was only tilting
      pitchQuat.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -mouseNDC.current.y * maxPitch);

      targetQuat.copy(initialHeadQuat.current).multiply(yawQuat).multiply(pitchQuat);
      headBone.current.quaternion.slerp(targetQuat, lerpSpeed);
    }

    // --- Neck Bone Tracking (softer, half the intensity) ---
    if (neckBone.current) {
      const neckTarget = new THREE.Quaternion();
      const neckYaw = new THREE.Quaternion();
      const neckPitch = new THREE.Quaternion();

      neckYaw.setFromAxisAngle(new THREE.Vector3(0, 1, 0), mouseNDC.current.x * maxYaw * 0.4);
      neckPitch.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -mouseNDC.current.y * maxPitch * 0.4);

      neckTarget.copy(initialNeckQuat.current).multiply(neckYaw).multiply(neckPitch);
      neckBone.current.quaternion.slerp(neckTarget, lerpSpeed * 0.7);
    }
  });

  return (
    <primitive 
      ref={modelRef} 
      object={scene} 
      position={[0, -1.5, 0]} 
      scale={1.5}
    />
  );
}

// Main Component
export default function RobotAssistant({ stepMessage, showChat = false, onChatAction }: { stepMessage: string, showChat?: boolean, onChatAction?: (text: string) => void }) {
  const [displayedText, setDisplayedText] = useState("");
  const [inputValue, setInputValue] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    if (onChatAction) onChatAction(inputValue);
    setInputValue("");
  };

  useEffect(() => {
    let i = 0;
    setDisplayedText("");
    
    let interval: ReturnType<typeof setInterval>;
    
    const startDelay = setTimeout(() => {
      interval = setInterval(() => {
        setDisplayedText(stepMessage.slice(0, i + 1));
        i++;
        if (i >= stepMessage.length) {
          clearInterval(interval);
        }
      }, 30);
    }, 200);
    
    return () => {
      clearTimeout(startDelay);
      if (interval) clearInterval(interval);
    };
  }, [stepMessage]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-cover bg-center border-r border-slate-200/50 overflow-hidden" style={{ backgroundImage: "url('/cute_robot_background.png')" }}>
      
      {/* ✨ Cute Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        {/* Floating stars */}
        <div className="absolute top-[15%] left-[12%] text-xl animate-bounce" style={{ animationDuration: '3s', animationDelay: '0s' }}>⭐</div>
        <div className="absolute top-[60%] right-[15%] text-lg animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>✨</div>
        <div className="absolute bottom-[25%] left-[8%] text-sm animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>💜</div>
        <div className="absolute top-[35%] right-[10%] text-base animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '2s' }}>🌟</div>
        <div className="absolute bottom-[40%] right-[25%] text-sm animate-bounce" style={{ animationDuration: '3.2s', animationDelay: '1.5s' }}>💫</div>
        
        {/* Floating code brackets */}
        <div className="absolute top-[45%] left-[5%] text-primary/20 font-mono text-2xl font-bold animate-pulse" style={{ animationDuration: '3s' }}>&lt;/&gt;</div>
        <div className="absolute bottom-[15%] right-[8%] text-primary/15 font-mono text-xl font-bold animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}>{ }</div>
        
        {/* Floating gradient dots */}
        <div className="absolute top-[20%] right-[30%] w-3 h-3 rounded-full bg-gradient-to-r from-primary/30 to-secondary/30 animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-[30%] left-[20%] w-2 h-2 rounded-full bg-gradient-to-r from-pink-400/30 to-purple-400/30 animate-ping" style={{ animationDuration: '4s', animationDelay: '1.5s' }} />
        <div className="absolute top-[70%] left-[30%] w-2.5 h-2.5 rounded-full bg-gradient-to-r from-secondary/25 to-emerald-400/25 animate-ping" style={{ animationDuration: '3.5s', animationDelay: '0.8s' }} />
        
        {/* Soft glowing circles */}
        <div className="absolute top-[10%] right-[5%] w-20 h-20 rounded-full bg-primary/5 blur-xl animate-pulse" style={{ animationDuration: '5s' }} />
        <div className="absolute bottom-[10%] left-[5%] w-16 h-16 rounded-full bg-secondary/5 blur-xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        <div className="absolute top-[50%] left-[50%] w-24 h-24 rounded-full bg-pink-300/5 blur-2xl animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }} />
      </div>

      {/* Speech Bubble */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[90%] z-20">
        <div className="bg-white/90 shadow-2xl border border-white/50 backdrop-blur-xl p-5 rounded-3xl relative animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-50"></div>
          <p className="text-slate-800 font-semibold text-center leading-relaxed whitespace-pre-line min-h-[4rem] flex items-center justify-center relative z-10 text-[15px]">
            <span>
              {displayedText}
              {displayedText.length < stepMessage.length && (
                <span className="inline-block w-1.5 h-4 ml-1 bg-[#8b5cf6] animate-pulse align-middle rounded-full"></span>
              )}
            </span>
          </p>
        </div>
        {/* Bubble tail */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-b border-r border-white/50 transform rotate-45 shadow-sm"></div>
      </div>

      {/* 3D Canvas */}
      <div className="w-full h-full absolute inset-0 z-[5]">
        <Canvas camera={{ position: [0, 1, 5], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <directionalLight 
            position={[5, 10, 5]} 
            intensity={1.5} 
            castShadow 
            shadow-bias={-0.001} 
          />
          <Environment preset="city" />
          <React.Suspense fallback={null}>
            <RobotModel url="/robot_super_optimized.glb" />
            <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
          </React.Suspense>
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            minPolarAngle={Math.PI / 2.5} 
            maxPolarAngle={Math.PI / 1.5} 
          />
        </Canvas>
      </div>

      {/* Chat Bar */}
      {showChat && (
        <div className="absolute bottom-6 w-[90%] z-20 flex flex-col gap-3">
          {/* Suggestions in two rows with a cute bubble look */}
          <div className="flex flex-col gap-1.5 w-full px-2 items-center">
            {/* Row 1: Theme colors */}
            <div className="flex flex-wrap gap-1.5 justify-center">
              <button type="button" onClick={() => onChatAction?.("Change color to blue")} className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-extrabold text-slate-700 border border-white/50 shadow-sm hover:shadow-md hover:scale-105 hover:text-primary hover:border-primary/30 transition-all cursor-pointer">🔵 Blue</button>
              <button type="button" onClick={() => onChatAction?.("Change color to orange")} className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-extrabold text-slate-700 border border-white/50 shadow-sm hover:shadow-md hover:scale-105 hover:text-primary hover:border-primary/30 transition-all cursor-pointer">🟠 Orange</button>
              <button type="button" onClick={() => onChatAction?.("Change color to purple")} className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-extrabold text-slate-700 border border-white/50 shadow-sm hover:shadow-md hover:scale-105 hover:text-primary hover:border-primary/30 transition-all cursor-pointer">🟣 Purple</button>
              <button type="button" onClick={() => onChatAction?.("Change color to pink")} className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-extrabold text-slate-700 border border-white/50 shadow-sm hover:shadow-md hover:scale-105 hover:text-primary hover:border-primary/30 transition-all cursor-pointer">🌸 Pink</button>
              <button type="button" onClick={() => onChatAction?.("Change color to teal")} className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-extrabold text-slate-700 border border-white/50 shadow-sm hover:shadow-md hover:scale-105 hover:text-primary hover:border-primary/30 transition-all cursor-pointer">🟢 Teal</button>
            </div>
            {/* Row 2: Features */}
            <div className="flex flex-wrap gap-1.5 justify-center">
              <button type="button" onClick={() => onChatAction?.("Change website name")} className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-extrabold text-slate-700 border border-white/50 shadow-sm hover:shadow-md hover:scale-105 hover:text-primary hover:border-primary/30 transition-all cursor-pointer">✨ Change Name</button>
              <button type="button" onClick={() => onChatAction?.("Enable dark mode")} className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-extrabold text-slate-700 border border-white/50 shadow-sm hover:shadow-md hover:scale-105 hover:text-primary hover:border-primary/30 transition-all cursor-pointer">🌙 Dark Mode</button>
              <button type="button" onClick={() => onChatAction?.("Enable light mode")} className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-extrabold text-slate-700 border border-white/50 shadow-sm hover:shadow-md hover:scale-105 hover:text-primary hover:border-primary/30 transition-all cursor-pointer">☀️ Light Mode</button>
            </div>
          </div>
          
          <form onSubmit={handleSend} className="relative flex items-center w-full bg-white/90 backdrop-blur-xl rounded-2xl p-1.5 shadow-xl border border-white/60 focus-within:ring-4 focus-within:ring-primary/20 transition-all">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tell me what to change..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 placeholder:text-slate-400 pl-4 py-2"
            />
            <button type="submit" disabled={!inputValue.trim()} className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-indigo-600 text-white flex items-center justify-center disabled:opacity-50 shrink-0 shadow-md">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
