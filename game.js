console.log("Game script loaded");

// 声明所有全局变量
let character, gameContainer, scoreDisplay, startButton, instructionDisplay;
let gameOverScreen, finalScoreDisplay, restartButton, pauseMessage;
let isJumping = false;
let isDoubleJumping = false;
let score = 0;
let obstacleSpeed = 5;
let isInvincible = false;
let characterPosition = 0;
const characterSpeed = 20; // 提升玩家速度
let gameWidth = window.innerWidth;
let gameHeight = window.innerHeight;
const characterWidth = 120;
const characterHeight = 120;
const obstacleWidth = 100;
const obstacleHeight = 100;
let isMovingLeft = false;
let isMovingRight = false;
let isPaused = false;
let jumpInterval = null;
let obstacles = [];
let obstacleGenerationProbability = 0.01;
let invincibilityTimer;
let clouds = [];
const cloudSpeed = 1;
const cloudGenerationProbability = 0.02;
let cloudTimer = null;
const cloudDisappearTime = 5000;
let cloudCycleTimer = null;
const cloudCycleTime = 30000;
let cloudsVisible = true;
let cloudWarningMessage = null;
let cloudWarningTimer = null;
const cloudWarningTime = 10000;
let animationFrameId = null;
let currentLanguage = 'en';
const translations = {
    en: {
        startGame: 'Start Game',
        gameOver: 'Game Over',
        finalScore: 'Final Score',
        restart: 'Restart',
        score: 'Score',
        instruction: 'Press Space to jump (double jump available), A to move left, D to move right, P to pause/resume. Avoid tree stumps!',
        paused: 'Game Paused. Press P to continue.',
        selectLanguage: 'Select Language',
        cloudWarning: 'Clouds will disappear soon. Get ready!',
        loading: 'Made By Feynman',
        restartHint: 'Press R to refresh the page',
        flyUnlocked: 'Flight ability unlocked! You can use it once.',
        invincibilityGained: '5 seconds invincibility gained!',
        flyingStarted: 'Flying mode activated! 20 seconds remaining.',
        flyingEnded: 'Flying mode ended.',
        flyingReady: 'Flying ability is ready again!',
        longInvincibilityGained: '10 seconds invincibility gained!',
        obstaclesSlowed: 'Obstacles slowed down for 10 seconds!',
        flightUsed: 'Flight ability already used!',
        obstaclesNormal: 'Obstacle speed back to normal.',
        flightUnavailable: 'Flight ability is not available.'
    },
    zh: {
        startGame: '开始游戏',
        gameOver: '游戏结束',
        finalScore: '最终得分',
        restart: '重新开始',
        score: '得分',
        instruction: '按空格键跳跃（可二段跳），A键向左移动，D键向右移动，P键暂停/继续游戏。避开树桩！',
        paused: '游戏已暂停。按 P 键继续。',
        selectLanguage: '选择语言',
        cloudWarning: '云即将消失，请做好准备！',
        loading: '来自Feynman',
        restartHint: '按 R 键刷新页面',
        flyUnlocked: '飞行能力已解锁！你可以使用一次。',
        invincibilityGained: '获得5秒无敌时间！',
        flyingStarted: '飞行模式已激活！剩余20秒。',
        flyingEnded: '飞行模式已结束。',
        flyingReady: '飞行能力已经准备就绪！',
        longInvincibilityGained: '获得10秒无敌时间！',
        obstaclesSlowed: '障碍物减速10秒！',
        flightUsed: '飞行能力已经使用过了！',
        obstaclesNormal: '障碍物速度恢复正常。',
        flightUnavailable: '飞行能力不可用。'
    }
};

// 添加一个新的变量来跟踪游戏是否已经开始
let gameStarted = false;

// 在全局变量部分添加以下变量
let gameStartTime;
let currentObstacleSpeed = 4; // 提高初始速度
let currentObstacleGenerationProbability = 0.005; // 降低初始生成概率
let canFly = false;
let loadingScreen;
let isFlying = false;
let flyingTimer = null;
let flyingTimeLeft = 20000; // 20秒，单位毫秒
let isSpacePressed = false;
let isShiftPressed = false;
let hasUsedFlight = false;

