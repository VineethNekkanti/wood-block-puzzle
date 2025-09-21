class WoodBlockPuzzle {
    constructor() {
        this.canvas = document.getElementById('gameBoard');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 10;
        this.cellSize = this.canvas.width / this.gridSize;
        this.grid = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(0));
        this.score = 0;
        this.currentBlocks = [];
        this.draggedBlock = null;
        this.dragOffset = { x: 0, y: 0 };
        this.gameOver = false;
        this.musicEnabled = true;
        this.soundEnabled = true;
        
        // Audio elements
        this.backgroundMusic = document.getElementById('backgroundMusic');
        this.blockPlaceSound = document.getElementById('blockPlaceSound');
        this.lineClearSound = document.getElementById('lineClearSound');
        
        // UI elements
        this.scoreElement = document.getElementById('score');
        this.gameOverlay = document.getElementById('gameOverlay');
        this.finalScoreElement = document.getElementById('finalScore');
        this.leaderboardList = document.getElementById('leaderboardList');
        this.blocksRow = document.getElementById('blocksRow');
        
        this.initializeGame();
        this.setupEventListeners();
        this.loadLeaderboard();
        this.startBackgroundMusic();
    }
    
    initializeGame() {
        this.grid = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(0));
        this.score = 0;
        this.currentBlocks = [];
        this.gameOver = false;
        this.updateScore();
        this.generateNewBlocks();
        this.draw();
    }
    
    setupEventListeners() {
        // Canvas events
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mouseleave', () => this.handleMouseUp());
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // UI events
        document.getElementById('restartGame').addEventListener('click', () => this.restartGame());
        document.getElementById('saveScore').addEventListener('click', () => this.saveScore());
        document.getElementById('toggleMusic').addEventListener('click', () => this.toggleMusic());
        document.getElementById('toggleSound').addEventListener('click', () => this.toggleSound());
        
        // Enable audio on first user interaction
        const enableAudioOnInteraction = () => {
            this.enableAudio();
            document.removeEventListener('click', enableAudioOnInteraction);
            document.removeEventListener('touchstart', enableAudioOnInteraction);
        };
        document.addEventListener('click', enableAudioOnInteraction);
        document.addEventListener('touchstart', enableAudioOnInteraction);
        
        // Prevent context menu on canvas
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    generateNewBlocks() {
        this.currentBlocks = [];
        const blockShapes = this.getBlockShapes();
        
        for (let i = 0; i < 3; i++) {
            const randomShape = blockShapes[Math.floor(Math.random() * blockShapes.length)];
            this.currentBlocks.push({
                id: i,
                shape: randomShape,
                used: false,
                element: null
            });
        }
        
        this.renderBlocks();
    }
    
    getBlockShapes() {
        return [
            // Single block
            [[1]],
            
            // Two blocks
            [[1, 1]],
            [[1], [1]],
            
            // Three blocks
            [[1, 1, 1]],
            [[1], [1], [1]],
            [[1, 1], [1, 0]],
            [[1, 1], [0, 1]],
            [[0, 1], [1, 1]],
            [[1, 0], [1, 1]],
            
            // Four blocks
            [[1, 1, 1, 1]],
            [[1], [1], [1], [1]],
            [[1, 1], [1, 1]],
            [[1, 1, 1], [1, 0, 0]],
            [[1, 1, 1], [0, 0, 1]],
            [[1, 0, 0], [1, 1, 1]],
            [[0, 0, 1], [1, 1, 1]],
            [[1, 1], [1, 0], [1, 0]],
            [[1, 1], [0, 1], [0, 1]],
            [[1, 0], [1, 0], [1, 1]],
            [[0, 1], [0, 1], [1, 1]],
            
            // Five blocks
            [[1, 1, 1, 1, 1]],
            [[1], [1], [1], [1], [1]],
            [[1, 1, 1], [1, 1, 0]],
            [[1, 1, 1], [0, 1, 1]],
            [[1, 1, 0], [1, 1, 1]],
            [[0, 1, 1], [1, 1, 1]],
            [[1, 1, 1], [1, 0, 1]],
            [[1, 0, 1], [1, 1, 1]],
            [[1, 1], [1, 1], [1, 0]],
            [[1, 1], [1, 1], [0, 1]],
            [[1, 0], [1, 1], [1, 1]],
            [[0, 1], [1, 1], [1, 1]]
        ];
    }
    
    renderBlocks() {
        this.blocksRow.innerHTML = '';
        
        this.currentBlocks.forEach((block, index) => {
            if (block.used) return;
            
            const blockElement = document.createElement('div');
            blockElement.className = 'block';
            blockElement.draggable = true;
            blockElement.dataset.blockId = index;
            
            // Create visual representation of the block shape
            const shapeCanvas = document.createElement('canvas');
            shapeCanvas.width = 50;
            shapeCanvas.height = 50;
            const shapeCtx = shapeCanvas.getContext('2d');
            
            this.drawBlockShape(shapeCtx, block.shape, 50, 50);
            blockElement.appendChild(shapeCanvas);
            
            // Add mouse event listeners for desktop
            blockElement.addEventListener('mousedown', (e) => this.handleBlockMouseDown(e, index));
            blockElement.addEventListener('dragstart', (e) => this.handleDragStart(e, index));
            blockElement.addEventListener('dragend', (e) => this.handleDragEnd(e));
            
            // Add touch event listeners for mobile
            blockElement.addEventListener('touchstart', (e) => this.handleBlockTouchStart(e, index));
            
            this.blocksRow.appendChild(blockElement);
            block.element = blockElement;
        });
    }
    
    drawBlockShape(ctx, shape, width, height) {
        const cellSize = Math.min(width / shape[0].length, height / shape.length);
        const offsetX = (width - shape[0].length * cellSize) / 2;
        const offsetY = (height - shape.length * cellSize) / 2;
        
        // Use darker, more contrasting colors for better visibility
        ctx.fillStyle = '#654321';
        ctx.strokeStyle = '#2C1810';
        ctx.lineWidth = 2;
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const x = offsetX + col * cellSize;
                    const y = offsetY + row * cellSize;
                    
                    // Draw main block
                    ctx.fillRect(x, y, cellSize, cellSize);
                    ctx.strokeRect(x, y, cellSize, cellSize);
                    
                    // Add wood grain effect for better visibility
                    ctx.strokeStyle = '#2C1810';
                    ctx.lineWidth = 1;
                    for (let i = 0; i < 2; i++) {
                        const grainY = y + (i + 1) * (cellSize / 3);
                        ctx.beginPath();
                        ctx.moveTo(x + 1, grainY);
                        ctx.lineTo(x + cellSize - 1, grainY);
                        ctx.stroke();
                    }
                    ctx.strokeStyle = '#2C1810';
                    ctx.lineWidth = 2;
                }
            }
        }
    }
    
    handleBlockMouseDown(e, blockId) {
        e.preventDefault();
        if (this.currentBlocks[blockId].used) return;
        
        this.draggedBlock = this.currentBlocks[blockId];
        this.dragOffset = { x: 0, y: 0 };
        
        const rect = e.target.getBoundingClientRect();
        const canvasRect = this.canvas.getBoundingClientRect();
        const x = e.clientX - canvasRect.left;
        const y = e.clientY - canvasRect.top;
        
        this.updateDragPreview(x, y);
        e.target.classList.add('dragging');
    }
    
    handleBlockTouchStart(e, blockId) {
        e.preventDefault();
        if (this.currentBlocks[blockId].used) return;
        
        this.draggedBlock = this.currentBlocks[blockId];
        this.dragOffset = { x: 0, y: 0 };
        
        const touch = e.touches[0];
        const rect = e.target.getBoundingClientRect();
        const canvasRect = this.canvas.getBoundingClientRect();
        const x = touch.clientX - canvasRect.left;
        const y = touch.clientY - canvasRect.top;
        
        this.updateDragPreview(x, y);
        e.target.classList.add('dragging');
    }
    
    handleDragStart(e, blockId) {
        if (this.currentBlocks[blockId].used) {
            e.preventDefault();
            return;
        }
        
        this.draggedBlock = this.currentBlocks[blockId];
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
        
        // Add dragging class
        e.target.classList.add('dragging');
    }
    
    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        this.draggedBlock = null;
    }
    
    handleMouseDown(e) {
        // This method is now handled by individual block elements
        // Keep it for potential future use
    }
    
    handleMouseMove(e) {
        if (!this.draggedBlock) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.updateDragPreview(x, y);
    }
    
    handleMouseUp(e) {
        if (!this.draggedBlock) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.tryPlaceBlock(x, y);
        this.clearDragPreview();
        
        // Remove dragging class from all blocks
        document.querySelectorAll('.block').forEach(block => {
            block.classList.remove('dragging');
        });
        
        this.draggedBlock = null;
    }
    
    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        // Check if touching a block
        const blockElements = document.querySelectorAll('.block:not(.used)');
        blockElements.forEach(blockEl => {
            const blockRect = blockEl.getBoundingClientRect();
            if (x >= blockRect.left - rect.left && x <= blockRect.right - rect.left &&
                y >= blockRect.top - rect.top && y <= blockRect.bottom - rect.top) {
                const blockId = parseInt(blockEl.dataset.blockId);
                this.startDragging(blockId, x, y);
            }
        });
    }
    
    handleTouchMove(e) {
        e.preventDefault();
        if (!this.draggedBlock) return;
        
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        this.updateDragPreview(x, y);
    }
    
    handleTouchEnd(e) {
        e.preventDefault();
        if (!this.draggedBlock) return;
        
        const touch = e.changedTouches[0];
        const rect = this.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        this.tryPlaceBlock(x, y);
        this.clearDragPreview();
        
        // Remove dragging class from all blocks
        document.querySelectorAll('.block').forEach(block => {
            block.classList.remove('dragging');
        });
        
        this.draggedBlock = null;
    }
    
    startDragging(blockId, x, y) {
        this.draggedBlock = this.currentBlocks[blockId];
        this.dragOffset = { x: 0, y: 0 };
        this.updateDragPreview(x, y);
    }
    
    updateDragPreview(x, y) {
        if (!this.draggedBlock) return;
        
        this.draw();
        
        // Calculate grid position
        const gridX = Math.floor(x / this.cellSize);
        const gridY = Math.floor(y / this.cellSize);
        
        // Draw preview
        this.ctx.save();
        this.ctx.globalAlpha = 0.6;
        this.ctx.fillStyle = '#8B4513';
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 2;
        
        const shape = this.draggedBlock.shape;
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const cellX = (gridX + col) * this.cellSize;
                    const cellY = (gridY + row) * this.cellSize;
                    
                    if (this.isValidPosition(gridX + col, gridY + row)) {
                        this.ctx.fillStyle = '#8B4513';
                    } else {
                        this.ctx.fillStyle = '#FF6B6B';
                    }
                    
                    this.ctx.fillRect(cellX, cellY, this.cellSize, this.cellSize);
                    this.ctx.strokeRect(cellX, cellY, this.cellSize, this.cellSize);
                }
            }
        }
        
        this.ctx.restore();
    }
    
    clearDragPreview() {
        this.draw();
    }
    
    tryPlaceBlock(x, y) {
        if (!this.draggedBlock) return;
        
        const gridX = Math.floor(x / this.cellSize);
        const gridY = Math.floor(y / this.cellSize);
        
        if (this.canPlaceBlock(this.draggedBlock.shape, gridX, gridY)) {
            this.placeBlock(this.draggedBlock.shape, gridX, gridY);
            this.draggedBlock.used = true;
            this.playSound(this.blockPlaceSound);
            
            // Check if all blocks are used
            if (this.currentBlocks.every(block => block.used)) {
                this.generateNewBlocks();
            }
            
            // Check for line completions
            this.checkAndClearLines();
            
            // Check game over
            if (this.isGameOver()) {
                this.endGame();
            }
        }
        
        this.renderBlocks();
        this.draw();
    }
    
    canPlaceBlock(shape, startX, startY) {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const gridX = startX + col;
                    const gridY = startY + row;
                    
                    if (!this.isValidPosition(gridX, gridY)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    isValidPosition(x, y) {
        return x >= 0 && x < this.gridSize && 
               y >= 0 && y < this.gridSize && 
               this.grid[y][x] === 0;
    }
    
    placeBlock(shape, startX, startY) {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const gridX = startX + col;
                    const gridY = startY + row;
                    this.grid[gridY][gridX] = 1;
                }
            }
        }
    }
    
    checkAndClearLines() {
        let linesCleared = 0;
        
        // Check rows
        for (let row = 0; row < this.gridSize; row++) {
            if (this.grid[row].every(cell => cell === 1)) {
                this.clearRow(row);
                linesCleared++;
            }
        }
        
        // Check columns
        for (let col = 0; col < this.gridSize; col++) {
            if (this.grid.every(row => row[col] === 1)) {
                this.clearColumn(col);
                linesCleared++;
            }
        }
        
        if (linesCleared > 0) {
            this.score += linesCleared * 100;
            this.updateScore();
            this.playSound(this.lineClearSound);
        }
    }
    
    clearRow(row) {
        this.grid[row] = Array(this.gridSize).fill(0);
    }
    
    clearColumn(col) {
        for (let row = 0; row < this.gridSize; row++) {
            this.grid[row][col] = 0;
        }
    }
    
    isGameOver() {
        // Check if any of the current blocks can be placed
        for (const block of this.currentBlocks) {
            if (block.used) continue;
            
            for (let row = 0; row < this.gridSize; row++) {
                for (let col = 0; col < this.gridSize; col++) {
                    if (this.canPlaceBlock(block.shape, col, row)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    endGame() {
        this.gameOver = true;
        this.finalScoreElement.textContent = this.score;
        
        // Check if score qualifies for leaderboard
        const leaderboard = this.getLeaderboard();
        const isTopScore = leaderboard.length < 5 || this.score > leaderboard[leaderboard.length - 1].score;
        
        if (isTopScore) {
            document.getElementById('leaderboardEntry').style.display = 'block';
        } else {
            document.getElementById('leaderboardEntry').style.display = 'none';
        }
        
        this.gameOverlay.style.display = 'flex';
    }
    
    restartGame() {
        this.gameOverlay.style.display = 'none';
        this.initializeGame();
    }
    
    saveScore() {
        const playerName = document.getElementById('playerName').value.trim();
        if (!playerName) {
            alert('Please enter your name!');
            return;
        }
        
        const leaderboard = this.getLeaderboard();
        leaderboard.push({ name: playerName, score: this.score });
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard.splice(5); // Keep only top 5
        
        localStorage.setItem('woodBlockPuzzleLeaderboard', JSON.stringify(leaderboard));
        this.loadLeaderboard();
        document.getElementById('leaderboardEntry').style.display = 'none';
    }
    
    getLeaderboard() {
        const stored = localStorage.getItem('woodBlockPuzzleLeaderboard');
        return stored ? JSON.parse(stored) : [];
    }
    
    loadLeaderboard() {
        const leaderboard = this.getLeaderboard();
        this.leaderboardList.innerHTML = '';
        
        leaderboard.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `${entry.name}: ${entry.score}`;
            this.leaderboardList.appendChild(li);
        });
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.ctx.strokeStyle = '#D2B48C';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i <= this.gridSize; i++) {
            const pos = i * this.cellSize;
            this.ctx.beginPath();
            this.ctx.moveTo(pos, 0);
            this.ctx.lineTo(pos, this.canvas.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, pos);
            this.ctx.lineTo(this.canvas.width, pos);
            this.ctx.stroke();
        }
        
        // Draw placed blocks
        this.ctx.fillStyle = '#8B4513';
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 2;
        
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.grid[row][col] === 1) {
                    const x = col * this.cellSize;
                    const y = row * this.cellSize;
                    
                    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
                    this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);
                    
                    // Add wood grain effect
                    this.ctx.strokeStyle = '#654321';
                    this.ctx.lineWidth = 1;
                    for (let i = 0; i < 3; i++) {
                        const grainY = y + (i + 1) * (this.cellSize / 4);
                        this.ctx.beginPath();
                        this.ctx.moveTo(x + 2, grainY);
                        this.ctx.lineTo(x + this.cellSize - 2, grainY);
                        this.ctx.stroke();
                    }
                    this.ctx.strokeStyle = '#654321';
                    this.ctx.lineWidth = 2;
                }
            }
        }
    }
    
    startBackgroundMusic() {
        if (this.musicEnabled) {
            this.backgroundMusic.volume = 0.3;
            // Try to play, but don't show errors if it fails due to autoplay restrictions
            this.backgroundMusic.play().catch(e => {
                console.log('Background music will start after user interaction');
            });
        }
    }
    
    enableAudio() {
        // This method will be called after user interaction
        if (this.musicEnabled && this.backgroundMusic.paused) {
            this.backgroundMusic.play().catch(e => {
                console.log('Could not play background music:', e);
            });
        }
    }
    
    playSound(audioElement) {
        if (this.soundEnabled && audioElement) {
            audioElement.currentTime = 0;
            audioElement.play().catch(e => {
                console.log('Could not play sound:', e);
            });
        }
    }
    
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        const button = document.getElementById('toggleMusic');
        
        if (this.musicEnabled) {
            button.textContent = '🎵 Music: ON';
            button.classList.remove('active');
            this.startBackgroundMusic();
        } else {
            button.textContent = '🎵 Music: OFF';
            button.classList.add('active');
            this.backgroundMusic.pause();
        }
    }
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const button = document.getElementById('toggleSound');
        
        if (this.soundEnabled) {
            button.textContent = '🔊 Sound: ON';
            button.classList.remove('active');
        } else {
            button.textContent = '🔊 Sound: OFF';
            button.classList.add('active');
        }
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new WoodBlockPuzzle();
});
