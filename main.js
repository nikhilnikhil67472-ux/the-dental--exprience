document.addEventListener('DOMContentLoaded', () => {
    // --- Locomotive Scroll ---
    const scroller = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        tablet: { smooth: true },
        smartphone: { smooth: true }
    });

    // Sync Locomotive Scroll with ScrollTrigger
    scroller.on('scroll', ScrollTrigger.update);
    ScrollTrigger.scrollerProxy('[data-scroll-container]', {
        scrollTop(value) {
            return arguments.length ? scroller.scrollTo(value, 0, 0) : scroller.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        }
    });

    // --- 3D Logo Intro Animation ---
    const init3DIntro = () => {
        const canvas = document.getElementById('intro-canvas');
        const renderer = new THREE.WebGLRenderer({ 
            canvas, 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputEncoding = THREE.sRGBEncoding;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 8;

        // --- High-Quality Procedural Tooth ---
        const toothGroup = new THREE.Group();
        
        // Material: Glossy Enamel with Transparency
        const enamelMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.05,
            roughness: 0.1,
            transmission: 0.3,
            thickness: 0.5,
            ior: 1.5,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            envMapIntensity: 1,
            reflectivity: 0.5,
            transparent: true,
            opacity: 0.95
        });

        // Crown - Using a rounded box-like shape for anatomical accuracy
        const crownGeo = new THREE.IcosahedronGeometry(1.2, 3);
        const crown = new THREE.Mesh(crownGeo, enamelMaterial);
        crown.scale.set(1.1, 0.9, 1.1); // Squashed crown
        crown.position.y = 0.5;
        crown.castShadow = true;
        crown.receiveShadow = true;
        
        // Add subtle "cusps" to the crown
        crown.geometry.attributes.position.array.forEach((val, i) => {
            if (i % 3 === 1 && val > 0.5) { // Top vertices
                crown.geometry.attributes.position.array[i] += Math.random() * 0.1;
            }
        });
        
        toothGroup.add(crown);

        // Roots
        const rootMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xf9f9f9,
            roughness: 0.3,
            transmission: 0.1,
            thickness: 0.2
        });

        const createRoot = (x, z, rotZ) => {
            const rootGeo = new THREE.CylinderGeometry(0.4, 0.1, 1.8, 32, 1, false);
            const root = new THREE.Mesh(rootGeo, rootMaterial);
            root.position.set(x, -0.6, z);
            root.rotation.z = rotZ;
            root.castShadow = true;
            toothGroup.add(root);
        };

        createRoot(-0.4, 0, Math.PI + 0.2);
        createRoot(0.4, 0, Math.PI - 0.2);
        createRoot(0, 0.4, Math.PI); // Third root for molar accuracy
 
         scene.add(toothGroup);
         toothGroup.scale.set(0, 0, 0); // Start at 0 size

         // Hide loader once scene is ready
         const loaderEl = document.getElementById('loader-3d');
         if (loaderEl) {
             gsap.to(loaderEl, { opacity: 0, duration: 0.5, onComplete: () => loaderEl.style.display = 'none' });
         }
 
         // --- Lighting ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const spotLight = new THREE.SpotLight(0xffffff, 1.5);
        spotLight.position.set(5, 10, 5);
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
        scene.add(spotLight);

        const blueLight = new THREE.PointLight(0x0EA5E9, 0.8);
        blueLight.position.set(-5, -2, 5);
        scene.add(blueLight);

        const topLight = new THREE.PointLight(0xffffff, 1);
        topLight.position.set(0, 5, 0);
        scene.add(topLight);

        // --- Animation Sequence ---
        const tl = gsap.timeline({
            onComplete: () => {
                gsap.to('#intro-3d', {
                    opacity: 0,
                    duration: 1.5,
                    ease: "power2.inOut",
                    onComplete: () => {
                        const introEl = document.getElementById('intro-3d');
                        if (introEl) introEl.style.display = 'none';
                        document.querySelector('.main-content').classList.add('visible');
                        initHero3D();
                        ScrollTrigger.refresh();
                    }
                });
            }
        });

        // Cinematic Entrance
        tl.to(toothGroup.scale, { 
            x: 1, y: 1, z: 1, 
            duration: 2, 
            ease: "expo.out" 
        })
        .to(toothGroup.rotation, { 
            y: Math.PI * 4, 
            x: Math.PI * 0.2,
            z: Math.PI * 0.1,
            duration: 4, 
            ease: "power3.inOut" 
        }, 0)
        .to(camera.position, { 
            z: 6, 
            duration: 4, 
            ease: "power2.inOut" 
        }, 0)
        .to(toothGroup.scale, {
            x: 1.2, y: 1.2, z: 1.2,
            duration: 1,
            ease: "power2.inOut"
        }, "-=1.5")
        .to(toothGroup.position, {
            y: 0.5,
            duration: 1,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut"
        }, "-=1.5");

        // Floating Animation
        const animate = () => {
            const reqId = requestAnimationFrame(animate);
            if (toothGroup) {
                toothGroup.rotation.y += 0.005;
                toothGroup.position.y += Math.sin(Date.now() * 0.002) * 0.001;
            }
            renderer.render(scene, camera);
        };
        animate();

        // Handle Window Resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup function (optional but good practice)
        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
        };
    };

    // --- Hero 3D Interactive Scene ---
    const initHero3D = () => {
        const container = document.getElementById('hero-3d-container');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Floating Bubbles / Particles
        const particlesGeometry = new THREE.BufferGeometry();
        const count = 200;
        const positions = new Float32Array(count * 3);
        for(let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 15;
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.1,
            color: 0x0EA5E9,
            transparent: true,
            opacity: 0.6
        });
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);

        // Main Floating Object
        const mainGeo = new THREE.IcosahedronGeometry(2, 1);
        const mainMat = new THREE.MeshNormalMaterial({ wireframe: true, transparent: true, opacity: 0.3 });
        const mainMesh = new THREE.Mesh(mainGeo, mainMat);
        scene.add(mainMesh);

        // Mouse Interaction
        let mouseX = 0, mouseY = 0;
        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) - 0.5;
            mouseY = (e.clientY / window.innerHeight) - 0.5;
        });

        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);
            mainMesh.rotation.y += 0.005;
            mainMesh.rotation.x += 0.003;
            particles.rotation.y += (mouseX * 0.05 - particles.rotation.y) * 0.1;
            particles.rotation.x += (mouseY * 0.05 - particles.rotation.x) * 0.1;
            renderer.render(scene, camera);
        };
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    };

    // --- WebGL Check ---
    const hasWebGL = () => {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) { return false; }
    };

    if (hasWebGL() && typeof THREE !== 'undefined') {
        init3DIntro();
    } else {
        const introEl = document.getElementById('intro-3d');
        if (introEl) introEl.style.display = 'none';
        document.querySelector('.main-content').classList.add('visible');
    }

    // --- Scroll Animations (GSAP + ScrollTrigger) ---
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.addEventListener('refresh', () => scroller.update());
    ScrollTrigger.refresh();

    // Fade up animation for sections
    document.querySelectorAll('section').forEach(section => {
        gsap.from(section.querySelectorAll('.reveal-up'), {
            scrollTrigger: {
                trigger: section,
                scroller: '[data-scroll-container]',
                start: 'top 80%',
            },
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: 'power4.out',
            stagger: 0.2
        });
    });

    // --- UI Logic ---
    document.getElementById('year').textContent = new Date().getFullYear();
    
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
    }

    // Swiper
    const swiper = new Swiper('.testimonial-carousel', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: { delay: 4000 },
        pagination: { el: '.swiper-pagination', clickable: true },
        breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
    });

    // Booking Form
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(bookingForm);
            const data = Object.fromEntries(formData.entries());
            const responseDiv = document.getElementById('form-response');
            
            responseDiv.innerHTML = '<p class="text-primary">Processing...</p>';
            await new Promise(r => setTimeout(r, 1500));
            responseDiv.innerHTML = '<p class="text-green-500">Success! Redirecting...</p>';
            
            const waMsg = `Hi, I want to book an appointment. Name: ${data.name}, Date: ${data.date}, Time: ${data.time}`;
            window.open(`https://wa.me/919958000108?text=${encodeURIComponent(waMsg)}`, '_blank');
            bookingForm.reset();
        });
    }
});