// 在全局变量部分添加飞行速度变量
const flyingUpSpeed = 15;
const flyingDownSpeed = 12;
let flyingVelocity = 0;
const flyingAcceleration = 0.5;
const maxFlyingSpeed = 20;

// 主函数
function main() {
    document.addEventListener('DOMContentLoaded', () => {
        loadingScreen = document.getElementById('loading-screen');
        showLoadingScreen();
        initializeDOMElements();
        document.getElementById('game-container').style.display = 'none';
        document.getElementById('language-selection').style.display = 'none';
        document.getElementById('en-btn').addEventListener('click', () => selectLanguage('en'));
        document.getElementById('zh-btn').addEventListener('click', () => selectLanguage('zh'));
        
        // 模拟加载过程
        setTimeout(() => {
            hideLoadingScreen();
            document.getElementById('language-selection').style.display = 'flex';
        }, 3000); // 3秒后隐藏加载画面
    });
    window.addEventListener('resize', resizeGame);
}


// DOM元素初始化
function initializeDOMElements() {
    character = document.getElementById('character');
    gameContainer = document.getElementById('game-container');
    scoreDisplay = document.getElementById('score');
    startButton = document.getElementById('start-button');
    instructionDisplay = document.getElementById('instruction');
    gameOverScreen = document.getElementById('game-over-screen');
    finalScoreDisplay = document.getElementById('final-score');
    restartButton = document.getElementById('restart-button');

    pauseMessage = document.getElementById('pause-message');
    if (!pauseMessage) {
        createPauseMessage();
    }

    addEventListeners();
    initializeGame();
}


// 创建暂停消息元素
function createPauseMessage() {
    pauseMessage = document.createElement('div');
    pauseMessage.id = 'pause-message';
    pauseMessage.style.position = 'absolute';
    pauseMessage.style.top = '50%';
    pauseMessage.style.left = '50%';
    pauseMessage.style.transform = 'translate(-50%, -50%)';
    pauseMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    pauseMessage.style.color = 'white';
    pauseMessage.style.padding = '20px';
    pauseMessage.style.borderRadius = '10px';
    pauseMessage.style.display = 'none';
    pauseMessage.style.zIndex = '1000';
    gameContainer.appendChild(pauseMessage);
}


// 添加事件监听器
function addEventListeners() {
    if (startButton) {
        startButton.addEventListener('click', startGame);
    }
    if (restartButton) {
        restartButton.addEventListener('click', restartGame);
    }
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}


// 初始化游戏状态
function initializeGame() {
    // 重置游戏分数
    score = 0;
    updateScore(); // 只更新显示，不增加分数
    // 初始化障碍物速度
    obstacleSpeed = 5;
    // 重置角色位置
    characterPosition = 0;
    character.style.left = '0px';
    character.style.bottom = '0px';
    
    // 更新分数显示
    updateScore();
    
    // 重置无敌状态
    isInvincible = false;
    character.classList.remove('invincible');
    
    // 重置游戏暂停状态
    isPaused = false;
    if (pauseMessage) {
        pauseMessage.style.display = 'none';
    }
    
    // 显示开始按钮和说明
    startButton.style.display = 'block';
    instructionDisplay.style.display = 'block';

    // 清除所有障碍物和云朵
    clearObstaclesAndClouds();

    console.log('初始化完成，障碍物数量：', obstacles.length, '云朵数量：', clouds.length);

    // 设置云朵可见
    cloudsVisible = true;

    // 移除云朵警告消息
    if (cloudWarningMessage) {
        document.body.removeChild(cloudWarningMessage);
        cloudWarningMessage = null;
    }

    // 清除云朵警告计时器
    if (cloudWarningTimer) {
        clearInterval(cloudWarningTimer);
        cloudWarningTimer = null;
    }

    // 隐藏游戏结束屏幕
    gameOverScreen.style.display = 'none';

    // 初始化游戏难度
    obstacleGenerationProbability = 0.01;
    obstacleSpeed = 5;

    // 重置速度相关变量
    // obstacleSpeed = 5;
    // cloudSpeed = 1;
    // characterSpeed = 10;

    // ... 其他初始化代码 ...
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    updateUIText();

    // 更新指令显示
    instructionDisplay.textContent = translations[currentLanguage].instruction;

    // 完全重置飞行相关的状态
    canFly = false;
    hasUsedFlight = false;
    isFlying = false;
    if (flyingTimer) {
        clearInterval(flyingTimer);
        flyingTimer = null;
    }
    flyingTimeLeft = 20000;
    isSpacePressed = false;
    isShiftPressed = false;
    character.classList.remove('flying', 'can-fly');
    character.style.bottom = '0px';
}


