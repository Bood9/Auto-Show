import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial, Box, Cylinder } from '@react-three/drei';

function LiquidCar(props) {
    const materialRef = useRef();

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.distort = 0.3 + Math.sin(state.clock.getElapsedTime() * 0.8) * 0.1;
        }
    });

    const LiquidMaterial = (
        <MeshDistortMaterial
            ref={materialRef}
            color="#D32F2F"
            envMapIntensity={1}
            clearcoat={1}
            clearcoatRoughness={0}
            metalness={0.9}
            roughness={0.1}
            distort={0.3}
            speed={2}
        />
    );

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <group {...props}>
                {/* Car Body */}
                <Box args={[2.2, 0.5, 1]} position={[0, -0.2, 0]}>
                    {LiquidMaterial}
                </Box>

                {/* Car Cabin */}
                <Box args={[1.2, 0.6, 0.8]} position={[-0.2, 0.35, 0]}>
                    {LiquidMaterial}
                </Box>

                {/* Wheels */}
                <Cylinder args={[0.35, 0.35, 0.2, 32]} rotation={[Math.PI / 2, 0, 0]} position={[-0.8, -0.5, 0.5]}>
                    <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
                </Cylinder>
                <Cylinder args={[0.35, 0.35, 0.2, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0.8, -0.5, 0.5]}>
                    <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
                </Cylinder>
                <Cylinder args={[0.35, 0.35, 0.2, 32]} rotation={[Math.PI / 2, 0, 0]} position={[-0.8, -0.5, -0.5]}>
                    <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
                </Cylinder>
                <Cylinder args={[0.35, 0.35, 0.2, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0.8, -0.5, -0.5]}>
                    <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
                </Cylinder>
            </group>
        </Float>
    );
}

const Hero3D = () => {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <color attach="background" args={['#0a0a0a']} />

                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#FFD700" />
                <pointLight position={[0, 0, 5]} intensity={0.5} color="#D32F2F" />

                <LiquidCar position={[0, 0, 0]} rotation={[0, Math.PI / 8, 0]} scale={1.2} />

                <Environment preset="studio" />
            </Canvas>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark/20 to-dark pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-transparent to-dark/80 pointer-events-none" />
        </div>
    );
};

export default Hero3D;
