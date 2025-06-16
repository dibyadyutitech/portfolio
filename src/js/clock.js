class PrecisionClock {
    constructor() {
        this.digitalTimeElement = document.getElementById('digital-time');
        this.digitalDateElement = document.getElementById('digital-date');
        this.hourHand = document.getElementById('hour-hand');
        this.minuteHand = document.getElementById('minute-hand');
        this.secondHand = document.getElementById('second-hand');
        this.clockNumbersContainer = document.getElementById('clock-numbers');
        
        this.dimensions = this.getClockDimensions();
        this.init();
    }

    init() {
        this.createClockNumbers();
        this.updateClock();
        this.startClock();
    }

    getClockDimensions() {
        const clockContainer = document.querySelector('.clock-container');
        const containerWidth = clockContainer.offsetWidth;
        
        // Adjust dimensions based on container size
        if (containerWidth >= 448) { // 28rem
            return {
                radius: 224,
                numberRadius: 180,
                hourHandLength: 112,
                minuteHandLength: 154,
                secondHandLength: 168
            };
        } else if (containerWidth >= 384) { // 24rem
            return {
                radius: 192,
                numberRadius: 156,
                hourHandLength: 96,
                minuteHandLength: 132,
                secondHandLength: 144
            };
        } else { // 20rem
            return {
                radius: 160,
                numberRadius: 130,
                hourHandLength: 80,
                minuteHandLength: 110,
                secondHandLength: 120
            };
        }
    }

    createClockNumbers() {
        const numbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        
        numbers.forEach(number => {
            const numberElement = document.createElement('div');
            numberElement.className = 'clock-number';
            numberElement.textContent = number;
            
            const position = this.getNumberPosition(number, this.dimensions.numberRadius);
            numberElement.style.transform = `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`;
            
            this.clockNumbersContainer.appendChild(numberElement);
        });
    }

    getNumberPosition(number, radius) {
        const angle = ((number === 12 ? 0 : number) * 30 - 90) * (Math.PI / 180);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return { x, y };
    }

    getTimeAngles(time) {
        const hours = time.getHours() % 12;
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();

        return {
            hourAngle: (hours * 30) + (minutes * 0.5),
            minuteAngle: minutes * 6,
            secondAngle: seconds * 6,
        };
    }

    formatTime(time) {
        return time.toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    formatDate(time) {
        return time.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    updateClock() {
        const now = new Date();
        const angles = this.getTimeAngles(now);

        // Update digital display
        this.digitalTimeElement.textContent = this.formatTime(now);
        this.digitalDateElement.textContent = this.formatDate(now);

        // Update analog clock hands
        this.hourHand.style.height = `${this.dimensions.hourHandLength}px`;
        this.hourHand.style.transform = `translate(-50%, -100%) rotate(${angles.hourAngle}deg)`;

        this.minuteHand.style.height = `${this.dimensions.minuteHandLength}px`;
        this.minuteHand.style.transform = `translate(-50%, -100%) rotate(${angles.minuteAngle}deg)`;

        this.secondHand.style.height = `${this.dimensions.secondHandLength}px`;
        this.secondHand.style.transform = `translate(-50%, -100%) rotate(${angles.secondAngle}deg)`;
    }

    startClock() {
        // Update immediately
        this.updateClock();
        
        // Then update every second
        setInterval(() => {
            this.updateClock();
        }, 1000);
    }

    // Handle window resize to adjust dimensions
    handleResize() {
        this.dimensions = this.getClockDimensions();
        
        // Clear existing elements
        this.clockNumbersContainer.innerHTML = '';
        
        // Recreate elements with new dimensions
        this.createClockNumbers();
        this.updateClock();
    }
}

// Initialize the clock when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const clock = new PrecisionClock();
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            clock.handleResize();
        }, 250);
    });
});

// Add smooth transitions for better UX
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Refresh clock when tab becomes visible again
        const clock = new PrecisionClock();
    }
});