// 清除所有障碍物和云朵
function clearObstaclesAndClouds() {
    obstacles.forEach(obstacle => {
        if (obstacle.element && obstacle.element.parentNode) {
            obstacle.element.parentNode.removeChild(obstacle.element);
        }
    });
    obstacles = [];

    const staticObstacle = document.getElementById('obstacle');
    if (staticObstacle) {
        staticObstacle.parentNode.removeChild(staticObstacle);
    }

    clouds.forEach(cloud => {
        if (cloud.element && cloud.element.parentNode) {
            cloud.element.parentNode.removeChild(cloud.element);
        }
    });
    clouds = [];
}

// 开始游戏
function startGame() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    initializeGame();
    startButton.style.display = 'none';
    instructionDisplay.style.display = 'none';
    
    character.style.bottom = '0px';
    characterPosition = 0;
    character.style.left = '0px';
    
    obstacles.push(createObstacle());
    
    setInvincibility(7000);

    startCloudCycle();

    isPaused = false;
    if (pauseMessage) {
        pauseMessage.style.display = 'none';
    }
    gameContainer.classList.remove('paused');
    
    animationFrameId = requestAnimationFrame(gameLoop);
    updateUIText();
    gameStarted = true;
    gameStartTime = Date.now();

    // 确保游戏开始时分数为0
    score = 0;
    updateScore();

    // 在 startGame 函数中重置难度
    currentObstacleSpeed = 4;
    currentObstacleGenerationProbability = 0.005;
}


// 重新开始游戏
function restartGame() {
    // 取消所有正在进行的动画和计时器
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    clearTimeout(invincibilityTimer);
    clearInterval(cloudCycleTimer);
    if (cloudWarningTimer) {
        clearInterval(cloudWarningTimer);
    }

    // 重置游戏状态
    initializeGame();
    startGame();
    updateUIText();
    console.log('游戏已重新开始');
}

// 游戏主循环
function gameLoop(timestamp) {
    if (!isPaused) {
        moveCharacter();
        moveObstacles();
        moveClouds();
        checkCollisions();
        increaseDifficulty(); // 新增：根据时间增加难度
    }
    animationFrameId = requestAnimationFrame(gameLoop);
}


// 创建云朵
function createCloud() {
    // 创建云朵图像元素
    const cloud = document.createElement('img');
    cloud.src = 'assets/cloud.svg';
    cloud.className = 'cloud';
    
    // 随机设置云朵大小
    const size = Math.random() * 100 + 100;
    cloud.style.width = `${size}px`;
    cloud.style.height = 'auto';
    
    // 随机设置云朵垂直位置
    const minBottomPosition = gameHeight * 0.3;  // 调整这个值以改变云朵的最低高度
    const maxBottomPosition = gameHeight * 0.7;  // 调整这个值以改变云朵的最高高度
    const bottomPosition = Math.random() * (maxBottomPosition - minBottomPosition) + minBottomPosition;
    cloud.style.bottom = `${bottomPosition}px`;
    
    // 设置云朵初始水平位置
    cloud.style.left = `${gameWidth}px`;
    
    cloud.style.opacity = '1';
    gameContainer.appendChild(cloud);
    
    // 记录云朵创建信息
    console.log(`创建新云朵，位置：bottom ${bottomPosition}px, left ${gameWidth}px, 大小：${size}px`);
    
    // 返回云朵对象
    return {
        element: cloud,
        speed: Math.random() * 0.5 + 0.5,
        position: gameWidth,
        bottomPosition: bottomPosition,
        isBlinking: false,
        disappearTimer: null
    };
}

