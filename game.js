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
        flightUnavailable: 'Flight ability is not available.',
        developerModeOn: 'Developer Mode: ON',
        developerModeOff: 'Developer Mode: OFF',
        developerModeRequired: 'Developer mode must be enabled first (Ctrl + D)',
        scoreSet: 'Score set to: ',
        commandHint: 'Press / to open command input',
        version: 'Version',
        scoreAdded: 'Score increased by: ',
        commandNotFound: 'Command not found',
        commandSuccess: 'Command executed successfully',
        commandEmpty: 'Command cannot be empty',
        invalidTimeParam: 'Invalid time parameter',
        invalidEffectCommand: 'Invalid effect command, format: /effect no_die <seconds> or -1 (infinite) or clean',
        infiniteInvincibility: 'Infinite invincibility gained',
        effectsCleared: 'All effects cleared',
        divideByZero: 'Cannot divide by zero',
        scoreInfinite: 'Score set to ∞',
        selectLevel: 'Select Level',
        level1: 'Level 1',
        victory: 'Congratulations!',
        backToMenu: 'Back to Menu',
        victoryScore: 'Final Score',
        gameDescription: 'Game Introduction: Control the character to run and jump, avoid obstacles and score points. Supports English and Chinese, includes special abilities and developer mode. Pass the level at 50 points.',
        levelTarget: 'Target Score: 50',
        skinChanged: 'Skin changed to: ',
        skinNotFound: 'Skin not found: ',
        skinReset: 'Skin reset to default',
        selectSkin: 'Select Character',
        defaultSkin: 'Default',
        playerSkin: 'Parkour Boy',
        workerSkin: 'Worker',
        momSkin: 'Chef Mom',
        confirmSkin: 'Confirm'
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
        flightUnavailable: '飞行能力不可用。',
        developerModeOn: '开者模式：已开启',
        developerModeOff: '开发者模式：已关闭',
        developerModeRequired: '需要先开启开发者模式 (Ctrl + D)',
        scoreSet: '分数已设置为：',
        commandHint: '按 / 键打开指令输入',
        version: '版本',
        scoreAdded: '增加分数：',
        commandNotFound: '未找到此行命令',
        commandSuccess: '命令已生效',
        commandEmpty: '命令不能为空',
        invalidTimeParam: '无效的时间参数',
        invalidEffectCommand: '无效的效果命令，格式：/effect no_die <秒数>或-1（无限）或 clean',
        infiniteInvincibility: '已获得无限无敌时间',
        effectsCleared: '已清除所有状态效果',
        divideByZero: '除数不能为0',
        scoreInfinite: '分数已设置为 ∞',
        selectLevel: '选择关卡',
        level1: '第一关',
        victory: '恭喜通关！',
        backToMenu: '返回菜单',
        victoryScore: '最终得分',
        gameDescription: '项目简介：玩家控制角色奔跑、跳跃，躲避障碍并获得分数，支持中英文，含特殊能力和开发者模式。达到 50 分即可通关。',
        levelTarget: '通关分数：50',
        skinChanged: '已切换皮肤：',
        skinNotFound: '未找到皮肤：',
        skinReset: '已重置为默认皮肤',
        selectSkin: '选择角色',
        defaultSkin: '默认角色',
        playerSkin: '跑酷少年',
        workerSkin: '打工人',
        momSkin: '厨师妈妈',
        confirmSkin: '确认选择'
    }
};

// 添加一个新的变量来跟踪游戏是否已经开始
let gameStarted = false;

// 在全局变量部分添加以下变量
let gameStartTime;
let currentObstacleSpeed = 4; // 初始速度
let currentObstacleGenerationProbability = 0.01; // 从 0.02 改为 0.01
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

// 在全局变量部分添加
let isDeveloperMode = false;

// 在全局变量部分添加
let commandInput = null;

// 在全局变量部分添加
let lastChatMessage = null;

// 修改全局变量，将单条消息为消息数组
let chatHistory = [];

// 添加全局变量来活动的消息
let activeMessages = [];
const MESSAGE_HEIGHT = 40; // 每条消息的高度（包括间距）

// 修号，除 'Version' 前缀
const GAME_VERSION = 'v2.0';  // 只保留 'v2.0'

// 在全局变量部分添加
let lastKeyPressTime = 0;
let lastKeyPressed = '';

// 在全局变量部分添加
const SKINS = {
    default: 'assets/mario.svg',
    redball: 'assets/skin-1.svg',
    worker: 'assets/worker.svg',
    mom: 'assets/chef.svg',
    player: 'assets/player.svg'
};
let currentSkin = 'default';

// 在全局变量部分添加障碍物类型定义
const OBSTACLE_TYPES = {
    normal: {
        width: 100,
        height: 100,
        scale: 1.0
    },
    tall: {
        width: 80,
        height: 150,
        scale: 1.2
    },
    wide: {
        width: 150,
        height: 100,
        scale: 1.0
    },
    huge: {  // 添加一个新的大型障碍物
        width: 130,
        height: 130,
        scale: 1.3
    }
};

// 修改怪物相关变量
let monster = null;
const MONSTER_BASE_SPEED = 5;
const MONSTER_CHASE_SPEED = 8;
const MONSTER_WIDTH = 120;
const MONSTER_HEIGHT = 120;
const MONSTER_CHASE_DISTANCE = 300;
const MONSTER_JUMP_SPEED = 15;
const MONSTER_GRAVITY = 0.8;
let monsterVelocity = 0;
let monsterJumping = false;
let monsterDoubleJumping = false;  // 添加二段跳状态

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


