// 获取DOM元素
const dateText = document.getElementById('date-text');
const digitElements = {
    'hour-tens': document.getElementById('hour-tens'),
    'hour-ones': document.getElementById('hour-ones'),
    'min-tens': document.getElementById('min-tens'),
    'min-ones': document.getElementById('min-ones'),
    'sec-tens': document.getElementById('sec-tens'),
    'sec-ones': document.getElementById('sec-ones')
};

// 从DOM中读取初始数字
function getInitialDigits() {
    const initialDigits = {};
    for (const [id, element] of Object.entries(digitElements)) {
        const currentTop = element.querySelector('.current-top');
        initialDigits[id] = currentTop.textContent;
    }
    return initialDigits;
}

// 存储当前显示的数字
let currentDigits = getInitialDigits();

// 星期数组
const weekdays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

// 农历转换函数（简化版）
function getLunarDate(date) {
    // 简化的农历转换，实际应用中可以使用更完整的农历库
    const lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
    const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
    
    // 简化的农历计算，实际应用中需要更复杂的算法
    // 这里使用一个简单的映射，根据公历日期计算农历日期
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    // 计算农历月份（简化版）
    let lunarMonth = month;
    if (month < 2) {
        lunarMonth = month + 12;
    }
    
    // 计算农历日（简化版）
    let lunarDay = day - 1;
    if (lunarDay < 0) {
        lunarDay = 29;
    }
    
    return `${lunarMonths[lunarMonth % 12]}${lunarDays[lunarDay % 30]}`;
}

// 更新单个数字的函数
function updateDigit(elementId, newDigit) {
    // 如果数字没有变化，不执行动画
    if (currentDigits[elementId] === newDigit) {
        return;
    }
    
    const digitElement = digitElements[elementId];
    const currentTop = digitElement.querySelector('.current-top');
    const nextTop = digitElement.querySelector('.next-top');
    const currentBottom = digitElement.querySelector('.current-bottom');
    const nextBottom = digitElement.querySelector('.next-bottom');
    
    // 设置下一个数字
    nextTop.textContent = newDigit;
    nextBottom.textContent = newDigit;
    
    // 触发翻页动画
    const digitTop = digitElement.querySelector('.digit-top');
    const digitBottom = digitElement.querySelector('.digit-bottom');
    
    // 添加动画类
    digitTop.classList.add('flip-top');
    digitBottom.classList.add('flip-bottom');
    
    // 动画结束后更新当前数字并移除动画类
    setTimeout(() => {
        // 更新当前数字
        currentTop.textContent = newDigit;
        currentBottom.textContent = newDigit;
        
        // 移除动画类
        digitTop.classList.remove('flip-top');
        digitBottom.classList.remove('flip-bottom');
        
        // 重置下一个数字的位置和透明度，为下一次翻页做准备
        nextTop.style.transform = 'translateY(-50%)';
        nextTop.style.opacity = '0';
        nextBottom.style.transform = 'translateY(50%)';
        nextBottom.style.opacity = '0';
        
        // 更新当前数字存储
        currentDigits[elementId] = newDigit;
    }, 600); // 动画持续时间
}

// 存储当前日期，用于优化新年天数计算
let currentDate = null;
let daysUntilNewYear = null;

// 更新时间函数
function updateTime() {
    // 获取当前时间
    const now = new Date();
    
    // 更新日期（只在日期变化时更新）
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const weekday = weekdays[now.getDay()];
    const lunarDate = getLunarDate(now);
    const today = `${month}.${day}`;
    
    // 只在日期变化时计算距离新年的天数
    if (today !== currentDate) {
        currentDate = today;
        const currentYear = now.getFullYear();
        const newYear = new Date(currentYear + 1, 0, 1); // 下一年1月1日
        const timeDiff = newYear - now;
        daysUntilNewYear = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        
        // 更新日期文本
        dateText.textContent = `${month}.${day} ${weekday} | ${lunarDate} | 距离新年还有 ${daysUntilNewYear} 天`;
    }
    
    // 更新时间
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // 更新各个数字位
    updateDigit('hour-tens', hours[0]);
    updateDigit('hour-ones', hours[1]);
    updateDigit('min-tens', minutes[0]);
    updateDigit('min-ones', minutes[1]);
    updateDigit('sec-tens', seconds[0]);
    updateDigit('sec-ones', seconds[1]);
}

