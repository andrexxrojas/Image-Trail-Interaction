import styles from "./ImageTrail.module.css";
import imageData from "../../data/images.json";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const MAX_IMAGES = 6;
const DISTANCE_THRESHOLD = 50;

export default function ImageTrail() {
    const containerRef = useRef(null);
    const imageRefs = useRef([]);
    const indexRef = useRef(0);
    const activeIndexRef = useRef(0);

    const lastPos = useRef({ x: 0, y: 0 });

    const images = imageData.map(img => img.media);

    useGSAP(() => {
        const handleMouseMove = (e) => {
            const dx = e.clientX - lastPos.current.x;
            const dy = e.clientY - lastPos.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < DISTANCE_THRESHOLD) return;

            const img = imageRefs.current[activeIndexRef.current];
            if (!img) return;

            img.src = images[indexRef.current];
            indexRef.current = (indexRef.current + 1) % images.length;

            const offsetX = img.offsetWidth / 2;
            const offsetY = img.offsetHeight / 2;

            gsap.killTweensOf(img);

            const rotation = (Math.random() - 0.5) * 30;
            const scaleFactor = 0.8 + Math.random() * 0.4;

            gsap.set(img, {
                x: e.clientX - offsetX,
                y: e.clientY - offsetY,
                scale: 0,
                opacity: 0,
                rotation,
                zIndex: Date.now()
            });

            gsap.to(img, {
                scale: scaleFactor,
                opacity: 1,
                rotation,
                duration: 0.35,
                ease: "power3.out"
            });

            gsap.to(img, {
                scale: scaleFactor * 0.2,
                opacity: 0,
                duration: 0.4,
                delay: 0.35,
                ease: "power3.inOut"
            });

            activeIndexRef.current = (activeIndexRef.current + 1) % MAX_IMAGES;

            lastPos.current.x = e.clientX;
            lastPos.current.y = e.clientY;
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className={styles.trailContainer}>
            {Array.from({ length: MAX_IMAGES }).map((_, i) => (
                <img
                    key={i}
                    ref={el => (imageRefs.current[i] = el)}
                    className={styles.image}
                    alt=""
                    draggable={false}
                />
            ))}
        </section>
    );
}