// DOM素初始化
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
    createCommandInput();
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
    // 初始化障碍速度
    obstacleSpeed = 5;
    // 置
    characterPosition = 0;
    character.style.left = '0px';
    character.style.bottom = '0px';
    
    // 更新分数显示
    updateScore();
    
    // 重置无敌状态和闪烁效果
    isInvincible = false;
    character.classList.remove('invincible');
    character.style.opacity = '1';
    if (window.blinkInterval) {
        clearInterval(window.blinkInterval);
        window.blinkInterval = null;
    }
    if (invincibilityTimer) {
        clearTimeout(invincibilityTimer);
        invincibilityTimer = null;
    }
    
    // 重置游戏暂停状态
    isPaused = false;
    if (pauseMessage) {
        pauseMessage.style.display = 'none';
    }
    
    // 显示开始按钮和明
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

    // 确保使用当前选的皮肤
    const characterIcon = document.getElementById('mario-icon');
    characterIcon.src = SKINS[currentSkin];

    // 移除怪物
    removeMonster();

    // 重置跳跃相关状态
    isJumping = false;
    isDoubleJumping = false;
    if (jumpInterval) {
        clearInterval(jumpInterval);
        jumpInterval = null;
    }
    
    // 重置角色位置
    character.style.bottom = '0px';
    characterPosition = 0;
    character.style.left = '0px';
}


// 清除所有障碍物和朵
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
    
    // 重置所有状态
    initializeGame();
    
    // 重置跳跃相关状态
    isJumping = false;
    isDoubleJumping = false;
    if (jumpInterval) {
        clearInterval(jumpInterval);
        jumpInterval = null;
    }
    
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

    // 重置难度
    currentObstacleSpeed = 4;
    currentObstacleGenerationProbability = 0.01;
}


// 重新开始游戏
function restartGame() {
    // 消所有正在进行的动画和时器
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    if (jumpInterval) {
        clearInterval(jumpInterval);
        jumpInterval = null;
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
        moveMonster();  // 添加怪物移动
        checkCollisions();
        increaseDifficulty(); // 增：根据时间增加难度
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
    
    // 随机设置云朵垂直置
    const minBottomPosition = gameHeight * 0.3;  // 调整这个值以改变云朵的最低高度
    const maxBottomPosition = gameHeight * 0.7;  // 调整这个值以改变云朵的最高高
    const bottomPosition = Math.random() * (maxBottomPosition - minBottomPosition) + minBottomPosition;
    cloud.style.bottom = `${bottomPosition}px`;
    
    // 置朵初始平位置
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

        // 果云朵移出屏幕，则删除它
        if (cloud.position + parseInt(cloud.element.style.width) < 0) {
            gameContainer.removeChild(cloud.element);
            clouds.splice(i, 1);
        }
    }
}


// 检云朵碰撞
function checkCloudCollisions() {
    const characterRect = character.getBoundingClientRect();
    const characterBottom = characterRect.bottom;

    for (let cloud of clouds) {
        const cloudRect = cloud.element.getBoundingClientRect();
        if (characterRect.right > cloudRect.left &&
            characterRect.left < cloudRect.right &&
            Math.abs(characterBottom - cloudRect.top) < 10 &&
            characterRect.bottom <= cloudRect.top + 10) {
            
            // 如果云朵还没有消失计时器，添加一个
            if (!cloud.disappearTimer) {
                cloud.disappearTimer = setTimeout(() => {
                    removeCloud(cloud);
                }, cloudDisappearTime);
                
                startCloudFade(cloud);
            }
            
            return cloud;
        }
    }
    return null;
}

