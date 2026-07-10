import { useEffect, useRef } from "react";
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  Group,
  Mesh,
  PlaneGeometry,
  TorusGeometry,
  MeshBasicMaterial,
  BufferGeometry,
  BufferAttribute,
  Points,
  PointsMaterial,
  TextureLoader,
  DoubleSide,
  AdditiveBlending,
  Sprite,
  SpriteMaterial,
  CanvasTexture
} from "three";

// Читает CSS-переменную с RGB-триплетом ("94 162 255") в THREE.Color
function tripletToRGB(name) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const parts = raw.split(/\s+/).map(Number);
  if (parts.length === 3 && parts.every((n) => !isNaN(n))) {
    return { r: parts[0] / 255, g: parts[1] / 255, b: parts[2] / 255 };
  }
  return null;
}

export default function ThreeDHeroScene({ enableParallax, isMobile = false }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Setup mouse move tracking for parallax (only on desktop if enabled)
    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    if (enableParallax && !isMobile) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    // 2. Setup Three.js Scene, Camera, Renderer
    const scene = new Scene();

    const camera = new PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = isMobile ? 6.0 : 7.5; // Closer camera on mobile to look larger

    const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5)); // Fixed DPR [1, 1] on mobile for performance

    // 3. Add Lights
    const ambientLight = new AmbientLight(0xffffff, isMobile ? 0.75 : 0.6);
    scene.add(ambientLight);

    const dirLight = new DirectionalLight(0x5ea2ff, isMobile ? 1.4 : 1.6);
    dirLight.position.set(5, 5, 8);
    scene.add(dirLight);

    // 4. Create Group for entire constellation
    const baseGroup = new Group();
    scene.add(baseGroup);

    // 4a. Create Logo Plane Group
    const logoGroup = new Group();
    baseGroup.add(logoGroup);

    // PNG логотипа — белый силуэт, поэтому цвет материала (умножение)
    // окрашивает его в чистый цвет активной темы; syncTheme обновляет цвет
    const logoTexture = new TextureLoader().load("/logo-transparent.png");
    const logoSize = isMobile ? 2.2 : 2.4;
    const logoGeo = new PlaneGeometry(logoSize, logoSize);
    const logoMat = new MeshBasicMaterial({
      map: logoTexture,
      color: 0x2e7cf6,
      transparent: true,
      alphaTest: 0.1,
      depthWrite: true,
      side: DoubleSide // Render both sides to prevent any disappearing artifacts
    });
    const logoMesh = new Mesh(logoGeo, logoMat);
    logoGroup.add(logoMesh);

    // 4a-2. Пульсирующая аура за логотипом (спрайт с радиальным градиентом, additive)
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = glowCanvas.height = 256;
    const glowCtx = glowCanvas.getContext("2d");
    const glowGrad = glowCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
    glowGrad.addColorStop(0, "rgba(255, 255, 255, 0.5)");
    glowGrad.addColorStop(0.45, "rgba(255, 255, 255, 0.18)");
    glowGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
    glowCtx.fillStyle = glowGrad;
    glowCtx.fillRect(0, 0, 256, 256);

    const glowTexture = new CanvasTexture(glowCanvas);
    const glowMat = new SpriteMaterial({
      map: glowTexture,
      color: 0x3d8bff,
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false
    });
    const glowSprite = new Sprite(glowMat);
    glowSprite.scale.set(4.4, 4.4, 1);
    glowSprite.position.z = -0.5;
    logoGroup.add(glowSprite);

    // 4b. Add Orbital Rings
    const ring1Geo = new TorusGeometry(2.1, 0.015, 8, 64);
    const ring1Mat = new MeshBasicMaterial({
      color: 0x5ea2ff,
      transparent: true,
      opacity: 0.35
    });
    const ring1 = new Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = 1.2;
    ring1.rotation.y = 0.4;
    baseGroup.add(ring1);

    const ring2Geo = new TorusGeometry(2.5, 0.015, 8, 64);
    const ring2Mat = new MeshBasicMaterial({
      color: 0x2e7cf6,
      transparent: true,
      opacity: 0.25
    });
    const ring2 = new Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -0.8;
    ring2.rotation.y = -0.3;
    baseGroup.add(ring2);

    // Третье тонкое кольцо — циановый край градиента бренда
    const ring3Geo = new TorusGeometry(2.9, 0.01, 8, 64);
    const ring3Mat = new MeshBasicMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.18
    });
    const ring3 = new Mesh(ring3Geo, ring3Mat);
    ring3.rotation.x = 0.5;
    ring3.rotation.y = -0.9;
    baseGroup.add(ring3);

    // 4c. Add Floating Constellation Particles (Optimized count for mobile)
    const particleCount = isMobile ? 65 : 110;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = [];
    const initialPositions = [];
    const accentFlags = []; // ~30% частиц — светлый край градиента, остальные — основной цвет

    // Стартовые цвета (тема blue); syncTheme перекрасит под активную тему
    const blue = { r: 0.24, g: 0.545, b: 1.0 };
    const cyan = { r: 0.49, g: 0.827, b: 0.988 };

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * Math.random() - 1.0);
      const r = 2.8 + Math.random() * 2.4;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const isAccent = Math.random() < 0.3;
      accentFlags.push(isAccent);
      const c = isAccent ? cyan : blue;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      initialPositions.push({ x, y, z });
      velocities.push({
        speed: 0.1 + Math.random() * 0.4
      });
    }

    const particleGeometry = new BufferGeometry();
    particleGeometry.setAttribute("position", new BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new BufferAttribute(colors, 3));

    const particleMaterial = new PointsMaterial({
      vertexColors: true,
      size: isMobile ? 0.07 : 0.06, // Slightly larger particles on mobile for visibility
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
      blending: AdditiveBlending, // светящиеся точки вместо плоских
      depthWrite: false
    });
    const particles = new Points(particleGeometry, particleMaterial);
    baseGroup.add(particles);

    // --- Синхронизация цветов сцены с активной темой (CSS-переменные из :root) ---
    const syncTheme = () => {
      const primary = tripletToRGB("--color-primary");
      const bright = tripletToRGB("--color-primary-bright");
      const glow = tripletToRGB("--color-glow");
      const gradEnd = tripletToRGB("--color-grad-end");
      if (!primary || !bright) return;

      logoMat.color.setRGB(primary.r, primary.g, primary.b);
      ring1Mat.color.setRGB(bright.r, bright.g, bright.b);
      ring2Mat.color.setRGB(primary.r, primary.g, primary.b);
      if (gradEnd) ring3Mat.color.setRGB(gradEnd.r, gradEnd.g, gradEnd.b);
      if (glow) glowMat.color.setRGB(glow.r, glow.g, glow.b);
      dirLight.color.setRGB(bright.r, bright.g, bright.b);

      // Перекраска вертексных цветов частиц под тему
      const colorAttr = particleGeometry.attributes.color;
      const accent = gradEnd || bright;
      for (let i = 0; i < particleCount; i++) {
        const c = accentFlags[i] ? accent : bright;
        colorAttr.setXYZ(i, c.r, c.g, c.b);
      }
      colorAttr.needsUpdate = true;
    };

    // ThemeSwitcher пишет переменные в style атрибут <html> — следим за ним
    const themeObserver = new MutationObserver(syncTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"]
    });
    syncTheme();

    // 5. Animation Loop
    let animationFrameId;
    let isIntersecting = true;
    let time = 0;

    const tick = () => {
      if (!isIntersecting) return;
      time += 0.005;

      // Gentle swaying float + sway rotation (logo stays visible, never turns paper-thin)
      logoGroup.position.y = Math.sin(time) * 0.12;
      logoGroup.rotation.y = Math.sin(time * 0.5) * 0.25;

      // Rings opposite rotations (always active to provide 3D depth)
      ring1.rotation.z -= 0.003;
      ring2.rotation.z += 0.002;
      ring3.rotation.z -= 0.0015;

      // Дыхание ауры за логотипом
      const glowPulse = 4.4 + Math.sin(time * 1.6) * 0.3;
      glowSprite.scale.set(glowPulse, glowPulse, 1);
      glowMat.opacity = 0.85 + Math.sin(time * 1.6) * 0.15;

      // Update Particles (drift)
      const posAttr = particleGeometry.attributes.position;
      const mousePos3d = {
        x: mouseRef.current.x * 5,
        y: -mouseRef.current.y * 5
      };

      for (let i = 0; i < particleCount; i++) {
        let x = posAttr.getX(i);
        let y = posAttr.getY(i);
        let z = posAttr.getZ(i);

        const driftTime = time * velocities[i].speed;
        x += Math.sin(driftTime + i) * 0.002;
        y += Math.cos(driftTime - i) * 0.002;

        if (enableParallax && !isMobile) {
          const dx = x - mousePos3d.x;
          const dy = y - mousePos3d.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 3.5) {
            const dist = Math.sqrt(distSq);
            if (dist > 0.05) {
              const force = (1.87 - dist) * 0.005;
              x += (dx / dist) * force;
              y += (dy / dist) * force;
            }
          }
        }

        const init = initialPositions[i];
        x += (init.x - x) * 0.005;
        y += (init.y - y) * 0.005;

        posAttr.setXYZ(i, x, y, z);
      }
      posAttr.needsUpdate = true;

      // Camera lerp parallax on desktop, gentle auto-sway on mobile/tablet (prevents flat logo profile)
      if (enableParallax && !isMobile) {
        const targetX = mouseRef.current.x * 0.35;
        const targetY = -mouseRef.current.y * 0.35;

        baseGroup.rotation.y += (targetX - baseGroup.rotation.y) * 0.05;
        baseGroup.rotation.x += (targetY - baseGroup.rotation.x) * 0.05;
      } else {
        // Sway back and forth gently, never turning 90 degrees or facing backwards
        baseGroup.rotation.y = Math.sin(time * 0.5) * 0.18;
        baseGroup.rotation.x = Math.cos(time * 0.5) * 0.08;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };

    // 6. Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) {
          tick();
        } else {
          cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // 7. Handle Resize
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    tick();

    // Cleanup
    return () => {
      observer.disconnect();
      themeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      // Dispose resources
      logoGeo.dispose();
      logoMat.dispose();
      logoTexture.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      glowTexture.dispose();
      glowMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, [enableParallax, isMobile]);

  // Responsive styling wrapper
  const containerClass = isMobile
    ? "relative w-full h-full flex items-center justify-center pointer-events-none z-0"
    : "absolute inset-y-0 w-full flex items-center justify-center md:items-start md:justify-end md:p-8 md:opacity-30 lg:opacity-100 lg:items-center lg:justify-center lg:right-0 lg:left-auto lg:w-[45%] pointer-events-none z-0";

  const canvasClass = "w-full h-full";

  return (
    <div ref={containerRef} className={containerClass}>
      <canvas ref={canvasRef} className={canvasClass} />
    </div>
  );
}
