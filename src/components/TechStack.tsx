import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  RapierRigidBody,
} from "@react-three/rapier";

gsap.registerPlugin(ScrollTrigger);
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiExpress,
  SiPython,
  SiMongodb,
  SiMysql,
  SiTailwindcss,
  SiThreedotjs,
  SiGreensock,
  SiDocker,
  SiGit,
} from "react-icons/si";

// ----------------------------------------------------
// 12-15 Unique Technologies Data Array
// ----------------------------------------------------
interface TechItem {
  name: string;
  brandColor: string;
  bgColor: string;
  icon: any;
  scale: number;
}

const techList: TechItem[] = [
  { name: "React", brandColor: "#61DAFB", bgColor: "#0f2336", icon: SiReact, scale: 1.0 },
  { name: "Next.js", brandColor: "#ffffff", bgColor: "#1c1828", icon: SiNextdotjs, scale: 0.95 },
  { name: "TypeScript", brandColor: "#3178C6", bgColor: "#122340", icon: SiTypescript, scale: 0.95 },
  { name: "JavaScript", brandColor: "#F7DF1E", bgColor: "#2d2610", icon: SiJavascript, scale: 0.95 },
  { name: "Node.js", brandColor: "#5FA04E", bgColor: "#122b17", icon: SiNodedotjs, scale: 1.0 },
  { name: "Express", brandColor: "#ffffff", bgColor: "#211f2a", icon: SiExpress, scale: 0.9 },
  { name: "Python", brandColor: "#3776AB", bgColor: "#14253d", icon: SiPython, scale: 0.95 },
  { name: "MongoDB", brandColor: "#47A248", bgColor: "#112c17", icon: SiMongodb, scale: 0.95 },
  { name: "MySQL", brandColor: "#00758F", bgColor: "#102434", icon: SiMysql, scale: 0.9 },
  { name: "Tailwind CSS", brandColor: "#38BDF8", bgColor: "#0e2539", icon: SiTailwindcss, scale: 0.95 },
  { name: "Three.js", brandColor: "#ffffff", bgColor: "#251b38", icon: SiThreedotjs, scale: 0.95 },
  { name: "GSAP", brandColor: "#0AE448", bgColor: "#112e18", icon: SiGreensock, scale: 0.95 },
  { name: "Docker", brandColor: "#2496ED", bgColor: "#10243d", icon: SiDocker, scale: 0.9 },
  { name: "Git", brandColor: "#F05032", bgColor: "#321a16", icon: SiGit, scale: 0.9 },
];

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

// Extract SVG path from react-icons component
function getSvgPath(IconComponent: any): string {
  try {
    const elem = IconComponent({});
    const child = Array.isArray(elem.props.children)
      ? elem.props.children[0]
      : elem.props.children;
    return child?.props?.d || "";
  } catch {
    return "";
  }
}