// 开始云朵周期
function startCloudCycle() {
    cloudCycleTimer = setInterval(() => {
        // 只在游戏未暂停时执行云朵周期
        if (!isPaused) {
            if (cloudsVisible) {
                showGlobalCloudWarning();
                setTimeout(() => {
                    if (!isPaused) {  // 再次检查是否暂停
                        toggleClouds();
                    }
                }, cloudWarningTime);
            } else {
                toggleClouds();
            }
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
    // 如果游戏暂停，不显示警告
    if (isPaused) {
        return;
    }

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
        // 只在游戏未暂停时更新倒计时
        if (!isPaused) {
            remainingTime--;
            if (remainingTime > 0) {
                updateWarningMessage(remainingTime);
            } else {
                hideCloudWarning();
            }
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

// 开始云虚化效果
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
    if (isPaused) {
        return;
    }

    let currentBottom = parseInt(character.style.bottom) || 0;
    const cloudUnder = checkCloudCollisions();

    // 处理左右移动
    if (isMovingLeft && characterPosition > 0) {
        characterPosition = Math.max(0, characterPosition - characterSpeed);
    }
    if (isMovingRight && characterPosition < gameWidth - characterWidth) {
        characterPosition = Math.min(gameWidth - characterWidth, characterPosition + characterSpeed);
    }
    character.style.left = `${characterPosition}px`;

    // 处理飞行状态
    if (isFlying) {
        if (isSpacePressed) {
            flyingVelocity = Math.min(flyingVelocity + flyingAcceleration, maxFlyingSpeed);
        } else if (isShiftPressed) {
            flyingVelocity = Math.max(flyingVelocity - flyingAcceleration, -maxFlyingSpeed);
        } else {
            flyingVelocity *= 0.95;
        }
        currentBottom = Math.max(0, Math.min(gameHeight - characterHeight, currentBottom + flyingVelocity));
        character.style.bottom = `${currentBottom}px`;
        return;
    }

    // 如果不在飞行状态，处理云朵和下落
    if (!cloudUnder && currentBottom > 0 && !isJumping && !isDoubleJumping) {
        currentBottom = Math.max(0, currentBottom - 5); // 从 10 改为 5，降低下落速度
        character.style.bottom = `${currentBottom}px`;
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

    // 修改为只需要按 K 键来触发开发者模
    if (event.code === 'KeyK') {
        toggleDeveloperMode();
        return;
    }

    // 添加 H 键查看历史记录
    if (event.code === 'KeyH') {
        showChatHistory();
        return;
    }

    // 修改指令输入框的快捷键处理
    if (event.key === '/' || event.key === 't') {
        if (!commandInput) {
            createCommandInput();
        }
        commandInput.style.display = 'block';
        commandInput.value = event.key === '/' ? '/' : ''; // 如果按/则自动添加/
        commandInput.focus();
        isPaused = true; // 暂停游戏
        event.preventDefault();
        return;
    }
}

// 处理键放事件
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
        // 降低第一段跳跃高度
        isJumping = true;
        const jumpHeight = gameHeight / 3;  // 从 gameHeight/2.2 改为 gameHeight/3
        performJump(jumpHeight);
    } else if (!isDoubleJumping) {
        // 降低二段跳高度
        isDoubleJumping = true;
        const secondJumpHeight = gameHeight / 3.5;  // 从 gameHeight/2.5 改为 gameHeight/3.5
        performJump(secondJumpHeight);
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

// 修改 stopFlying 函数
function stopFlying() {
    isFlying = false;
    canFly = false;
    isJumping = true; // 设置为 true 以防止跳跃
    isDoubleJumping = true; // 设置为 true 以防止二段跳
    if (flyingTimer) {
        clearInterval(flyingTimer);
        flyingTimer = null;
    }
    character.classList.remove('flying');
    
    // 添加平滑下落效果
    let currentBottom = parseInt(character.style.bottom) || 0;
    const fallInterval = setInterval(() => {
        if (currentBottom > 0) {
            currentBottom = Math.max(0, currentBottom - 10);
            character.style.bottom = `${currentBottom}px`;
        } else {
            clearInterval(fallInterval);
            isJumping = false; // 落地后重置跳跃状态
            isDoubleJumping = false; // 落地后重置二段跳态
            showMessage(translations[currentLanguage].flyingEnded);
        }
    }, 16);
}

// 执行跳跃
function performJump(height) {
    let startHeight = parseInt(character.style.bottom) || 0;
    let jumpHeight = startHeight;
    let peakHeight = startHeight + height;
    let jumpVelocity = 30;  // 增加初始速度
    let gravity = 1.5;      // 增加重力

    clearInterval(jumpInterval);
    jumpInterval = setInterval(() => {
        if (isPaused) {
            return;
        }

        // 应用重力
        jumpVelocity -= gravity;
        jumpHeight += jumpVelocity;

        // 检查是否到达地面
        if (jumpHeight <= 0) {
            jumpHeight = 0;
            clearInterval(jumpInterval);
            character.style.bottom = '0px';
            isJumping = false;
            isDoubleJumping = false;
            return;
        }

        // 检查是否到达最大高度
        if (jumpHeight >= peakHeight) {
            jumpHeight = peakHeight;
            jumpVelocity = -jumpVelocity * 0.6;  // 直接反向，不做平滑处理
        }

        // 更新位置
        character.style.bottom = `${jumpHeight}px`;

        // 检查云朵碰撞
        const cloudUnder = checkCloudCollisions();
        if (cloudUnder && jumpVelocity < 0) {
            const cloudTop = cloudUnder.element.getBoundingClientRect().top;
            const newBottom = gameHeight - cloudTop;
            if (jumpHeight <= newBottom + 10) {
                clearInterval(jumpInterval);
                character.style.bottom = `${newBottom}px`;
                isJumping = false;
                isDoubleJumping = false;
                return;
            }
        }

        checkCollisions();
    }, 16);  // 使用16ms的间隔以获得更快的响应
}


// 创建障碍物
function createObstacle() {
    const obstacle = document.createElement('img');
    obstacle.src = 'assets/tree.svg';
    obstacle.className = 'obstacle';
    
    // 随机选择障碍物类型
    const types = Object.keys(OBSTACLE_TYPES);
    const randomType = types[Math.floor(Math.random() * types.length)];
    const obstacleType = OBSTACLE_TYPES[randomType];
    
    obstacle.style.position = 'absolute';
    obstacle.style.right = `-${obstacleType.width}px`;
    obstacle.style.bottom = '-5px';
    obstacle.style.width = `${obstacleType.width}px`;
    obstacle.style.height = `${obstacleType.height}px`;
    obstacle.style.transform = `scale(${obstacleType.scale})`;
    obstacle.style.background = 'transparent';
    obstacle.style.backgroundColor = 'transparent';
    obstacle.style.border = 'none';
    
    gameContainer.appendChild(obstacle);
    
    console.log('创建新障碍物，类型：', randomType, '位置：', gameWidth + obstacleType.width);
    return {
        element: obstacle,
        position: gameWidth + obstacleType.width,
        type: randomType,
        width: obstacleType.width,
        height: obstacleType.height
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
        // 根据障碍物类型调整碰撞箱
        const type = OBSTACLE_TYPES[obstacle.type];
        const collisionAdjustment = type.scale * 0.1; // 根据缩放调整碰撞箱

        const obstacleLeft = obstacleRect.left + obstacleRect.width * collisionAdjustment;
        const obstacleRight = obstacleRect.right - obstacleRect.width * collisionAdjustment;
        const obstacleTop = obstacleRect.top + obstacleRect.height * collisionAdjustment;
        const obstacleBottom = obstacleRect.bottom - obstacleRect.height * collisionAdjustment;

        if (characterRight > obstacleLeft &&
            characterLeft < obstacleRight &&
            characterBottom > obstacleTop &&
            characterTop < obstacleBottom) {
            console.log('碰撞检测：游戏结束');
            endGame();
            return;
        }
    }

    // 检查与怪物的碰撞
    if (monster && monster.isActive && !monster.invincible) {
        const monsterRect = monster.element.getBoundingClientRect();
        const characterRect = character.getBoundingClientRect();
        if (characterRect.right > monsterRect.left &&
            characterRect.left < monsterRect.right &&
            characterRect.bottom > monsterRect.top) {
            endGame();
            return;
        }
    }
}

// 新增 increaseDifficulty 函数
function increaseDifficulty() {
    const elapsedTime = (Date.now() - gameStartTime) / 1000;
    
    if (elapsedTime % 30 < 0.017) {
        currentObstacleSpeed = Math.min(12, currentObstacleSpeed + 0.75);
        currentObstacleGenerationProbability = Math.min(0.02, currentObstacleGenerationProbability + 0.002); // 最大概率改为 0.02
        console.log(`难度提升：速度 ${currentObstacleSpeed}, 生成概率 ${currentObstacleGenerationProbability}`);
    }
}


// 结束游戏
function endGame() {
    isPaused = true;
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    // 清除所有计时器和状态
    clearTimeout(invincibilityTimer);
    clearInterval(cloudCycleTimer);
    clearInterval(jumpInterval);
    if (window.blinkInterval) {
        clearInterval(window.blinkInterval);
        window.blinkInterval = null;
    }
    
    // 重置所有状态
    isInvincible = false;
    isFlying = false;
    canFly = false;
    hasUsedFlight = false;
    isJumping = false;
    isDoubleJumping = false;
    
    // 清理计时器
    if (flyingTimer) {
        clearInterval(flyingTimer);
        flyingTimer = null;
    }
    
    // 移除状态类和重置样式
    character.classList.remove('flying', 'can-fly', 'invincible');
    character.style.opacity = '1';
    character.style.bottom = '0px';
    
    // 移除怪物
    removeMonster();
    
    // 显示游戏结束界面
    finalScoreDisplay.textContent = `${translations[currentLanguage].finalScore}: ${score}`;
    gameOverScreen.style.display = 'flex';
    
    // 清除云朵警告
    if (cloudWarningTimer) {
        clearInterval(cloudWarningTimer);
        cloudWarningTimer = null;
    }
    
    console.log('游戏结束');
}

// 切换暂停状态
function togglePause() {
    isPaused = !isPaused;
    if (pauseMessage) {
        if (isPaused) {
            // 暂停游戏时
            pauseMessage.textContent = translations[currentLanguage].paused;
            pauseMessage.style.display = 'block';
            gameContainer.classList.add('paused');
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            
            // 暂停时暂停闪烁效果，但保持当前透明度
            if (window.blinkInterval) {
                clearInterval(window.blinkInterval);
                window.blinkInterval = null;
            }
            
            // 暂停时隐藏云朵警告
            if (cloudWarningMessage) {
                cloudWarningMessage.style.display = 'none';
            }
            // 清除云朵警告计时器
            if (cloudWarningTimer) {
                clearInterval(cloudWarningTimer);
                cloudWarningTimer = null;
            }
        } else {
            // 恢复游戏时
            pauseMessage.style.display = 'none';
            gameContainer.classList.remove('paused');
            if (!animationFrameId) {
                gameLoop();
            }
            
            // 确保角色可见
            character.style.opacity = '1';
            
            // 只在之前不是无敌状态时才给予新的无敌时间
            if (!isInvincible) {
                setInvincibility(1000);
            }
            
            // 恢复云朵警告（如果之前存在）
            if (cloudWarningMessage) {
                cloudWarningMessage.style.display = 'block';
            }
        }
    }
    console.log(`游戏${isPaused ? '暂停' : '继续'}`);
}

// 设置无敌状态
function setInvincibility(duration) {
    // 如果已经处于无敌状态，不重复设置
    if (isInvincible) {
        return;
    }

    // 除之前的闪烁计时和无敌计时器
    if (window.blinkInterval) {
        clearInterval(window.blinkInterval);
        window.blinkInterval = null;
    }
    if (invincibilityTimer) {
        clearTimeout(invincibilityTimer);
        invincibilityTimer = null;
    }

    isInvincible = true;
    character.classList.add('invincible');
    character.style.opacity = '1'; // 确保开始时是完全不透明的
    
    // 修改闪烁效果，使用全局变量存储闪烁计时器
    window.blinkInterval = setInterval(() => {
        if (!isPaused) {  // 在非暂停状态下改变透明度
            character.style.opacity = character.style.opacity === '1' ? '0.5' : '1';
        }
    }, 200);

    // 设置无敌时间结束的计时器
    if (duration !== Number.MAX_SAFE_INTEGER) {
        invincibilityTimer = setTimeout(() => {
            isInvincible = false;
            character.classList.remove('invincible');
            character.style.opacity = '1';
            if (window.blinkInterval) {
                clearInterval(window.blinkInterval);
                window.blinkInterval = null;
            }
            console.log('无敌时间结束');
        }, duration);
    }
}


// 调整戏大小
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
    document.getElementById('language-selection').style.display = 'none';
    
    // 显示皮肤选择界面
    const skinSelection = document.getElementById('skin-selection');
    skinSelection.style.display = 'flex';
    
    // 更新皮肤选择界面的文本
    document.getElementById('skin-selection-title').textContent = 
        translations[currentLanguage].selectSkin;
    
    // 添加皮肤选择事件监听
    setupSkinSelection();
}

// 添加皮肤选择相关函数
function setupSkinSelection() {
    const skinOptions = document.querySelectorAll('.skin-option');
    const confirmButton = document.getElementById('confirm-skin');
    
    // 更新所有皮肤名称的文本
    skinOptions.forEach(option => {
        const skinNameElement = option.querySelector('.skin-name');
        if (skinNameElement) {
            const translateKey = skinNameElement.getAttribute('data-translate');
            if (translateKey) {
                skinNameElement.textContent = translations[currentLanguage][translateKey];
            }
        }
    });
    
    // 更新确认按钮文本
    if (confirmButton) {
        confirmButton.textContent = translations[currentLanguage].confirmSkin;
    }
    
    // 添加皮肤选择事件
    skinOptions.forEach(option => {
        option.addEventListener('click', () => {
            skinOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            currentSkin = option.dataset.skin;
        });
    });
    
    // 添加确认按钮事件
    confirmButton.addEventListener('click', () => {
        if (currentSkin) {
            document.getElementById('skin-selection').style.display = 'none';
            document.getElementById('level-selection').style.display = 'flex';
            const characterIcon = document.getElementById('mario-icon');
            characterIcon.src = SKINS[currentSkin];
            updateUIText();
        }
    });
}

// 更新UI文本的函数
function updateUIText() {
    const elements = {
        'start-button': translations[currentLanguage].startGame,
        'game-over-text': translations[currentLanguage].gameOver,
        'final-score': `${translations[currentLanguage].finalScore}: ${score}`,
        'restart-button': translations[currentLanguage].restart,
        'instruction': translations[currentLanguage].instruction,
        'languageButton': translations[currentLanguage].selectLanguage,
        'back-to-menu-button': translations[currentLanguage].backToMenu
    };

    for (const [id, text] of Object.entries(elements)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    }

    updateScore();

    if (pauseMessage) {
        pauseMessage.textContent = translations[currentLanguage].paused;
    }

    // 添加安全检查
    const restartHint = document.getElementById('restart-hint');
    if (restartHint) {
        restartHint.textContent = translations[currentLanguage].restartHint;
    }

    const levelSelectionTitle = document.getElementById('level-selection-title');
    if (levelSelectionTitle) {
        levelSelectionTitle.textContent = translations[currentLanguage].selectLevel;
    }

    // 使用 querySelector 时添加安全检查
    const level1Element = document.querySelector('[data-translate="level1"]');
    if (level1Element) {
        level1Element.textContent = translations[currentLanguage].level1;
    }

    const levelTargetElement = document.querySelector('[data-translate="levelTarget"]');
    if (levelTargetElement) {
        levelTargetElement.textContent = translations[currentLanguage].levelTarget;
    }

    const gameDescriptionElement = document.querySelector('[data-translate="gameDescription"]');
    if (gameDescriptionElement) {
        gameDescriptionElement.textContent = translations[currentLanguage].gameDescription;
    }
}

// 修改 updateScore 数
function updateScore() {
    if (score === Number.MAX_SAFE_INTEGER) {
        scoreDisplay.textContent = `${translations[currentLanguage].score}: ∞`;
    } else {
        scoreDisplay.textContent = `${translations[currentLanguage].score}: ${score}`;
    }
    
    if (score === 20 && !hasUsedFlight && !canFly && !isFlying) {
        canFly = true;
        character.classList.add('can-fly');
        showMessage(translations[currentLanguage].flyUnlocked);
    }

    if (score === 10 && !isInvincible) {
        setInvincibility(5000);
        showMessage(translations[currentLanguage].invincibilityGained);
    }

    if (score === 40 && !isInvincible) {
        setInvincibility(10000);
        showMessage(translations[currentLanguage].longInvincibilityGained);
    }

    if (score === 60) {
        slowDownObstacles();
        showMessage(translations[currentLanguage].obstaclesSlowed);
    }

    checkVictory();
}

// 新增 increaseScore 函数
function increaseScore() {
    // 如果分数已经是无限，则不再增加
    if (score === Number.MAX_SAFE_INTEGER) {
        return;
    }
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

// 添加新的函数来显示言选界面
function showLanguageSelection() {
    const wasGameStarted = gameStarted; // 保存游戏状态
    const currentScore = score; // 保存当前分数
    
    isPaused = true;
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('language-selection').style.display = 'flex';
    document.getElementById('level-selection').style.display = 'none';

    // 保存当前游戏的重要状态
    const gameState = {
        score: currentScore,
        isFlying,
        canFly,
        hasUsedFlight,
        isInvincible,
        obstacles: [...obstacles],
        gameStarted: wasGameStarted
    };

    // 修改语言选按钮的点击事件
    document.getElementById('en-btn').onclick = () => selectLanguageAndResume('en', gameState);
    document.getElementById('zh-btn').onclick = () => selectLanguageAndResume('zh', gameState);
}

// 添加新函数处理语言选择和游戏恢复
function selectLanguageAndResume(lang, gameState) {
    currentLanguage = lang;
    document.getElementById('language-selection').style.display = 'none';
    
    // 恢复游戏状态
    if (gameState.gameStarted) {
        document.getElementById('game-container').style.display = 'block';
        score = gameState.score;
        isFlying = gameState.isFlying;
        canFly = gameState.canFly;
        hasUsedFlight = gameState.hasUsedFlight;
        isInvincible = gameState.isInvincible;
        
        // 更新UI文本
        updateUIText();
        
        // 恢复游戏
        isPaused = false;
        gameLoop();
    } else {
        // 如果游戏还没开始，显示关卡选界面
        document.getElementById('level-selection').style.display = 'flex';
        updateUIText();
    }
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
    
    // 添加版本号到加载文本
    if (currentLanguage === 'zh') {
        loadingTextEn.style.display = 'none';
        loadingTextZh.style.display = 'block';
        loadingTextZh.innerHTML = `${translations[currentLanguage].loading}<br><span style="font-size: 0.8em; color: #888;">${translations[currentLanguage].version} ${GAME_VERSION}</span>`;
    } else {
        loadingTextEn.style.display = 'block';
        loadingTextZh.style.display = 'none';
        loadingTextEn.innerHTML = `${translations[currentLanguage].loading}<br><span style="font-size: 0.8em; color: #888;">${translations[currentLanguage].version} ${GAME_VERSION}</span>`;
    }
}

// 加 slowDownObstacles 函
function slowDownObstacles() {
    currentObstacleSpeed *= 0.5; // 减半障物速度
    setTimeout(() => {
        currentObstacleSpeed *= 2; // 10秒后恢复正常速度
        showMessage(translations[currentLanguage].obstaclesNormal);
    }, 10000);
}

// 修改 toggleDeveloperMode 函数
function toggleDeveloperMode() {
    isDeveloperMode = !isDeveloperMode;
    
    // 如果关闭开发者模式，清除所有效果
    if (!isDeveloperMode) {
        // 清除无敌状态
        isInvincible = false;
        character.classList.remove('invincible');
        character.style.opacity = '1';
        if (window.blinkInterval) {
            clearInterval(window.blinkInterval);
            window.blinkInterval = null;
        }
        if (invincibilityTimer) {
            clearTimeout(invincibilityTimer);
            invincibilityTimer = null;
        }
        
        // 清除飞行状态
        if (isFlying) {
            stopFlying();
        }
        canFly = false;
        hasUsedFlight = false;
        character.classList.remove('flying', 'can-fly');
        if (flyingTimer) {
            clearInterval(flyingTimer);
            flyingTimer = null;
        }
        
        // 重置角色位置到地面
        character.style.bottom = '0px';
        
        // 重置皮肤到默认
        changeSkin('default');
    }
    
    showMessage(translations[currentLanguage][isDeveloperMode ? 'developerModeOn' : 'developerModeOff']);
}

// 添加设置分数函数
function setCustomScore(newScore) {
    if (!isDeveloperMode) {
        showMessage(translations[currentLanguage].developerModeRequired);
        return;
    }
    score = parseInt(newScore);
    updateScore();
    showMessage(translations[currentLanguage].scoreSet + score);
}

// 修改 createCommandInput 函数
function createCommandInput() {
    commandInput = document.createElement('input');
    commandInput.type = 'text';
    commandInput.style.position = 'fixed';
    commandInput.style.top = '10px';
    commandInput.style.left = '50%';
    commandInput.style.transform = 'translateX(-50%)';
    commandInput.style.padding = '5px 10px';
    commandInput.style.border = '2px solid #007bff';
    commandInput.style.borderRadius = '5px';
    commandInput.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    commandInput.style.color = 'white';
    commandInput.style.display = 'none';
    commandInput.style.zIndex = '1000';
    commandInput.style.width = '200px';
    commandInput.style.outline = 'none';
    
    document.body.appendChild(commandInput);

    // 修改事件监听器
    commandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = commandInput.value;
            if (command.startsWith('/')) {
                processCommand(command);
            } else {
                showChatMessage(command);
            }
            commandInput.value = '';
            commandInput.style.display = 'none';
            isPaused = false;
            // 恢复云朵警告（如果存在）
            if (cloudWarningMessage) {
                cloudWarningMessage.style.display = 'block';
            }
            e.preventDefault();
        } else if (e.key === 'Escape') {
            commandInput.style.display = 'none';
            commandInput.value = '';
            isPaused = false;
            // 恢复云朵警告（如果存在）
            if (cloudWarningMessage) {
                cloudWarningMessage.style.display = 'block';
            }
            e.preventDefault();
        }
        e.stopPropagation();
    });
}

// 修改 processCommand 函数
function processCommand(command) {
    if (!command.trim()) {
        showCommandFeedback(translations[currentLanguage].commandEmpty, false);
        return;
    }

    // 处理聊天消息（不是以/开头的消息）
    if (!command.startsWith('/')) {
        showChatMessage(command);
        return;
    }

    command = command.substring(1).trim(); // 去掉斜杠

    // 如果有开启开发者模式，所有/开头的命令都显示未找到
    if (!isDeveloperMode) {
        showCommandFeedback(translations[currentLanguage].commandNotFound, false);
        return;
    }

    // 处理 effect 命令
    if (command.startsWith('effect')) {
        const parts = command.split(' ');
        
        // 处理 effect clean 命令
        if (parts[1] === 'clean') {
            // 清除无敌状态
            isInvincible = false;
            character.classList.remove('invincible');
            if (invincibilityTimer) {
                clearTimeout(invincibilityTimer);
                invincibilityTimer = null;
            }
            
            // 清除飞行状态
            if (isFlying) {
                stopFlying();
            }
            canFly = false;
            hasUsedFlight = false;
            character.classList.remove('flying', 'can-fly');
            if (flyingTimer) {
                clearInterval(flyingTimer);
                flyingTimer = null;
            }
            
            // 重置角色位置到地面
            character.style.bottom = '0px';
            
            showCommandFeedback(translations[currentLanguage].effectsCleared, true);
            return;
        }
        
        // 原有的 no_die 效果处理
        if (parts.length === 3 && parts[1] === 'no_die') {
            const seconds = parseInt(parts[2]);
            if (seconds === -1) {
                // 处无限时长
                isInvincible = true;
                character.classList.add('invincible');
                if (invincibilityTimer) {
                    clearTimeout(invincibilityTimer);
                    invincibilityTimer = null;
                }
                showCommandFeedback(translations[currentLanguage].infiniteInvincibility, true);
                return;
            } else if (!isNaN(seconds) && seconds > 0) {
                setInvincibility(seconds * 1000);
                showCommandFeedback(`${translations[currentLanguage].invincibilityGained} ${seconds}s`, true);
                return;
            } else {
                showCommandFeedback(translations[currentLanguage].invalidTimeParam, false);
                return;
            }
        }
        
        showCommandFeedback(translations[currentLanguage].invalidEffectCommand, false);
        return;
    }

    // 处理 score 命令，添加无限值显示
    if (command.match(/^score\s*=\s*-1$/)) {
        score = Number.MAX_SAFE_INTEGER;
        updateScore();
        showCommandFeedback(translations[currentLanguage].scoreInfinite, true);
        return;
    }

    // 以下命令只有开发者模式下才能使用
    // 处理 score 命令
    if (command.match(/^score\s*=\s*\d+$/)) {
        const newScore = parseInt(command.split('=')[1]);
        score = newScore;
        updateScore();
        showCommandFeedback(translations[currentLanguage].commandSuccess, true);
        return;
    }

    // 处理 score+ 命令（加法）
    if (command.match(/^score\s*\+\s*\d+$/)) {
        const addScore = parseInt(command.split('+')[1]);
        score += addScore;
        updateScore();
        showCommandFeedback(`${translations[currentLanguage].scoreAdded} ${addScore}`, true);
        return;
    }

    // 理 score- 命令（减法）
    if (command.match(/^score\s*-\s*\d+$/)) {
        const subScore = parseInt(command.split('-')[1]);
        score -= subScore;
        updateScore();
        showCommandFeedback(`${translations[currentLanguage].scoreAdded} ${subScore}`, true);
        return;
    }

    // 处理 score* 命令（乘法）
    if (command.match(/^score\s*\*\s*\d+$/)) {
        const mulScore = parseInt(command.split('*')[1]);
        score *= mulScore;
        updateScore();
        showCommandFeedback(`${translations[currentLanguage].scoreAdded} ${mulScore}`, true);
        return;
    }

    // 处理 score// 命令（除法）
    if (command.match(/^score\s*\/\/\s*\d+$/)) {
        const divScore = parseInt(command.split('//')[1]);
        if (divScore === 0) {
            showCommandFeedback(translations[currentLanguage].divideByZero, false);
            return;
        }
        score = Math.floor(score / divScore);
        updateScore();
        showCommandFeedback(`${translations[currentLanguage].scoreAdded} ${divScore}`, true);
        return;
    }

    // 处理皮肤切换命令
    if (command.startsWith('skin set ')) {
        if (!isDeveloperMode) {
            showCommandFeedback(translations[currentLanguage].developerModeRequired, false);
            return;
        }
        const skinName = command.split(' ')[2].toLowerCase();
        if (SKINS[skinName]) {
            changeSkin(skinName);
            showCommandFeedback(translations[currentLanguage].skinChanged + skinName, true);
            return;
        } else {
            showCommandFeedback(translations[currentLanguage].skinNotFound + skinName, false);
            return;
        }
    }

    // 处理皮肤重置命令
    if (command === 'skin reset') {
        if (!isDeveloperMode) {
            showCommandFeedback(translations[currentLanguage].developerModeRequired, false);
            return;
        }
        changeSkin('default');
        showCommandFeedback(translations[currentLanguage].skinReset, true);
        return;
    }

    // 如果没有匹配任何命令
    showCommandFeedback(translations[currentLanguage].commandNotFound, false);
}

// 添加命令反馈函数
function showCommandFeedback(message, isSuccess) {
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.style.position = 'fixed';
    feedback.style.top = '50px';
    feedback.style.left = '50%';
    feedback.style.transform = 'translateX(-50%)';
    feedback.style.padding = '8px 16px';
    feedback.style.borderRadius = '4px';
    feedback.style.backgroundColor = isSuccess ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)';
    feedback.style.color = isSuccess ? '#00ff00' : '#ff0000';
    feedback.style.fontWeight = 'bold';
    feedback.style.zIndex = '1001';
    feedback.style.transition = 'opacity 0.5s';
    document.body.appendChild(feedback);

    // 淡出效果
    setTimeout(() => {
        feedback.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 500);
    }, 1500);
}