// 移动云朵
function moveClouds() {
    // 随机生成新云朵
    if (Math.random() < cloudGenerationProbability && clouds.length < 5) {
        clouds.push(createCloud());
    }

    // 移动每朵云
    for (let i = clouds.length - 1; i >= 0; i--) {
        const cloud = clouds[i];
        cloud.position -= cloud.speed;
        cloud.element.style.left = `${cloud.position}px`;

        // 如果云朵移出屏幕，则删除它
        if (cloud.position + parseInt(cloud.element.style.width) < 0) {
            gameContainer.removeChild(cloud.element);
            clouds.splice(i, 1);
        }
    }
}


// 检查云朵碰撞
function checkCloudCollisions() {
    const characterRect = character.getBoundingClientRect();
    const characterBottom = characterRect.bottom;

    for (let cloud of clouds) {
        const cloudRect = cloud.element.getBoundingClientRect();
        if (characterRect.right > cloudRect.left &&
            characterRect.left < cloudRect.right &&
            Math.abs(characterBottom - cloudRect.top) < 10 &&
            characterRect.bottom <= cloudRect.top + 10) {
            return cloud;
        }
    }
    return null;
}

// 开始云朵周期
function startCloudCycle() {
    cloudCycleTimer = setInterval(() => {
        if (cloudsVisible) {
            showGlobalCloudWarning();
            setTimeout(() => {
                toggleClouds();
            }, cloudWarningTime);
        } else {
            toggleClouds();
        }
    }, cloudCycleTime);
}

// 切换云朵可见性
function toggleClouds() {
    cloudsVisible = !cloudsVisible;
    clouds.forEach(cloud => {
        cloud.element.style.display = cloudsVisible ? 'block' : 'none';
    });
    if (cloudsVisible) {
        hideCloudWarning();
    }
}

// 显示全局云朵警告
function showGlobalCloudWarning() {
    if (!cloudWarningMessage) {
        cloudWarningMessage = document.createElement('div');
        cloudWarningMessage.id = 'cloud-warning';
        cloudWarningMessage.style.position = 'absolute';
        cloudWarningMessage.style.top = '50px';
        cloudWarningMessage.style.left = '50%';
        cloudWarningMessage.style.transform = 'translateX(-50%)';
        cloudWarningMessage.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
        cloudWarningMessage.style.color = 'white';
        cloudWarningMessage.style.padding = '10px';
        cloudWarningMessage.style.borderRadius = '5px';
        cloudWarningMessage.style.zIndex = '1000';
        document.body.appendChild(cloudWarningMessage);
    }
    
    let remainingTime = cloudWarningTime / 1000;
    updateWarningMessage(remainingTime);
    cloudWarningMessage.style.display = 'block';

    if (cloudWarningTimer) {
        clearInterval(cloudWarningTimer);
    }

    cloudWarningTimer = setInterval(() => {
        remainingTime--;
        if (remainingTime > 0) {
            updateWarningMessage(remainingTime);
        } else {
            hideCloudWarning();
        }
    }, 1000);
}

// 更新警告消息
function updateWarningMessage(remainingTime) {
    cloudWarningMessage.textContent = `${translations[currentLanguage].cloudWarning} ${remainingTime}`;
}


// 隐藏云朵警告
function hideCloudWarning() {
    if (cloudWarningMessage) {
        cloudWarningMessage.style.display = 'none';
    }
    if (cloudWarningTimer) {
        clearInterval(cloudWarningTimer);
        cloudWarningTimer = null;
    }
}

// 开始云朵虚化效果
function startCloudFade(cloud) {
    let opacity = 1;
    const fadeStep = 1 / (cloudDisappearTime / 20);
    
    cloud.fadeInterval = setInterval(() => {
        opacity -= fadeStep;
        if (opacity > 0) {
            cloud.element.style.opacity = opacity.toString();
        } else {
            clearInterval(cloud.fadeInterval);
            cloud.element.style.opacity = '0';
        }
    }, 20);
}

// 移除云朵
function removeCloud(cloud) {
    if (cloud.disappearTimer) {
        clearTimeout(cloud.disappearTimer);
        cloud.disappearTimer = null;
    }
    if (cloud.fadeInterval) {
        clearInterval(cloud.fadeInterval);
    }
    
    const index = clouds.indexOf(cloud);
    if (index > -1) {
        clouds.splice(index, 1);
        gameContainer.removeChild(cloud.element);
    }
}

