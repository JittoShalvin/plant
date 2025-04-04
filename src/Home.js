import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './css/Home.css';

import plantCareImage from './images/plant-care.jpg';

const Home = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);
    const [displayText, setDisplayText] = useState('');
    const [isTypingComplete, setIsTypingComplete] = useState(false);
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    // Scroll to top when route changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    const fullText = "Identify and treat plant diseases with advanced AI technology.";
    
    // Typing effect
    useEffect(() => {
        let currentIndex = 0;
        let typingInterval;
        
        // Start typing animation
        const startTypingAnimation = () => {
            typingInterval = setInterval(() => {
                if (currentIndex <= fullText.length) {
                    setDisplayText(fullText.substring(0, currentIndex));
                    currentIndex++;
                } else {
                    clearInterval(typingInterval);
                    setIsTypingComplete(true);
                }
            }, 50); // Controls typing speed
        };
        
        // Delay typing to let the page load first
        setTimeout(() => {
            startTypingAnimation();
        }, 500);
        
        // Cleanup
        return () => {
            clearInterval(typingInterval);
        };
    }, []);
    
    // Canvas web background effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const points = [];
        const maxDist = 150;
        const mouse = { x: 0, y: 0, active: false };
        
        // Set canvas size
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initPoints();
        };
        
        // Initialize points
        const initPoints = () => {
            points.length = 0;
            const density = Math.min(window.innerWidth, window.innerHeight) / 15;
            const numPoints = Math.floor((canvas.width * canvas.height) / (density * density));
            
            for (let i = 0; i < numPoints; i++) {
                points.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: Math.random() * 0.5 - 0.25,
                    vy: Math.random() * 0.5 - 0.25,
                    radius: Math.random() * 2 + 1
                });
            }
        };
        
        // Draw background
        const drawBackground = () => {
            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };
        
        // Draw points and connections
        const drawWeb = () => {
            // Update points position
            points.forEach(point => {
                point.x += point.vx;
                point.y += point.vy;
                
                // Bounce on edges
                if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
                if (point.y < 0 || point.y > canvas.height) point.vy *= -1;
                
                // Mouse interaction
                if (mouse.active) {
                    const dx = point.x - mouse.x;
                    const dy = point.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        const force = (120 - dist) / 120;
                        point.vx += (dx / dist) * force * 0.5;
                        point.vy += (dy / dist) * force * 0.5;
                    }
                }
                
                // Limit velocity
                const speed = Math.sqrt(point.vx * point.vx + point.vy * point.vy);
                if (speed > 1) {
                    point.vx = (point.vx / speed) * 1;
                    point.vy = (point.vy / speed) * 1;
                }
                
                // Draw point - using green color theme for plant app
                ctx.beginPath();
                ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#E5F5E0';
                ctx.fill();
            });
            
            // Draw connections
            ctx.beginPath();
            for (let i = 0; i < points.length; i++) {
                for (let j = i + 1; j < points.length; j++) {
                    const dx = points[i].x - points[j].x;
                    const dy = points[i].y - points[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < maxDist) {
                        ctx.moveTo(points[i].x, points[i].y);
                        ctx.lineTo(points[j].x, points[j].y);
                    }
                }
            }
            ctx.strokeStyle = 'rgba(144, 238, 144, 0.3)';
            ctx.lineWidth = 0.5;
            ctx.stroke();
        };
        
        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBackground();
            drawWeb();
            animationRef.current = requestAnimationFrame(animate);
        };
        
        // Mouse handlers
        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.active = true;
        };
        
        const handleMouseLeave = () => {
            mouse.active = false;
        };
        
        // Initialize
        handleResize();
        animate();
        setTimeout(() => setIsLoaded(true), 300);
        
        // Event listeners
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);
        
        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationRef.current);
        };
    }, []);

    // Add blinking cursor effect
    const cursorStyle = {
        display: isTypingComplete ? 'none' : 'inline-block',
        marginLeft: '2px',
        width: '2px',
        height: '1.2em',
        backgroundColor: 'currentColor',
        verticalAlign: 'text-bottom',
        animation: 'blink 1s step-end infinite'
    };
    
    const handleGetStarted = () => {
        navigate('/disease-identification');
    };

    // Add a new handler for blog navigation
    const handleBlogClick = () => {
        navigate('/blog');
    };

    return (
        <div className="home-container">
            <div className="hero-section">
                {/* Canvas background */}
                <canvas 
                    ref={canvasRef} 
                    className="web-background"
                />
                
                {/* Background Elements */}
                <div className="background-elements">
                    <div className="gradient-overlay"></div>
                    <div className="dot-pattern"></div>
                    <div className="floating-circle circle-1"></div>
                    <div className="floating-circle circle-2"></div>
                </div>
                
                {/* Hero Content */}
                <div className={`hero-content ${isLoaded ? 'loaded' : ''}`}>
                    <h1 className="hero-title">
                        <span className="text-reveal">Welcome to the</span>
                        <span className="title-highlight">Plant Disease Prediction App</span>
                    </h1>
                    <p className="hero-description">
                        {displayText}
                        <span style={cursorStyle}></span>
                    </p>
                    <div className="hero-buttons">
                        <button className="primary-button" onClick={handleGetStarted}>Get Started</button>
                        <button className="secondary-button" onClick={handleBlogClick}>Blog</button>
                    </div>
                </div>
            </div>
            
            <div className="features-section">
                <div className={`feature-card ${isLoaded ? 'loaded' : ''}`}>
                    <div className="feature-icon">🔍</div>
                    <h3>Disease Identification</h3>
                    <p>Upload images of your plants to identify diseases instantly</p>
                </div>
                <div className={`feature-card ${isLoaded ? 'loaded' : ''}`}>
                    <div className="feature-icon">📊</div>
                    <h3>Prediction Analysis</h3>
                    <p>Advanced algorithms to predict potential diseases based on conditions</p>
                </div>
                <div className={`feature-card ${isLoaded ? 'loaded' : ''}`}>
                    <div className="feature-icon">💊</div>
                    <h3>Treatment Suggestions</h3>
                    <p>Get detailed recommendations to treat identified plant diseases</p>
                </div>
            </div>
            
            {/* About Us Section */}
            <div className="about-section">
                <h2>About Us</h2>
                <div className="about-content">
                    <div className="about-image">
                        <img 
                            src={plantCareImage}
                            alt="Plant Care" 
                            className="about-img"
                            onError={(e) => {
                                console.error('Image failed to load');
                                e.target.src = 'https://via.placeholder.com/400x300?text=Plant+Care';
                            }}
                        />
                    </div>
                    <div className="about-text">
                        <h3>Empowering Plant Health Care</h3>
                        <p>We are dedicated to revolutionizing plant disease management through 
                           artificial intelligence. Our platform combines advanced machine learning 
                           with expert agricultural knowledge to provide accurate disease detection 
                           and treatment recommendations.</p>
                        <p>With years of research and development, we've created a tool that helps 
                           farmers, gardeners, and plant enthusiasts identify and treat plant 
                           diseases efficiently and effectively.</p>
                    </div>
                </div>
            </div>

            {/* Why Choose Us Section */}
            <div className="why-us-section">
                <h2>Why Choose Us</h2>
                <div className="why-us-grid">
                    <div className="why-us-card">
                        <div className="why-us-icon">🎯</div>
                        <h3>Accurate Detection</h3>
                        <p>Our AI model provides highly accurate disease detection with 
                           continuous learning and improvement.</p>
                    </div>
                    <div className="why-us-card">
                        <div className="why-us-icon">⚡</div>
                        <h3>Instant Results</h3>
                        <p>Get immediate disease identification and treatment recommendations 
                           within seconds.</p>
                    </div>
                    <div className="why-us-card">
                        <div className="why-us-icon">📱</div>
                        <h3>Easy to Use</h3>
                        <p>Simple and intuitive interface designed for users of all 
                           technical backgrounds.</p>
                    </div>
                    <div className="why-us-card">
                        <div className="why-us-icon">🔄</div>
                        <h3>Regular Updates</h3>
                        <p>Continuous updates to our disease database and AI model for 
                           improved accuracy.</p>
                    </div>
                </div>
            </div>
            
            {/* Animation keyframes */}
            <style>
                {`
                    @keyframes blink {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0; }
                    }
                    
                    @keyframes float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-20px); }
                    }
                    
                    @keyframes float2 {
                        0%, 100% { transform: translateY(0) translateX(0); }
                        50% { transform: translateY(-15px) translateX(15px); }
                    }
                `}
            </style>
        </div>
    );
};

export default Home;