// 修改 showChatMessage 函数
function showChatMessage(message) {
    // 添加消到历史记录
    chatHistory.push({
        message: message,
        timestamp: new Date().toLocaleTimeString()
    });

    // 创建新消息元素
    const chatMessage = document.createElement('div');
    chatMessage.textContent = message;
    chatMessage.style.position = 'fixed';
    chatMessage.style.top = '60px';  // 初始位置在得分下方
    chatMessage.style.left = '20px';
    chatMessage.style.padding = '8px 16px';
    chatMessage.style.borderRadius = '4px';
    chatMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    chatMessage.style.color = 'white';
    chatMessage.style.maxWidth = '300px';
    chatMessage.style.wordWrap = 'break-word';
    chatMessage.style.zIndex = '1001';
    chatMessage.style.transition = 'all 0.3s ease';
    chatMessage.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    document.body.appendChild(chatMessage);

    // 将新消息添加到活动消息数组
    activeMessages.push(chatMessage);

    // 更新所有活动消息的位置
    updateMessagePositions();

    // 3秒后开始淡出
    setTimeout(() => {
        chatMessage.style.opacity = '0';
        setTimeout(() => {
            if (chatMessage.parentNode) {
                document.body.removeChild(chatMessage);
                // 活动消息数组中移除
                const index = activeMessages.indexOf(chatMessage);
                if (index > -1) {
                    activeMessages.splice(index, 1);
                }
                // 更新剩余消息的位置
                updateMessagePositions();
            }
        }, 300);
    }, 3000);
}