// 修改 moveCharacter 函数中的飞行逻辑
function moveCharacter() {
    if (isMovingLeft && characterPosition > 0) {
        characterPosition = Math.max(0, characterPosition - characterSpeed);
    }
    if (isMovingRight && characterPosition < gameWidth - characterWidth) {
        characterPosition = Math.min(gameWidth - characterWidth, characterPosition + characterSpeed);
    }
    character.style.left = `${characterPosition}px`;

    if (isFlying) {
        let currentBottom = parseInt(character.style.bottom) || 0;
        if (isSpacePressed) {
            flyingVelocity = Math.min(flyingVelocity + flyingAcceleration, maxFlyingSpeed);
        } else if (isShiftPressed) {
            flyingVelocity = Math.max(flyingVelocity - flyingAcceleration, -maxFlyingSpeed);
        } else {
            flyingVelocity *= 0.95; // 缓慢减速
        }
        currentBottom = Math.max(0, Math.min(gameHeight - characterHeight, currentBottom + flyingVelocity));
        character.style.bottom = `${currentBottom}px`;
    } else {
        flyingVelocity = 0;
        const cloudUnder = checkCloudCollisions();
        if (cloudUnder && !isJumping && cloudsVisible) {
            const cloudTop = cloudUnder.element.getBoundingClientRect().top;
            const newBottom = gameHeight - cloudTop;
            character.style.bottom = `${newBottom}px`;
            
            if (!cloudUnder.disappearTimer) {
                cloudUnder.disappearTimer = setTimeout(() => {
                    removeCloud(cloudUnder);
                }, cloudDisappearTime);
                
                startCloudFade(cloudUnder);
            }
        } else {
            clouds.forEach(cloud => {
                if (cloud.disappearTimer) {
                    clearTimeout(cloud.disappearTimer);
                    cloud.disappearTimer = null;
                }
                cloud.element.style.opacity = '1';
                clearInterval(cloud.fadeInterval);
            });
            
            if (!isJumping && !isDoubleJumping) {
                const currentBottom = parseInt(character.style.bottom) || 0;
                if (currentBottom > 0) {
                    character.style.bottom = `${Math.max(0, currentBottom - 5)}px`;
                } else {
                    character.style.bottom = '0px';
                }
            }
        }
    }
}

// 处理键盘按下事件
function handleKeyDown(event) {
    if (event.code === 'KeyP') {
        togglePause();
        return;
    }
    
    if (event.code === 'KeyL') {
        showLanguageSelection();
        return;
    }
    
    if (event.code === 'KeyR') {
        location.reload(); // 刷新整个页面
        return;
    }
    
    if (!isPaused) {
        switch(event.code) {
            case 'Space':
                if (isFlying) {
                    isSpacePressed = true;
                } else {
                    jump();
                }
                event.preventDefault();
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                if (isFlying) {
                    isShiftPressed = true;
                }
                break;
            case 'KeyA':
            case 'ArrowLeft':
                isMovingLeft = true;
                break;
            case 'KeyD':
            case 'ArrowRight':
                isMovingRight = true;
                break;
            case 'KeyW':
            case 'ArrowUp':
                if (canFly) {
                    jump(); // 使用跳跃函数来实现飞行
                }
                break;
        }
    }
}

// 处理键盘释放事件
function handleKeyUp(event) {
    if (!isPaused) {
        switch(event.code) {
            case 'Space':
                isSpacePressed = false;
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                isShiftPressed = false;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                isMovingLeft = false;
                break;
            case 'KeyD':
            case 'ArrowRight':
                isMovingRight = false;
                break;
        }
    }
}

// 跳跃
function jump() {
    if (cloudTimer) {
        clearTimeout(cloudTimer);
        cloudTimer = null;
    }

    if (canFly && !isFlying) {
        startFlying();
    } else if (!isJumping) {
        isJumping = true;
        const jumpHeight = gameHeight / 3;
        performJump(jumpHeight);
    } else if (!isDoubleJumping) {
        isDoubleJumping = true;
        clearInterval(jumpInterval);
        performJump(gameHeight / 4);
    }
}