// Generate canvas texture with logo on both front and back
function createTechTexture(tech: TechItem): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // 1. Uniform background color edge-to-edge
    ctx.fillStyle = tech.bgColor;
    ctx.fillRect(0, 0, 1024, 512);

    const svgPath = getSvgPath(tech.icon);
    const path = svgPath ? new Path2D(svgPath) : null;

    // 2. Draw front (x=256) and back (x=768)
    [256, 768].forEach((cx) => {
      // Soft radial glow behind logo
      const glow = ctx.createRadialGradient(cx, 256, 30, cx, 256, 220);
      glow.addColorStop(0, tech.brandColor + "38");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, 256, 220, 0, Math.PI * 2);
      ctx.fill();

      // Large centered logo
      if (path) {
        ctx.save();
        ctx.translate(cx - 130, 256 - 130);
        ctx.scale(10.83, 10.83); // 24 -> 260
        ctx.fillStyle = tech.brandColor;
        ctx.fill(path);
        ctx.restore();
      }
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

// ----------------------------------------------------
// Physics Bounds Container
// ----------------------------------------------------
function ContainerBounds() {
  const { viewport } = useThree();
  const halfW = viewport.width / 2;
  const halfH = viewport.height / 2;
  const thickness = 2;

  return (
    <RigidBody type="fixed" colliders={false}>
      {/* Top */}
      <CuboidCollider
        args={[halfW + 4, thickness, 8]}
        position={[0, halfH + thickness, 0]}
      />
      {/* Bottom */}
      <CuboidCollider
        args={[halfW + 4, thickness, 8]}
        position={[0, -halfH - thickness, 0]}
      />
      {/* Left */}
      <CuboidCollider
        args={[thickness, halfH + 4, 8]}
        position={[-halfW - thickness, 0, 0]}
      />
      {/* Right */}
      <CuboidCollider
        args={[thickness, halfH + 4, 8]}
        position={[halfW + thickness, 0, 0]}
      />
      {/* Back */}
      <CuboidCollider
        args={[halfW + 4, halfH + 4, thickness]}
        position={[0, 0, -4.5]}
      />
      {/* Front */}
      <CuboidCollider
        args={[halfW + 4, halfH + 4, thickness]}
        position={[0, 0, 4.5]}
      />
    </RigidBody>
  );
}

// ----------------------------------------------------
// Interactive Sphere Component
// ----------------------------------------------------
interface SphereProps {
  tech: TechItem;
  material: THREE.Material;
  isActive: boolean;
  initialPos: [number, number, number];
  onHover: (name: string | null) => void;
}

function SphereGeo({
  tech,
  material,
  isActive,
  initialPos,
  onHover,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);
  const { viewport } = useThree();
  const scale = tech.scale;

  useFrame(({ pointer }, delta) => {
    if (!isActive || !api.current) return;
    delta = Math.min(0.05, delta);
    const pos = api.current.translation();

    // 1. Container boundaries clamp force
    const boundX = viewport.width * 0.44;
    const boundY = viewport.height * 0.42;
    const boundZ = 3.0;

    const force = new THREE.Vector3();
    if (Math.abs(pos.x) > boundX) {
      force.x = -Math.sign(pos.x) * (Math.abs(pos.x) - boundX) * 35;
    }
    if (Math.abs(pos.y) > boundY) {
      force.y = -Math.sign(pos.y) * (Math.abs(pos.y) - boundY) * 35;
    }
    if (Math.abs(pos.z) > boundZ) {
      force.z = -Math.sign(pos.z) * (Math.abs(pos.z) - boundZ) * 35;
    }

    // 2. Centering attraction to keep balls grouped together
    force.x -= pos.x * 10 * delta * scale;
    force.y -= (pos.y + 0.2) * 12 * delta * scale;
    force.z -= pos.z * 12 * delta * scale;

    // 3. Cursor repulsion
    const p3d = new THREE.Vector3(
      (pointer.x * viewport.width) / 2,
      (pointer.y * viewport.height) / 2,
      0
    );
    const currentPos = new THREE.Vector3(pos.x, pos.y, pos.z);
    const dist = currentPos.distanceTo(p3d);
    if (dist < 3.2 && dist > 0.05) {
      const repelDir = currentPos
        .clone()
        .sub(p3d)
        .normalize()
        .multiplyScalar((3.2 - dist) * 1.5);
      force.add(repelDir);
    }

    api.current.applyImpulse(force, true);
  });

  return (
    <RigidBody
      linearDamping={0.8}
      angularDamping={0.4}
      friction={0.25}
      restitution={0.6}
      position={initialPos}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(tech.name);
        }}
        onPointerOut={() => {
          onHover(null);
        }}
      />
    </RigidBody>
  );
}