// 添加更新消息位置的函数
function updateMessagePositions() {
    activeMessages.forEach((message, index) => {
        message.style.top = `${60 + (index * MESSAGE_HEIGHT)}px`;
    });
}

// 修改 showChatHistory 函
function showChatHistory() {
    const historyContainer = document.createElement('div');
    historyContainer.style.position = 'fixed';
    historyContainer.style.top = '50%';
    historyContainer.style.left = '50%';
    historyContainer.style.transform = 'translate(-50%, -50%)';
    historyContainer.style.padding = '20px';
    historyContainer.style.borderRadius = '10px';
    historyContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    historyContainer.style.color = '#fff';
    historyContainer.style.maxWidth = '80%';
    historyContainer.style.maxHeight = '60%';
    historyContainer.style.overflowY = 'auto';
    historyContainer.style.zIndex = '1002';
    historyContainer.style.border = '2px solid #007bff';
    historyContainer.style.minWidth = '300px';
    historyContainer.style.minHeight = '200px';

    // 添加标题
    const title = document.createElement('div');
    title.textContent = chatHistory.length > 0 ? '聊天历史记录' : '暂无聊天记录';
    title.style.textAlign = 'center';
    title.style.marginBottom = '10px';
    title.style.borderBottom = '1px solid #007bff';
    title.style.paddingBottom = '5px';
    title.style.fontSize = '18px';
    historyContainer.appendChild(title);

    if (chatHistory.length > 0) {
        // 添加所有历史消息
        chatHistory.forEach(entry => {
            const messageDiv = document.createElement('div');
            messageDiv.style.marginBottom = '8px';
            messageDiv.style.padding = '8px';
            messageDiv.style.borderBottom = '1px solid rgba(255, 255, 255, 0.2)';
            messageDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            messageDiv.style.borderRadius = '4px';
            messageDiv.innerHTML = `<span style="color: #888;">[${entry.timestamp}]</span> ${entry.message}`;
            historyContainer.appendChild(messageDiv);
        });
    }

    // 添加关闭聊天记录按钮
    const closeButton = document.createElement('button');
    closeButton.textContent = '关闭';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.padding = '5px 10px';
    closeButton.style.backgroundColor = '#007bff';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.color = 'white';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => document.body.removeChild(historyContainer);
    historyContainer.appendChild(closeButton);

    document.body.appendChild(historyContainer);
}