// 添加 startFlying 函数
function startFlying() {
    if (!canFly || hasUsedFlight || isFlying) {
        showMessage(translations[currentLanguage].flightUnavailable);
        return;
    }
    isFlying = true;
    hasUsedFlight = true;
    flyingTimeLeft = 20000;
    character.classList.add('flying');

    flyingTimer = setInterval(() => {
        flyingTimeLeft -= 100;
        if (flyingTimeLeft <= 0) {
            stopFlying();
        }
    }, 100);
}

// 添加 stopFlying 函数
function stopFlying() {
    isFlying = false;
    canFly = false;
    if (flyingTimer) {
        clearInterval(flyingTimer);
        flyingTimer = null;
    }
    character.classList.remove('flying');
    character.style.bottom = '0px';  // 确保角色回到地面
    
    // 只有在游戏没有结束的情况下才显示消息
    if (!isPaused) {
        showMessage(translations[currentLanguage].flyingEnded);
    }
}

// 执行跳跃
function performJump(height) {
    let startHeight = parseInt(character.style.bottom) || 0;
    let jumpHeight = startHeight;
    let peakHeight = startHeight + height;
    let isAscending = true;
    let jumpSpeed = height / 15;

    clearInterval(jumpInterval);
    jumpInterval = setInterval(() => {
        if (isAscending) {
            if (jumpHeight < peakHeight) {
                jumpHeight += jumpSpeed;
                character.style.bottom = `${jumpHeight}px`;
            } else {
                isAscending = false;
            }
        } else {
            if (jumpHeight > 0) {
                jumpHeight -= jumpSpeed;
                character.style.bottom = `${jumpHeight}px`;
                const cloudUnder = checkCloudCollisions();
                if (cloudUnder) {
                    clearInterval(jumpInterval);
                    const cloudTop = cloudUnder.element.getBoundingClientRect().top;
                    character.style.bottom = `${gameHeight - cloudTop}px`;
                    isJumping = false;
                    isDoubleJumping = false;
                    return;
                }
            } else {
                clearInterval(jumpInterval);
                character.style.bottom = '0px';
                isJumping = false;
                isDoubleJumping = false;
            }
        }
        checkCollisions();
    }, 20);
}


// 创建障碍物
function createObstacle() {
    const obstacle = document.createElement('img');
    obstacle.src = 'assets/tree.svg';
    obstacle.className = 'obstacle';
    obstacle.style.position = 'absolute';
    obstacle.style.right = `-${obstacleWidth}px`;
    obstacle.style.bottom = '-5px';
    obstacle.style.width = `${obstacleWidth}px`;
    obstacle.style.height = 'auto';
    obstacle.style.background = 'transparent';
    obstacle.style.backgroundColor = 'transparent';
    obstacle.style.border = 'none';
    
    gameContainer.appendChild(obstacle);
    
    console.log('创建新障碍物，位置：', gameWidth + obstacleWidth);
    return {
        element: obstacle,
        position: gameWidth + obstacleWidth
    };
}

// 修改 moveObstacles 函数
function moveObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        obstacle.position -= currentObstacleSpeed;
        
        if (isNaN(obstacle.position)) {
            console.error(`障碍物 ${i} 的位置是 NaN`);
            obstacle.position = gameWidth + obstacleWidth;
        }
        
        obstacle.element.style.right = `${gameWidth - obstacle.position}px`;

        if (obstacle.position + obstacleWidth < 0) {
            gameContainer.removeChild(obstacle.element);
            obstacles.splice(i, 1);
            increaseScore(); // 使用新的 increaseScore 函数
        }
    }

    if (Math.random() < currentObstacleGenerationProbability) {
        obstacles.push(createObstacle());
    }

    checkCollisions();
}

