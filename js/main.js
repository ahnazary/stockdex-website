// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initSearch();
    initParticleAnimation();
});

// ============================================
// Theme Toggle Functionality
// ============================================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Load saved theme on page load
    loadTheme();

    // Add change event listener to toggle switch
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            const newTheme = this.checked ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        let theme;
        
        if (savedTheme) {
            theme = savedTheme;
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            theme = prefersDark ? 'dark' : 'light';
        }
        
        html.setAttribute('data-theme', theme);
        
        // Update checkbox state to match theme
        if (themeToggle) {
            themeToggle.checked = theme === 'dark';
        }
    }
}

// ============================================
// Search Functionality
// ============================================
function initSearch() {
    const searchInput = document.getElementById('stockSearch');
    const stockTags = document.querySelectorAll('.stock-tag');

    // Handle search on Enter key
    if (searchInput) {
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    performSearch(query);
                }
            }
        });
    }

    // Handle popular stock tag clicks
    stockTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const symbol = this.dataset.symbol;
            if (searchInput) {
                searchInput.value = symbol;
            }
            performSearch(symbol);
        });
    });
}

// Search function (placeholder for now)
function performSearch(query) {
    console.log('Searching for:', query);
    // For now, just show an alert
    // This will be replaced with actual search functionality later
    alert(`Searching for: ${query}\n\nSearch functionality coming soon!`);
}

// ============================================
// Particle Animation
// ============================================
function initParticleAnimation() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let currencySymbols = [];
    let animationId;
    
    // Configuration
    const config = {
        particleCount: 50,
        currencyCount: 12,
        minRadius: 3,
        maxRadius: 8,
        minSpeed: 0.3,
        maxSpeed: 1.2,
        lineDistance: 150,
        lineWidth: 0.5,
        colors: {
            dark: [
                'rgba(34, 197, 94, 0.7)',   // Green
                'rgba(59, 130, 246, 0.7)',  // Blue
                'rgba(168, 85, 247, 0.7)',  // Purple
                'rgba(236, 72, 153, 0.7)',  // Pink
                'rgba(251, 146, 60, 0.7)',  // Orange
                'rgba(20, 184, 166, 0.7)'   // Teal
            ],
            light: [
                'rgba(22, 163, 74, 0.6)',   // Green
                'rgba(37, 99, 235, 0.6)',   // Blue
                'rgba(147, 51, 234, 0.6)',  // Purple
                'rgba(219, 39, 119, 0.6)',  // Pink
                'rgba(234, 88, 12, 0.6)',   // Orange
                'rgba(13, 148, 136, 0.6)'   // Teal
            ]
        },
        currencyColors: {
            dark: 'rgba(255, 193, 7, 0.6)',
            light: 'rgba(202, 138, 4, 0.7)'
        },
        lineColors: {
            dark: 'rgba(148, 163, 184, 0.15)',
            light: 'rgba(71, 85, 105, 0.12)'
        }
    };
    
    // Particle class (balls)
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = Math.random() * (config.maxRadius - config.minRadius) + config.minRadius;
            
            const speed = Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed;
            const angle = Math.random() * Math.PI * 2;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            
            this.colorIndex = Math.floor(Math.random() * config.colors.dark.length);
        }
        
        getColor() {
            const theme = document.documentElement.getAttribute('data-theme') || 'dark';
            return config.colors[theme][this.colorIndex];
        }
        
        update() {
            // Move particle
            this.x += this.vx;
            this.y += this.vy;
            
            // Bounce off walls
            if (this.x - this.radius <= 0) {
                this.x = this.radius;
                this.vx *= -1;
            } else if (this.x + this.radius >= canvas.width) {
                this.x = canvas.width - this.radius;
                this.vx *= -1;
            }
            
            if (this.y - this.radius <= 0) {
                this.y = this.radius;
                this.vy *= -1;
            } else if (this.y + this.radius >= canvas.height) {
                this.y = canvas.height - this.radius;
                this.vy *= -1;
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.getColor();
            ctx.fill();
        }
    }
    
    // Currency Symbol class ($ and €)
    class CurrencySymbol {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.symbol = Math.random() > 0.5 ? '$' : '€';
            this.size = Math.random() * 16 + 14; // 14-30px font size
            
            const speed = Math.random() * 0.5 + 0.2; // Slower than particles
            const angle = Math.random() * Math.PI * 2;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        }
        
        getColor() {
            const theme = document.documentElement.getAttribute('data-theme') || 'dark';
            return config.currencyColors[theme];
        }
        
        update() {
            // Move symbol
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.rotationSpeed;
            
            // Bounce off walls
            const margin = this.size;
            if (this.x - margin <= 0) {
                this.x = margin;
                this.vx *= -1;
            } else if (this.x + margin >= canvas.width) {
                this.x = canvas.width - margin;
                this.vx *= -1;
            }
            
            if (this.y - margin <= 0) {
                this.y = margin;
                this.vy *= -1;
            } else if (this.y + margin >= canvas.height) {
                this.y = canvas.height - margin;
                this.vy *= -1;
            }
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.font = `bold ${this.size}px Inter, sans-serif`;
            ctx.fillStyle = this.getColor();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.symbol, 0, 0);
            ctx.restore();
        }
    }
    
    // Initialize canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Create particles
    function createParticles() {
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Create currency symbols
    function createCurrencySymbols() {
        currencySymbols = [];
        for (let i = 0; i < config.currencyCount; i++) {
            currencySymbols.push(new CurrencySymbol());
        }
    }
    
    // Draw lines between nearby particles (not currency symbols)
    function drawLines() {
        const theme = document.documentElement.getAttribute('data-theme') || 'dark';
        const lineColor = config.lineColors[theme];
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < config.lineDistance) {
                    // Fade line based on distance
                    const opacity = 1 - (distance / config.lineDistance);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = lineColor.replace(/[\d.]+\)$/, (opacity * 0.3) + ')');
                    ctx.lineWidth = config.lineWidth;
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw connecting lines first (behind particles)
        drawLines();
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Update and draw currency symbols (no lines)
        currencySymbols.forEach(symbol => {
            symbol.update();
            symbol.draw();
        });
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        resizeCanvas();
    });
    
    // Initialize
    resizeCanvas();
    createParticles();
    createCurrencySymbols();
    animate();
}