// 添加关卡选择函数
function selectLevel(level) {
    document.getElementById('level-selection').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    startGame();
}

// 添加通关检查
function checkVictory() {
    if (score >= 50) {
        showVictoryScreen();
    }
}

// 添加显示通关界面函数
function showVictoryScreen() {
    isPaused = true;
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    const victoryScreen = document.getElementById('victory-screen');
    const victoryText = document.getElementById('victory-text');
    const victoryScore = document.getElementById('victory-score');
    
    victoryText.textContent = translations[currentLanguage].victory;
    victoryScore.textContent = `${translations[currentLanguage].victoryScore}: ${score}`;
    victoryScreen.style.display = 'flex';
}

// 添加返回菜单按钮事件监
document.getElementById('back-to-menu-button').addEventListener('click', () => {
    location.reload(); // 刷新页面返回到开始
});

// 添加皮肤切换函数
function changeSkin(skinName) {
    if (SKINS[skinName]) {
        currentSkin = skinName;
        const characterIcon = document.getElementById('mario-icon');
        characterIcon.src = SKINS[skinName];
        
        // 如果是 redball 皮肤，调整一些特殊样式
        if (skinName === 'redball') {
            characterIcon.style.transform = 'scale(0.8)'; // 稍微缩小一点
        } else {
            characterIcon.style.transform = 'none';
        }
    }
}