// 检查碰撞
function checkCollisions() {
    if (isInvincible) {
        return;
    }

    const characterRect = character.getBoundingClientRect();
    const characterLeft = characterRect.left + characterRect.width * 0.2;
    const characterRight = characterRect.right - characterRect.width * 0.2;
    const characterTop = characterRect.top + characterRect.height * 0.1;
    const characterBottom = characterRect.bottom - characterRect.height * 0.1;

    for (let obstacle of obstacles) {
        const obstacleRect = obstacle.element.getBoundingClientRect();
        const obstacleLeft = obstacleRect.left + obstacleRect.width * 0.1;
        const obstacleRight = obstacleRect.right - obstacleRect.width * 0.1;
        const obstacleTop = obstacleRect.top + obstacleRect.height * 0.1;
        const obstacleBottom = obstacleRect.bottom - obstacleRect.height * 0.1;

        if (characterRight > obstacleLeft &&
            characterLeft < obstacleRight &&
            characterBottom > obstacleTop &&
            characterTop < obstacleBottom) {
            console.log('碰撞检测：游戏结束');
            endGame();
            return;
        }
    }
}

// 新增 increaseDifficulty 函数
function increaseDifficulty() {
    const elapsedTime = (Date.now() - gameStartTime) / 1000; // 游戏已进行的秒数
    
    // 每30秒增加一次难度，而不是45秒
    if (elapsedTime % 30 < 0.017) { // 0.017是一帧的大约时间，确保只在一帧内执行一次
        currentObstacleSpeed = Math.min(12, currentObstacleSpeed + 0.75); // 最大速度12，每次增加0.75
        currentObstacleGenerationProbability = Math.min(0.03, currentObstacleGenerationProbability + 0.002); // 保持生成概率不变
        console.log(`难度提升：速度 ${currentObstacleSpeed}, 生成概率 ${currentObstacleGenerationProbability}`);
    }
}


// 结束游戏
function endGame() {
    isPaused = true;
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    clearTimeout(invincibilityTimer);
    clearInterval(cloudCycleTimer);
    isInvincible = false;
    character.style.opacity = '1';
    
    // 重置飞行状态，但不显示消息
    isFlying = false;
    canFly = false;
    hasUsedFlight = false;
    if (flyingTimer) {
        clearInterval(flyingTimer);
        flyingTimer = null;
    }
    character.classList.remove('flying', 'can-fly');
    character.style.bottom = '0px';
    
    console.log('游戏结束');
    console.log(`最终得分: ${score}`);
    console.log(`角色最终位置: ${characterPosition}, 底部: ${character.style.bottom}`);
    console.log(`障碍物数量: ${obstacles.length}, 云朵数量: ${clouds.length}`);
    
    finalScoreDisplay.textContent = `${translations[currentLanguage].finalScore}: ${score}`;
    gameOverScreen.style.display = 'flex';

    if (cloudWarningTimer) {
        clearInterval(cloudWarningTimer);
        cloudWarningTimer = null;
    }
}

// 切换暂停状态
function togglePause() {
    isPaused = !isPaused;
    if (pauseMessage) {
        if (isPaused) {
            pauseMessage.textContent = translations[currentLanguage].paused;
            pauseMessage.style.display = 'block';
            gameContainer.classList.add('paused');
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        } else {
            pauseMessage.style.display = 'none';
            gameContainer.classList.remove('paused');
            if (!animationFrameId) {
                gameLoop();
            }
            // 给予玩家1秒的无敌时间
            setInvincibility(1000);
        }
    }
    console.log(`游戏${isPaused ? '暂停' : '继续'}`);
}

// 设置无敌状态
function setInvincibility(duration) {
    isInvincible = true;
    character.classList.add('invincible');
    // 添加闪烁效果
    let blinkInterval = setInterval(() => {
        character.style.opacity = character.style.opacity === '1' ? '0.5' : '1';
    }, 200);

    clearTimeout(invincibilityTimer);
    invincibilityTimer = setTimeout(() => {
        isInvincible = false;
        character.classList.remove('invincible');
        character.style.opacity = '1';
        clearInterval(blinkInterval);
        console.log('无敌时间结束');
    }, duration);
    console.log(`设置无敌时间: ${duration}ms`);
}


// 调整游戏大小
function resizeGame() {
    gameWidth = window.innerWidth;
    gameHeight = window.innerHeight;
    gameContainer.style.width = gameWidth + 'px';
    gameContainer.style.height = gameHeight + 'px';
    
    console.log(`游戏区域调整为 ${gameWidth} x ${gameHeight}`);
    
    obstacles.forEach((obstacle, index) => {
        obstacle.element.style.right = `${gameWidth - obstacle.position}px`;
        console.log(`调整障碍物 ${index} 位置: ${obstacle.position}`);
    });
}

