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
const characterSpeed = 10;
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

// 主函数
function main() {
    document.addEventListener('DOMContentLoaded', initializeDOMElements);
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

    createPauseMessage();
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
    // 初始化障碍物速度
    obstacleSpeed = 5;
    // 重置角色位置
    characterPosition = 0;
    character.style.left = '0px';
    character.style.bottom = '0px';
    
    // 更新分数显示
    scoreDisplay.textContent = '得分: 0';
    
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
    //在 startGame 函数开始时，取消之前的动画帧：
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
    // 初始化动画帧
    animationFrameId = requestAnimationFrame(gameLoop);

    // 确保游戏循环开始
    isPaused = false;
    gameLoop();
}


// 重新开始游戏
function restartGame() {
    initializeGame();
    startGame();
}

// 游戏主循环
function gameLoop() {
    if (!isPaused) {
        moveCharacter();
        moveObstacles();
        moveClouds();
        checkCollisions();
        animationFrameId = requestAnimationFrame(gameLoop);
    }
    
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
    cloudWarningMessage.textContent = `云即将消失请做好准备 ${remainingTime}`;
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

// 移动角色
function moveCharacter() {
    if (isMovingLeft && characterPosition > 0) {
        characterPosition -= characterSpeed;
    }
    if (isMovingRight && characterPosition < gameWidth - characterWidth) {
        characterPosition += characterSpeed;
    }
    character.style.left = characterPosition + 'px';

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

// 处理键盘按下事件
function handleKeyDown(event) {
    if (event.code === 'KeyP') {
        togglePause();
        return;
    }
    
    if (!isPaused) {
        switch(event.code) {
            case 'Space':
                jump();
                event.preventDefault();
                break;
            case 'KeyA':
                isMovingLeft = true;
                break;
            case 'KeyD':
                isMovingRight = true;
                break;
        }
    }
}

// 处理键盘释放事件
function handleKeyUp(event) {
    if (!isPaused) {
        switch(event.code) {
            case 'KeyA':
                isMovingLeft = false;
                break;
            case 'KeyD':
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

    const cloudUnder = checkCloudCollisions();
    if (!isJumping) {
        isJumping = true;
        const jumpHeight = cloudUnder ? gameHeight / 4 : gameHeight / 3;
        performJump(jumpHeight);
    } else if (!isDoubleJumping) {
        isDoubleJumping = true;
        clearInterval(jumpInterval);
        performJump(gameHeight / 4);
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

// 移动障碍物
function moveObstacles() {
    const maxObstacles = increaseGameDifficulty();

    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        obstacle.position -= obstacleSpeed;
        
        if (isNaN(obstacle.position)) {
            console.error(`障碍物 ${i} 的位置是 NaN`);
            obstacle.position = gameWidth + obstacleWidth;
        }
        
        obstacle.element.style.right = `${gameWidth - obstacle.position}px`;

        if (obstacle.position + obstacleWidth < 0) {
            gameContainer.removeChild(obstacle.element);
            obstacles.splice(i, 1);
            score++;
            scoreDisplay.textContent = '得分: ' + score;
        }
    }

    if (Math.random() < obstacleGenerationProbability && obstacles.length < maxObstacles) {
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

// 增加游戏难度
function increaseGameDifficulty() {
    obstacleGenerationProbability = Math.min(0.03, 0.01 + score * 0.0002);
    obstacleSpeed = Math.min(10, 5 + score * 0.05);
    const maxObstacles = Math.min(5, 2 + Math.floor(score / 5));
    
    console.log(`当前难度: 生成概率${obstacleGenerationProbability.toFixed(5)}, 速度${obstacleSpeed.toFixed(2)}, 最大障碍物数量${maxObstacles}`);
    
    return maxObstacles;
}


// 结束游戏
function endGame() {
    isPaused = true;
    //在 endGame 函数中，也取消动画帧：
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    clearTimeout(invincibilityTimer);
    clearInterval(cloudCycleTimer);
    isInvincible = false;
    character.style.opacity = '1';
    console.log('游戏结束');
    console.log(`最终得分: ${score}`);
    console.log(`角色最终位置: ${characterPosition}, 底部: ${character.style.bottom}`);
    console.log(`障碍物数量: ${obstacles.length}, 云朵数量: ${clouds.length}`);
    
    finalScoreDisplay.textContent = `得分: ${score}`;
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
            pauseMessage.textContent = '游戏已暂停。按 P 键继续。';
            pauseMessage.style.display = 'block';
            clearTimeout(invincibilityTimer);
        } else {
            pauseMessage.style.display = 'none';
            setInvincibility(1000);
        }
    }
    console.log(`游戏${isPaused ? '暂停' : '继续'}`);
}

// 设置无敌状态
function setInvincibility(duration) {
    isInvincible = true;
    character.classList.add('invincible');
    clearTimeout(invincibilityTimer);
    invincibilityTimer = setTimeout(() => {
        isInvincible = false;
        character.classList.remove('invincible');
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


// 调用主函数
main();