// 修改 moveMonster 函数，添加跳跃冷却
function moveMonster() {
    if (!monster || !monster.isActive) {
        if (Math.random() < 0.005) {
            monster = createMonster();
            // 给新生成的怪物5秒无敌时间
            monster.invincible = true;
            setTimeout(() => {
                if (monster) {
                    monster.invincible = false;
                }
            }, 5000);
        }
        return;
    }

    const characterLeft = parseInt(character.style.left) || 0;
    const characterBottom = parseInt(character.style.bottom) || 0;
    let monsterBottom = parseInt(monster.element.style.bottom) || 0;
    
    // 检查x坐标是否相同（允许小范围误差）
    if (!monster.invincible && Math.abs(monster.position - characterLeft) < 5) {
        removeMonster();
        return;
    }
    
    // 计算与玩家的距离
    const distance = Math.abs(monster.position - characterLeft);
    
    // 根据距离决定速度
    let currentSpeed = distance < MONSTER_CHASE_DISTANCE ? 
        MONSTER_CHASE_SPEED : MONSTER_BASE_SPEED;
    
    // 水平移动 - 始终朝向玩家移动
    if (monster.position > characterLeft) {
        monster.position -= currentSpeed;
        monster.element.style.transform = 'scaleX(-1)';
    } else {
        monster.position += currentSpeed;
        monster.element.style.transform = 'scaleX(1)';
    }
    
    // 垂直移动（重力系统）
    if (characterBottom > monsterBottom + 50) {
        if (!monsterJumping) {
            // 第一段跳
            monsterVelocity = MONSTER_JUMP_SPEED;
            monsterJumping = true;
        } else if (!monsterDoubleJumping && monsterBottom > 0) {
            // 二段跳
            monsterVelocity = MONSTER_JUMP_SPEED * 0.8;  // 二段跳稍微低一点
            monsterDoubleJumping = true;
        }
    }
    
    // 应用重力
    monsterBottom += monsterVelocity;
    monsterVelocity -= MONSTER_GRAVITY;
    
    // 确保不会低于地面
    if (monsterBottom <= 0) {
        monsterBottom = 0;
        monsterVelocity = 0;
        monsterJumping = false;
        monsterDoubleJumping = false;  // 落地时重置二段跳状态
    }
    
    // 更新怪物位置
    monster.element.style.left = `${monster.position}px`;
    monster.element.style.bottom = `${monsterBottom}px`;

    // 检查与障碍物的碰撞
    for (let obstacle of obstacles) {
        const obstacleRect = obstacle.element.getBoundingClientRect();
        const monsterRect = monster.element.getBoundingClientRect();

        if (monsterRect.right > obstacleRect.left &&
            monsterRect.left < obstacleRect.right &&
            monsterRect.bottom > obstacleRect.top) {
            removeMonster();
            break;
        }
    }
}

// 修改 createMonster 函数，初始化重力相关属性
function createMonster() {
    const monsterElement = document.createElement('img');
    monsterElement.src = 'assets/hunter.svg';
    monsterElement.style.position = 'absolute';
    monsterElement.style.width = `${MONSTER_WIDTH}px`;
    monsterElement.style.height = `${MONSTER_HEIGHT}px`;
    monsterElement.style.bottom = '0px';
    monsterElement.style.left = `${gameWidth}px`;
    monsterElement.style.zIndex = '5';
    monsterElement.style.transition = 'transform 0.1s';
    gameContainer.appendChild(monsterElement);

    monsterVelocity = 0;  // 重置速度

    return {
        element: monsterElement,
        position: gameWidth,
        isActive: true
    };
}

// 修改 removeMonster 函数，重置跳跃状态
function removeMonster() {
    if (monster && monster.element && monster.element.parentNode) {
        monster.element.parentNode.removeChild(monster.element);
        monster = null;
        monsterJumping = false;
        monsterDoubleJumping = false;
        monsterVelocity = 0;
    }
}

// 调用主函数
main();