// 添加语言选择函数
function selectLanguage(lang) {
    currentLanguage = lang;
    updateLoadingText(); // 更新加载画面的文本
    document.getElementById('language-selection').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    updateUIText();
    if (!gameStarted) {
        initializeGame();
    } else {
        isPaused = false;
        gameLoop();
    }
    // 更新指令显示
    instructionDisplay.textContent = translations[currentLanguage].instruction;
    console.log(`Language selected: ${lang}`);
}

// 更新UI文本的函数
function updateUIText() {
    const elements = {
        'start-button': translations[currentLanguage].startGame,
        'game-over-text': translations[currentLanguage].gameOver,
        'final-score': `${translations[currentLanguage].finalScore}: ${score}`,
        'restart-button': translations[currentLanguage].restart,
        'instruction': translations[currentLanguage].instruction, // 恢复原来的指令
        'languageButton': translations[currentLanguage].selectLanguage
    };

    for (const [id, text] of Object.entries(elements)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        } else {
            console.warn(`Element with id '${id}' not found`);
        }
    }

    updateScore(); // 更新分数显示

    if (pauseMessage) {
        pauseMessage.textContent = translations[currentLanguage].paused;
    }
    
    console.log('UI text updated');

    // 添加重新开始的提示
    const restartHint = document.getElementById('restart-hint');
    if (restartHint) {
        restartHint.textContent = translations[currentLanguage].restartHint;
    } else {
        console.warn('Element with id "restart-hint" not found');
    }
}

// 修改 updateScore 函数
function updateScore() {
    scoreDisplay.textContent = `${translations[currentLanguage].score}: ${score}`;
    
    if (score === 20 && !hasUsedFlight && !canFly && !isFlying) {
        canFly = true;
        character.classList.add('can-fly');
        showMessage(translations[currentLanguage].flyUnlocked);
    }

    if (score === 10) {
        setInvincibility(5000);
        showMessage(translations[currentLanguage].invincibilityGained);
    }

    if (score === 40) {
        setInvincibility(10000);
        showMessage(translations[currentLanguage].longInvincibilityGained);
    }

    if (score === 60) {
        slowDownObstacles();
        showMessage(translations[currentLanguage].obstaclesSlowed);
    }
}

// 新增 increaseScore 函数
function increaseScore() {
    score++;
    updateScore();
}

// 添加一个新函数来显示临时消息
function showMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.style.position = 'absolute';
    messageElement.style.top = '50%';
    messageElement.style.left = '50%';
    messageElement.style.transform = 'translate(-50%, -50%)';
    messageElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    messageElement.style.color = 'white';
    messageElement.style.padding = '10px';
    messageElement.style.borderRadius = '5px';
    messageElement.style.zIndex = '1000';
    gameContainer.appendChild(messageElement);

    setTimeout(() => {
        gameContainer.removeChild(messageElement);
    }, 3000);
}

// 添加新的函数来显示语言选择界面
function showLanguageSelection() {
    isPaused = true;
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('language-selection').style.display = 'flex';
}

// 添加显示加载画面的函数
function showLoadingScreen() {
    loadingScreen.style.display = 'flex';
    updateLoadingText();
}

// 添加隐藏加载画面的函数
function hideLoadingScreen() {
    loadingScreen.style.display = 'none';
}

// 修改 updateLoadingText 函数
function updateLoadingText() {
    const loadingTextEn = document.getElementById('loading-text-en');
    const loadingTextZh = document.getElementById('loading-text-zh');
    
    if (currentLanguage === 'zh') {
        loadingTextEn.style.display = 'none';
        loadingTextZh.style.display = 'block';
    } else {
        loadingTextEn.style.display = 'block';
        loadingTextZh.style.display = 'none';
    }
}

// 添加 slowDownObstacles 函数
function slowDownObstacles() {
    currentObstacleSpeed *= 0.5; // 减半障碍物速度
    setTimeout(() => {
        currentObstacleSpeed *= 2; // 10秒后恢复正常速度
        showMessage(translations[currentLanguage].obstaclesNormal);
    }, 10000);
}

// 调用主函数
main();