// 初始化时间
updateTime();

// 使用requestAnimationFrame替代setInterval，提高性能
let lastUpdateTime = 0;
function updateTimeWithRAF(timestamp) {
    // 计算时间差，确保每秒只更新一次
    if (timestamp - lastUpdateTime >= 1000) {
        updateTime();
        lastUpdateTime = timestamp;
    }
    requestAnimationFrame(updateTimeWithRAF);
}

// 启动requestAnimationFrame循环
requestAnimationFrame(updateTimeWithRAF);

// 缓存常用DOM元素
const dateElement = document.querySelector('.date');
const labelElements = document.querySelectorAll('.label');
const digitElementsAll = document.querySelectorAll('.digit');
const digitTopElements = document.querySelectorAll('.digit-top');
const digitBottomElements = document.querySelectorAll('.digit-bottom');
const digitTextElements = document.querySelectorAll('.current-top, .next-top, .current-bottom, .next-bottom');
const colorOptionElements = document.querySelectorAll('.color-option');

// 配色方案定义
const colorSchemes = {
    dark: {
        backgroundColor: '#1a1a1a',
        textColor: 'white',
        digitColor: '#333',
        digitTopColor: '#3a3a3a',
        digitBottomColor: '#444',
        labelColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)'
    },
    red: {
        backgroundColor: '#1a1a1a',
        textColor: 'white',
        digitColor: '#ef4444',
        digitTopColor: '#dc2626',
        digitBottomColor: '#b91c1c',
        labelColor: 'white',
        borderColor: 'rgba(239, 68, 68, 0.3)'
    }
};

// 切换配色函数
function switchColorScheme(schemeName) {
    const scheme = colorSchemes[schemeName];
    if (!scheme) return;
    
    // 更新CSS变量
    document.documentElement.style.setProperty('--background-color', scheme.backgroundColor);
    document.documentElement.style.setProperty('--text-color', scheme.textColor);
    document.documentElement.style.setProperty('--digit-color', scheme.digitColor);
    document.documentElement.style.setProperty('--digit-top-color', scheme.digitTopColor);
    document.documentElement.style.setProperty('--digit-bottom-color', scheme.digitBottomColor);
    document.documentElement.style.setProperty('--label-color', scheme.labelColor);
    document.documentElement.style.setProperty('--border-color', scheme.borderColor);
    
    // 更新配色选项的激活状态
    colorOptionElements.forEach(option => {
        option.classList.remove('active');
    });
    document.querySelector(`[data-color="${schemeName}"]`).classList.add('active');
}

// 初始化配色选择器
function initColorPicker() {
    // 为配色选项添加点击事件监听器
    colorOptionElements.forEach(option => {
        option.addEventListener('click', () => {
            const color = option.dataset.color;
            switchColorScheme(color);
        });
    });
    
    // 设置初始激活状态
    document.querySelector('[data-color="dark"]').classList.add('active');
}

// 初始化配色选择器
initColorPicker();

// 粒子系统实现
class Particle {
    constructor(canvas, particleSystem) {
        this.canvas = canvas;
        this.particleSystem = particleSystem;
        this.reset();
    }
    
    reset() {
        // 随机位置
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        
        // 随机大小（星空效果：更小的粒子）
        this.size = Math.random() * 1.5 + 0.5;
        
        // 随机速度（星空效果：更慢的移动）
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        
        // 随机透明度（星空效果：更暗的粒子）
        this.baseOpacity = Math.random() * 0.4 + 0.1;
        this.opacity = this.baseOpacity;
        
        // 闪烁效果参数
        this.flickerSpeed = Math.random() * 0.02 + 0.01;
        this.flickerOffset = Math.random() * Math.PI * 2;
        
        // 根据当前配色方案设置颜色
        this.updateColor();
        
        // 鼠标吸引范围（星空效果：更大的范围，更柔和的效果）
        this.attractionRadius = 250;
        // 鼠标吸引力强度（星空效果：更弱的吸引力）
        this.attractionStrength = 0.08;
    }
    