// ----------------------------------------------------
// Pointer Repulsion RigidBody
// ----------------------------------------------------
function Pointer({ isActive }: { isActive: boolean }) {
  const ref = useRef<RapierRigidBody>(null);
  const targetVec = useMemo(() => new THREE.Vector3(100, 100, 100), []);

  useFrame(({ pointer, viewport }) => {
    if (!isActive || !ref.current) return;
    targetVec.set(
      (pointer.x * viewport.width) / 2,
      (pointer.y * viewport.height) / 2,
      0
    );
    ref.current.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2.0]} />
    </RigidBody>
  );
}

// ----------------------------------------------------
// Main TechStack Component
// ----------------------------------------------------
const TechStack = () => {
  const [isActive, setIsActive] = useState(false);
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let trigger: ScrollTrigger | null = null;
    try {
      trigger = ScrollTrigger.create({
        id: "techstack",
        trigger: ".techstack",
        start: "top 95%",
        onEnter: () => setIsActive(true),
        onLeaveBack: () => setIsActive(false),
      });

      // Sort in page order then refresh so Work's pinSpacing is correctly measured
      // with TechStack's real position in the DOM.
      ScrollTrigger.sort();
      requestAnimationFrame(() => {
        try {
          ScrollTrigger.refresh();
        } catch {}
      });
    } catch (err) {
      console.warn("TechStack ScrollTrigger error:", err);
    }

    return () => {
      try {
        trigger?.kill();
      } catch {}
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Generate materials with brand-tinted canvas textures
  const materials = useMemo(() => {
    return techList.map((tech) => {
      const texture = createTechTexture(tech);
      return new THREE.MeshPhysicalMaterial({
        map: texture,
        emissive: tech.brandColor,
        emissiveIntensity: 0.12,
        roughness: 0.35,
        metalness: 0.15,
        clearcoat: 0.4,
        clearcoatRoughness: 0.1,
      });
    });
  }, []);

  // Initial random positions clustered in center
  const initialPositions = useMemo(() => {
    return techList.map((_, i) => {
      const angle = (i / techList.length) * Math.PI * 2;
      const radius = 2.5 + (i % 3) * 0.8;
      return [
        Math.cos(angle) * radius,
        Math.sin(angle) * radius - 0.5,
        (Math.random() - 0.5) * 1.5,
      ] as [number, number, number];
    });
  }, []);

  return (
    <div
      className="techstack"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredTech(null)}
    >
      <h2 className="techstack-heading">
        MY TECH <span>STACK</span>
      </h2>

      {/* Floating Hover Tooltip */}
      {hoveredTech && (
        <div
          className="tech-tooltip"
          style={{
            left: `${mousePos.x + 16}px`,
            top: `${mousePos.y + 16}px`,
          }}
        >
          {hoveredTech}
        </div>
      )}

      <Canvas
        shadows
        gl={{ alpha: true, stencil: false, depth: true, antialias: true }}
        camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
        onCreated={(state) => (state.gl.toneMappingExposure = 1.35)}
        className="tech-canvas"
      >
        <ambientLight intensity={1.2} />
        <spotLight
          position={[20, 20, 25]}
          penumbra={1}
          angle={0.25}
          color="#ffffff"
          castShadow
          shadow-mapSize={[512, 512]}
        />
        <directionalLight position={[0, 6, -4]} intensity={1.5} />
        <directionalLight position={[-8, -4, 6]} intensity={0.8} color="#c2a4ff" />

        <Physics gravity={[0, 0, 0]}>
          <ContainerBounds />
          <Pointer isActive={isActive} />
          {techList.map((tech, i) => (
            <SphereGeo
              key={tech.name}
              tech={tech}
              material={materials[i]}
              isActive={isActive}
              initialPos={initialPositions[i]}
              onHover={setHoveredTech}
            />
          ))}
        </Physics>

        <Environment
          files="/models/char_enviorment.hdr"
          environmentIntensity={0.4}
          environmentRotation={[0, 4, 2]}
        />
        <EffectComposer enableNormalPass={false}>
          <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default TechStack;