    updateColor() {
        // 使用当前文本颜色作为粒子颜色
        this.color = document.body.style.color || 'white';
    }
    
    update() {
        // 闪烁效果（星空效果：模拟星星闪烁）
        this.flickerOffset += this.flickerSpeed;
        this.opacity = this.baseOpacity * (0.7 + Math.sin(this.flickerOffset) * 0.3);
        
        // 鼠标吸引效果（星空效果：更柔和的扰动）
        const mouse = this.particleSystem.mouse;
        if (mouse.x && mouse.y) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distanceSquared = dx * dx + dy * dy;
            
            // 使用距离平方比较，避免开方运算，提高性能
            const attractionRadiusSquared = this.attractionRadius * this.attractionRadius;
            if (distanceSquared < attractionRadiusSquared && distanceSquared > 0) {
                // 计算吸引力（星空效果：更柔和的吸引力曲线）
                const distance = Math.sqrt(distanceSquared);
                const force = Math.pow((this.attractionRadius - distance) / this.attractionRadius, 2);
                const attractionX = (dx / distance) * force * this.attractionStrength;
                const attractionY = (dy / distance) * force * this.attractionStrength;
                
                // 应用吸引力
                this.speedX += attractionX;
                this.speedY += attractionY;
            }
        }
        
        // 移动粒子
        this.x += this.speedX;
        this.y += this.speedY;
        
        // 边界检测
        if (this.x < 0) {
            this.x = 0;
            this.speedX *= -1;
        } else if (this.x > this.canvas.width) {
            this.x = this.canvas.width;
            this.speedX *= -1;
        }
        
        if (this.y < 0) {
            this.y = 0;
            this.speedY *= -1;
        } else if (this.y > this.canvas.height) {
            this.y = this.canvas.height;
            this.speedY *= -1;
        }
        
        // 缓慢重置粒子（星空效果：更少的重置，更稳定的星空）
        if (Math.random() < 0.0003) {
            this.reset();
        }
        
        // 限制粒子速度（星空效果：更慢的最大速度）
        const maxSpeed = 2;
        const speedSquared = this.speedX * this.speedX + this.speedY * this.speedY;
        const maxSpeedSquared = maxSpeed * maxSpeed;
        
        // 使用速度平方比较，避免开方运算，提高性能
        if (speedSquared > maxSpeedSquared) {
            const speed = Math.sqrt(speedSquared);
            this.speedX = (this.speedX / speed) * maxSpeed;
            this.speedY = (this.speedY / speed) * maxSpeed;
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.numParticles = 100; // 减少粒子数量，提高性能
        
        // 鼠标位置跟踪
        this.mouse = {
            x: null,
            y: null
        };
        
        this.init();
        this.animate();
        this.setupEventListeners();
    }
    
    init() {
        // 设置canvas大小
        this.resizeCanvas();
        
        // 创建粒子
        for (let i = 0; i < this.numParticles; i++) {
            this.particles.push(new Particle(this.canvas, this));
        }
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    setupEventListeners() {
        // 响应窗口大小变化
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
        
        // 监听配色方案变化
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('color-option')) {
                // 延迟更新粒子颜色，确保配色方案已应用
                setTimeout(() => {
                    this.particles.forEach(particle => {
                        particle.updateColor();
                    });
                }, 100);
            }
        });
        
        // 监听鼠标移动
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    
    animate() {
        // 清除画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 更新和绘制粒子
        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });
        
        // 循环动画
        requestAnimationFrame(() => this.animate());
    }
}

// 初始化粒子系统
const particleSystem = new ParticleSystem('particles-canvas');

// 全屏功能实现
const fullscreenBtn = document.getElementById('fullscreen-btn');

// 全屏切换函数
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        // 进入全屏
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
    } else {
        // 退出全屏
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

// 监听全屏按钮点击事件
fullscreenBtn.addEventListener('click', toggleFullscreen);