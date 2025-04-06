// 喵咪图床应用程序主脚本

// 配置参数
const config = {
    // Cloudflare Worker API地址
    apiUrl: 'https://images.jeffreyy.workers.dev',
    // 猫咪表情数组，用于随机显示
    catEmojis: ['😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🐱', '🐈', '🐾'],
    // 猫咪鼓励语
    catPhrases: [
        '喵~上传成功了呢！',
        '完美的文件，喵星人很满意！',
        '喵喵喵，上传真顺利！',
        '铲屎官辛苦了，文件已上传喵~',
        '猫咪点赞，文件已保存！',
        '喵星人表示很满意这个文件！',
        '毛茸茸的文件已经保存啦！',
        '喵呜~文件已经安全地存进猫窝了！'
    ],
    // 文件类型图标映射
    fileTypeIcons: {
        'doc': 'bxs-file-doc',
        'docx': 'bxs-file-doc',
        'xls': 'bxs-file-doc',
        'xlsx': 'bxs-file-doc',
        'ppt': 'bxs-file-doc',
        'pptx': 'bxs-file-doc',
        'pdf': 'bxs-file-pdf',
        'zip': 'bxs-file-archive',
        'rar': 'bxs-file-archive',
        '7z': 'bxs-file-archive',
        'tar': 'bxs-file-archive',
        'gz': 'bxs-file-archive',
        'mp3': 'bxs-file-plus',
        'wav': 'bxs-file-plus',
        'mp4': 'bxs-file-plus',
        'mov': 'bxs-file-plus',
        'avi': 'bxs-file-plus',
        'html': 'bxs-file-html',
        'css': 'bxs-file-css',
        'js': 'bxs-file-js',
        'ts': 'bxs-file-js',
        'json': 'bxs-file-json',
        'xml': 'bxs-file-json',
        'txt': 'bxs-file-txt',
        'md': 'bxs-file-md',
        'jpg': 'bxs-file-image',
        'jpeg': 'bxs-file-image',
        'png': 'bxs-file-image',
        'gif': 'bxs-file-image',
        'svg': 'bxs-file-image',
        'webp': 'bxs-file-image'
    },
    // 文件类型名称映射
    fileTypeNames: {
        'doc': '文档',
        'docx': '文档',
        'xls': '表格',
        'xlsx': '表格',
        'ppt': '演示',
        'pptx': '演示',
        'pdf': 'PDF',
        'zip': '压缩包',
        'rar': '压缩包',
        '7z': '压缩包',
        'tar': '压缩包',
        'gz': '压缩包',
        'mp3': '音频',
        'wav': '音频',
        'mp4': '视频',
        'mov': '视频',
        'avi': '视频',
        'html': 'HTML',
        'css': 'CSS',
        'js': 'JS脚本',
        'ts': 'TS脚本',
        'json': 'JSON',
        'xml': 'XML',
        'txt': '文本',
        'md': 'Markdown',
        'jpg': '图片',
        'jpeg': '图片',
        'png': '图片',
        'gif': '图片',
        'svg': '矢量图',
        'webp': '图片'
    }
};

// DOM元素
const elements = {
    statusPanel: document.getElementById('statusPanel'),
    repoInfo: document.getElementById('repoInfo'),
    repoSizeValue: document.getElementById('repoSizeValue'),
    repoSizeBar: document.getElementById('repoSizeBar'),
    repoSizeWarning: document.getElementById('repoSizeWarning'),
    uploadArea: document.getElementById('uploadArea'),
    fileInput: document.getElementById('fileInput'),
    fileList: document.getElementById('fileList'),
    fileCount: document.getElementById('fileCount'),
    uploadBtn: document.getElementById('uploadBtn'),
    clearBtn: document.getElementById('clearBtn'),
    resultList: document.getElementById('resultList'),
    copyAllBtn: document.getElementById('copyAllBtn'),
    viewToggleBtns: document.querySelectorAll('.toggle-btn'),
    views: document.querySelectorAll('.view'),
    galleryList: document.getElementById('galleryList'),
    galleryLoading: document.getElementById('galleryLoading'),
    galleryEmpty: document.getElementById('galleryEmpty'),
    galleryError: document.getElementById('galleryError'),
    galleryErrorMsg: document.getElementById('galleryErrorMsg'),
    refreshGalleryBtn: document.getElementById('refreshGalleryBtn'),
    
    // 文件直链相关元素
    filesUploadArea: document.getElementById('filesUploadArea'),
    filesInput: document.getElementById('filesInput'),
    filesFileList: document.getElementById('filesFileList'),
    filesCount: document.getElementById('filesCount'),
    filesUploadBtn: document.getElementById('filesUploadBtn'),
    filesClearBtn: document.getElementById('filesClearBtn'),
    filesResultList: document.getElementById('filesResultList'),
    filesCopyAllBtn: document.getElementById('filesCopyAllBtn')
};

// 状态变量
let uploadQueue = [];
let uploadResults = [];
let currentGalleryImages = [];
let isUploading = false;

// 文件直链状态变量
let filesUploadQueue = [];
let filesUploadResults = [];
let isFilesUploading = false;

// 获取随机猫咪表情
function getRandomCatEmoji() {
    const randomIndex = Math.floor(Math.random() * config.catEmojis.length);
    return config.catEmojis[randomIndex];
}

// 获取随机猫咪鼓励语
function getRandomCatPhrase() {
    const randomIndex = Math.floor(Math.random() * config.catPhrases.length);
    return config.catPhrases[randomIndex];
}

// 初始化应用
function initApp() {
    // 绑定事件
    bindEvents();
    
    // 获取仓库配置信息
    fetchRepoConfig();
    
    // 添加猫咪动画
    addCatAnimation();
}

// 添加猫咪动画
function addCatAnimation() {
    // 检查是否已存在
    if (document.getElementById('cat-paw-animation')) {
        return;
    }
    
    // 创建猫爪元素
    const catPaw = document.createElement('div');
    catPaw.id = 'cat-paw-animation';
    catPaw.style.cssText = `
        position: fixed;
        bottom: -100px;
        right: 50px;
        width: 80px;
        height: 80px;
        background-image: url('https://cdn.jsdelivr.net/gh/cat-storage/images@main/cat-paw.png');
        background-size: contain;
        background-repeat: no-repeat;
        z-index: 9999;
        opacity: 0;
        transition: all 0.5s ease;
        pointer-events: none;
    `;
    
    // 添加到页面
    document.body.appendChild(catPaw);
}

// 显示猫爪动画
function showCatPaw() {
    const catPaw = document.getElementById('cat-paw-animation');
    
    // 如果不存在，创建猫爪元素
    if (!catPaw) {
        addCatAnimation();
        return setTimeout(showCatPaw, 100);
    }
    
    // 显示猫爪
    catPaw.style.bottom = '50px';
    catPaw.style.opacity = '1';
    
    // 几秒后隐藏
    setTimeout(() => {
        catPaw.style.bottom = '-100px';
        catPaw.style.opacity = '0';
    }, 1500);
}

// 绑定事件处理
function bindEvents() {
    // 上传区域点击事件
    elements.uploadArea.addEventListener('click', () => {
        elements.fileInput.click();
    });
    
    // 文件输入变化事件
    elements.fileInput.addEventListener('change', handleFileSelect);
    
    // 拖放事件
    elements.uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        elements.uploadArea.classList.add('dragover');
        elements.uploadArea.querySelector('i').textContent = '😻'; // 猫咪高兴表情
    });
    
    elements.uploadArea.addEventListener('dragleave', () => {
        elements.uploadArea.classList.remove('dragover');
        elements.uploadArea.querySelector('i').textContent = ''; // 恢复原样
    });
    
    elements.uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        elements.uploadArea.classList.remove('dragover');
        elements.uploadArea.querySelector('i').textContent = '';
        
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
            // 播放猫咪音效
            const meow = new Audio('https://cdn.jsdelivr.net/gh/cat-storage/sounds@main/meow-short.mp3');
            meow.volume = 0.2;
            meow.play().catch(e => console.log('自动播放受限:', e));
        }
    });
    
    // 上传和清空按钮事件
    elements.uploadBtn.addEventListener('click', startUpload);
    elements.clearBtn.addEventListener('click', clearFileList);
    
    // 复制所有链接按钮事件
    elements.copyAllBtn.addEventListener('click', copyAllLinks);

    // 视图切换按钮事件
    elements.viewToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const viewName = btn.getAttribute('data-view');
            switchView(viewName);
            
            // 如果切换到图库视图，加载图库
            if (viewName === 'gallery' && elements.galleryList.children.length === 0) {
                loadGallery();
            }
            
            // 播放猫咪音效
            const meow = new Audio('https://cdn.jsdelivr.net/gh/cat-storage/sounds@main/meow-short.mp3');
            meow.volume = 0.2;
            meow.play().catch(e => console.log('自动播放受限:', e));
        });
    });
    
    // 刷新图库按钮事件
    elements.refreshGalleryBtn.addEventListener('click', loadGallery);
    
    // 文件直链相关事件绑定
    // 文件上传区域点击事件
    elements.filesUploadArea.addEventListener('click', () => {
        elements.filesInput.click();
    });
    
    // 文件输入变化事件
    elements.filesInput.addEventListener('change', handleFilesSelect);
    
    // 文件拖放事件
    elements.filesUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        elements.filesUploadArea.classList.add('dragover');
        elements.filesUploadArea.querySelector('i').textContent = '😻'; // 猫咪高兴表情
    });
    
    elements.filesUploadArea.addEventListener('dragleave', () => {
        elements.filesUploadArea.classList.remove('dragover');
        elements.filesUploadArea.querySelector('i').textContent = ''; // 恢复原样
    });
    
    elements.filesUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        elements.filesUploadArea.classList.remove('dragover');
        elements.filesUploadArea.querySelector('i').textContent = '';
        
        if (e.dataTransfer.files.length > 0) {
            handleFilesSelect({ target: { files: e.dataTransfer.files } });
            // 播放猫咪音效
            playCatSound();
        }
    });
    
    // 文件上传和清空按钮事件
    elements.filesUploadBtn.addEventListener('click', startFilesUpload);
    elements.filesClearBtn.addEventListener('click', clearFilesUploadList);
    
    // 复制所有文件链接按钮事件
    elements.filesCopyAllBtn.addEventListener('click', copyAllFilesLinks);
}

// 切换视图
function switchView(viewName) {
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelectorAll('.view').forEach(v => {
        v.classList.remove('active');
    });
    
    document.querySelector(`.toggle-btn[data-view="${viewName}"]`).classList.add('active');
    document.querySelector(`.${viewName}-view`).classList.add('active');
    
    if (viewName === 'gallery') {
        loadGallery();
        // 添加喵星人动画
        addCatAnimation();
    }
}

// 获取仓库配置信息
async function fetchRepoConfig() {
    try {
        const response = await fetch(`${config.apiUrl}/config`);
        
        if (!response.ok) {
            throw new Error('无法获取仓库信息');
        }
        
        const data = await response.json();
        
        // 更新仓库信息显示
        updateRepoInfo(data);
        
        // 显示仓库信息面板
        elements.repoInfo.hidden = false;
    } catch (error) {
        console.error('获取仓库信息失败:', error);
        elements.statusPanel.querySelector('.status-info span').textContent = `服务连接错误: ${error.message}`;
        elements.statusPanel.querySelector('.status-info i').className = 'bx bx-error-circle';
        elements.statusPanel.querySelector('.status-info i').style.color = 'var(--danger-color)';
    }
}

// 更新仓库信息显示
function updateRepoInfo(data) {
    // 更新仓库大小显示
    elements.repoSizeValue.textContent = `${data.repoSizeMB} MB`;
    
    // 计算百分比
    const percentUsed = Math.min((data.repoSize / (1024 * 1024)) * 100, 100);
    elements.repoSizeBar.style.width = `${percentUsed}%`;
    
    // 根据使用比例设置颜色
    if (percentUsed >= 90) {
        elements.repoSizeBar.style.backgroundColor = 'var(--danger-color)';
        elements.repoSizeWarning.hidden = false;
    } else if (percentUsed >= 70) {
        elements.repoSizeBar.style.backgroundColor = 'var(--warning-color)';
        elements.repoSizeWarning.hidden = false;
    } else {
        elements.repoSizeBar.style.backgroundColor = 'var(--primary-color)';
        elements.repoSizeWarning.hidden = true;
    }
}

// 处理文件选择
function handleFileSelect(e) {
    if (e.target.files.length > 0) {
        handleFiles(e.target.files);
    }
}

// 处理文件
function handleFiles(files) {
    // 筛选图片文件
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
        showNotification('喵？这不是图片文件哦，请选择图片喵~', 'error');
        return;
    }
    
    // 添加到上传队列
    imageFiles.forEach(file => {
        // 检查文件是否已在队列中
        const isExist = uploadQueue.some(item => 
            item.name === file.name && 
            item.size === file.size && 
            item.lastModified === file.lastModified
        );
        
        if (!isExist) {
            uploadQueue.push(file);
        }
    });
    
    // 更新文件列表显示
    updateFileList();
    
    // 显示上传预览
    document.querySelector('.upload-preview').hidden = false;
    
    // 显示猫咪消息
    if (imageFiles.length > 0) {
        showNotification(`喵~ 已添加${imageFiles.length}张照片到上传队列 ${getRandomCatEmoji()}`, 'success');
    }
}

// 更新文件列表显示
function updateFileList() {
    // 更新文件计数
    elements.fileCount.textContent = uploadQueue.length;
    
    // 清空当前列表
    elements.fileList.innerHTML = '';
    
    // 添加文件项
    uploadQueue.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        // 格式化文件大小
        const formattedSize = formatFileSize(file.size);
        
        fileItem.innerHTML = `
            <i class='bx bx-image file-icon'></i>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formattedSize}</div>
            </div>
            <i class='bx bx-x file-remove' data-index="${index}"></i>
        `;
        
        elements.fileList.appendChild(fileItem);
    });
    
    // 绑定移除按钮事件
    document.querySelectorAll('.file-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            removeFile(index);
        });
    });
    
    // 更新上传按钮状态
    elements.uploadBtn.disabled = uploadQueue.length === 0;
}

// 移除文件
function removeFile(index) {
    uploadQueue.splice(index, 1);
    updateFileList();
    
    // 如果队列为空，隐藏上传预览
    if (uploadQueue.length === 0) {
        document.querySelector('.upload-preview').hidden = true;
    }
}

// 清空文件列表
function clearFileList() {
    uploadQueue = [];
    updateFileList();
    document.querySelector('.upload-preview').hidden = true;
}

// 开始上传
async function startUpload() {
    if (uploadQueue.length === 0 || isUploading) {
        return;
    }
    
    isUploading = true;
    elements.uploadBtn.disabled = true;
    elements.uploadBtn.textContent = '上传中...喵~';
    
    // 显示结果区域
    document.querySelector('.results').hidden = false;
    
    // 清空结果列表
    elements.resultList.innerHTML = '';
    
    // 清空结果数组
    uploadResults = [];
    
    // 显示猫咪提示
    showNotification(`喵呜~ 正在上传${uploadQueue.length}张照片，请稍等... ${getRandomCatEmoji()}`, 'info');
    
    // 逐个上传文件
    for (let i = 0; i < uploadQueue.length; i++) {
        const file = uploadQueue[i];
        await uploadFile(file, i);
    }
    
    // 更新仓库信息
    fetchRepoConfig();
    
    // 恢复上传按钮状态
    isUploading = false;
    elements.uploadBtn.disabled = false;
    elements.uploadBtn.textContent = '开始上传';
    
    // 清空上传队列
    uploadQueue = [];
    document.querySelector('.upload-preview').hidden = true;
    
    // 全部上传完成的提示
    if (uploadResults.filter(r => r.status === 'success').length > 0) {
        showNotification(getRandomCatPhrase(), 'success');
    }
}

// 上传文件
async function uploadFile(file, index) {
    // 创建FormData
    const formData = new FormData();
    formData.append('file', file);
    
    // 创建结果项
    const resultItem = document.createElement('div');
    resultItem.id = `result-${index}`;
    resultItem.className = 'result-item loading';
    resultItem.innerHTML = `
        <div class="result-info">
            <div class="result-filename">${file.name}</div>
            <div class="result-progress">
                <span class="progress-message">喵呜~ 努力上传中...</span>
                <div class="progress-bar">
                    <div class="progress-inner"></div>
                </div>
            </div>
        </div>
    `;
    elements.resultList.appendChild(resultItem);
    
    try {
        const startTime = Date.now();
        
        // 显示随机的猫咪上传消息
        const progressMessages = [
            '喵喵~正在努力上传...',
            '小猫咪加速中...',
            '图片即将送达猫窝...',
            '猫爪按下上传按钮...',
            '正用猫咪搬运图片...',
            '小猫咪正在打包图片...'
        ];
        
        // 创建随机进度更新
        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            const progressInner = resultItem.querySelector('.progress-inner');
            const progressMessage = resultItem.querySelector('.progress-message');
            
            // 随机更新进度
            if (elapsed < 10000) {  // 10秒内
                const progress = Math.min(95, elapsed / 100 + Math.random() * 10);
                progressInner.style.width = `${progress}%`;
                
                // 随机更新消息
                if (Math.random() > 0.9) {
                    progressMessage.textContent = progressMessages[Math.floor(Math.random() * progressMessages.length)];
                }
                
                progressTimer = setTimeout(updateProgress, 200 + Math.random() * 500);
            }
        };
        
        // 开始进度更新
        let progressTimer = setTimeout(updateProgress, 200);
        
        // 发送请求
        const response = await fetch(`${config.apiUrl}/upload`, {
            method: 'POST',
            body: formData,
        });
        
        // 清除进度更新
        clearTimeout(progressTimer);
        
        if (!response.ok) {
            throw new Error(`喵呜~ 上传失败了: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.error) {
            throw new Error(result.error);
        }
        
        // 添加原始文件对象到结果，用于生成缩略图
        result.file = file;
        result.status = 'success';
        
        // 更新上传结果
        uploadResults[index] = result;
        updateResultItem(result, index);
        
        // 播放成功声音
        playCatSound();
        
    } catch (error) {
        console.error('上传失败:', error);
        
        // 更新上传结果
        uploadResults[index] = {
            filename: file.name,
            status: 'error',
            error: error.message || '喵呜~ 上传失败了'
        };
        
        updateResultItem(uploadResults[index], index);
    }
}

// 创建结果项
function createResultItem(result, index) {
    const resultItem = document.createElement('div');
    resultItem.className = `result-item ${result.status}`;
    resultItem.id = `result-${index}`;
    
    if (result.status === 'uploading') {
        resultItem.innerHTML = `
            <div class="result-info">
                <div class="result-filename">${result.filename}</div>
                <div class="result-status">上传中...</div>
            </div>
        `;
    }
    
    elements.resultList.appendChild(resultItem);
    return resultItem;
}

// 更新结果项
function updateResultItem(result, index) {
    const resultItem = document.getElementById(`result-${index}`);
    
    if (!resultItem) return;
    
    resultItem.className = `result-item ${result.status}`;
    
    if (result.status === 'success') {
        // 格式化时间
        const uploadTime = result.uploadTime ? formatDate(new Date(result.uploadTime)) : '刚刚';
        
        // 创建缩略图URL (从文件对象或从jsDelivr链接)
        let thumbnailUrl = '';
        if (result.file) {
            thumbnailUrl = URL.createObjectURL(result.file);
        } else if (result.jsdelivrUrl) {
            thumbnailUrl = result.jsdelivrUrl;
        }
        
        resultItem.innerHTML = `
            <div class="result-thumb-container">
                <img class="result-thumb" src="${thumbnailUrl}" alt="${result.originalFilename || result.filename}" onerror="this.src='https://cdn.jsdelivr.net/gh/cat-storage/images@main/cat-placeholder.jpg'">
                <div class="result-info">
                    <div class="result-filename">${result.originalFilename || result.filename} ${getRandomCatEmoji()}</div>
                    <div class="result-time">上传时间: ${uploadTime}</div>
                </div>
            </div>
            <div class="result-links">
                <div class="link-group">
                    <span class="link-label">jsDelivr:</span>
                    <span class="link-value">${result.jsdelivrUrl}</span>
                    <button class="copy-btn" data-clipboard="${result.jsdelivrUrl}">复制</button>
                </div>
                <div class="link-group">
                    <span class="link-label">GitHub:</span>
                    <span class="link-value">${result.rawUrl}</span>
                    <button class="copy-btn" data-clipboard="${result.rawUrl}">复制</button>
                </div>
            </div>
        `;
        
        // 如果是从文件对象创建的缩略图，需要在适当的时候释放URL
        if (result.file) {
            setTimeout(() => {
                URL.revokeObjectURL(thumbnailUrl);
            }, 5000);
        }
    } else if (result.status === 'error') {
        resultItem.innerHTML = `
            <div class="result-info">
                <div class="result-filename">${result.filename} 😿</div>
                <div class="result-message">${result.error}</div>
            </div>
        `;
    }
    
    // 绑定复制按钮事件
    if (result.status === 'success') {
        resultItem.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const text = this.getAttribute('data-clipboard');
                copyToClipboard(text, this);
            });
        });
    }
}

// 复制到剪贴板
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.textContent;
        button.textContent = '已复制喵~';
        button.classList.add('copied');
        
        // 播放猫咪叫声
        playCatSound();
        
        // 显示猫爪动画
        showCatPaw();
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('复制失败:', err);
        showNotification('喵呜~ 复制失败了，请手动复制吧', 'error');
    });
}

// 复制所有链接
function copyAllLinks() {
    const successResults = uploadResults.filter(result => result.status === 'success');
    
    if (successResults.length === 0) {
        alert('没有可复制的链接');
        return;
    }
    
    // 获取选中的链接类型
    const linkType = document.querySelector('input[name="linkType"]:checked').value;
    
    // 根据不同类型生成链接文本
    let text = '';
    
    for (const result of successResults) {
        const title = result.originalFilename || result.filename;
        
        switch (linkType) {
            case 'markdown':
                text += `![${title}](${result.jsdelivrUrl})\n\n`;
                break;
            case 'html':
                text += `<img src="${result.jsdelivrUrl}" alt="${title}" />\n\n`;
                break;
            case 'url':
                text += `${result.jsdelivrUrl}\n\n`;
                break;
        }
    }
    
    // 复制到剪贴板
    navigator.clipboard.writeText(text.trim()).then(() => {
        const button = elements.copyAllBtn;
        const originalText = button.textContent;
        button.textContent = '已复制';
        button.style.backgroundColor = 'var(--success-color)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
        }, 2000);
    }).catch(err => {
        console.error('复制失败:', err);
        alert('复制失败，请手动复制');
    });
}

// 播放猫咪叫声
function playCatSound() {
    // 随机选择一个猫咪声音
    const catSounds = [
        'https://cdn.jsdelivr.net/gh/cat-storage/sounds@main/meow1.mp3',
        'https://cdn.jsdelivr.net/gh/cat-storage/sounds@main/meow2.mp3',
        'https://cdn.jsdelivr.net/gh/cat-storage/sounds@main/meow3.mp3',
        'https://cdn.jsdelivr.net/gh/cat-storage/sounds@main/purr.mp3'
    ];
    
    const sound = new Audio(catSounds[Math.floor(Math.random() * catSounds.length)]);
    sound.volume = 0.5;
    sound.play().catch(e => console.log('播放声音失败:', e));
}

// 加载图库
async function loadGallery() {
    // 清空图库列表，并显示加载状态
    elements.galleryList.innerHTML = '';
    
    // 创建并添加加载指示器
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-gallery';
    loadingIndicator.innerHTML = `
        <i class='bx bx-loader-alt bx-spin'></i>
        <p>喵呜~ 正在加载猫咪照片墙...</p>
    `;
    elements.galleryList.appendChild(loadingIndicator);
    
    // 添加调试信息
    console.log('开始加载图库，API地址:', `${config.apiUrl}/images`);
    
    // 设置超时
    const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('喵呜~ 加载超时了，网络可能有点问题')), 15000)
    );
    
    try {
        // 同时进行请求和超时检测
        const response = await Promise.race([
            fetch(`${config.apiUrl}/images`),
            timeoutPromise
        ]);
        
        console.log('图库API响应状态:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`喵呜~ 获取照片失败了 (${response.status})`);
        }
        
        const responseText = await response.text();
        console.log('API响应内容:', responseText.substring(0, 200) + '...');
        
        // 尝试解析JSON
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (e) {
            console.error('JSON解析错误:', e);
            throw new Error('喵呜~ 服务器返回了非法的数据格式');
        }
        
        console.log('解析后的数据结构:', Object.keys(result));
        
        // 检查返回数据，处理不同的响应结构
        let images = [];
        
        if (Array.isArray(result)) {
            // 如果直接返回数组
            console.log('API返回了数组格式的数据');
            images = result;
        } else if (result.images && Array.isArray(result.images)) {
            // 如果返回包含images字段的对象
            console.log('API返回了包含images字段的对象');
            images = result.images;
        } else if (typeof result === 'object' && Object.keys(result).length > 0) {
            // 如果返回其他对象结构，尝试转换
            console.log('API返回了其他格式的对象，尝试转换');
            images = Object.values(result).filter(item => 
                item && (item.jsdelivrUrl || item.url || item.download_url)
            );
        }
        
        console.log(`找到 ${images.length} 张图片`);
        
        if (images.length > 0) {
            console.log('第一张图片样例:', images[0]);
        }
        
        // 标准化数据格式
        images = images.map(image => {
            return {
                name: image.name || image.filename || '未命名照片',
                originalFilename: image.originalFilename || image.name || image.filename || '未命名照片',
                jsdelivrUrl: image.jsdelivrUrl || image.url || image.download_url || '',
                uploadTime: image.uploadTime || image.created_at || null
            };
        });
        
        // 保存图片数据
        currentGalleryImages = images;
        
        // 检查是否有图片
        if (currentGalleryImages.length === 0) {
            console.log('没有找到图片');
            
            // 移除加载指示器
            loadingIndicator.remove();
            
            // 显示空状态
            const emptyIndicator = document.createElement('div');
            emptyIndicator.className = 'empty-gallery';
            emptyIndicator.innerHTML = `
                <i class='bx bx-image'></i>
                <p>喵~ 还没有照片呢，快去上传吧！</p>
            `;
            elements.galleryList.appendChild(emptyIndicator);
            
            // 显示友好提示
            showNotification('喵~ 猫窝里还没有照片呢，快去上传吧！', 'info');
            return;
        }
        
        // 渲染图片到图库（保留加载指示器）
        renderGalleryItems(currentGalleryImages, loadingIndicator);
        
    } catch (error) {
        console.error('加载图库失败:', error);
        
        // 清空图库列表，包括加载指示器
        elements.galleryList.innerHTML = '';
        
        // 显示错误消息
        const errorElement = document.createElement('div');
        errorElement.className = 'gallery-error';
        errorElement.innerHTML = `
            <i class='bx bx-error-circle'></i>
            <p>喵呜~ 加载失败了: ${error.message}</p>
            <button id="retryGalleryBtn" class="secondary-btn">重试</button>
            <div style="margin-top: 15px; font-size: 0.8em; color: #888;">
                <details>
                    <summary>技术细节（用于调试）</summary>
                    <p>错误信息: ${error.toString()}</p>
                    <p>API地址: ${config.apiUrl}/images</p>
                    <p>浏览器: ${navigator.userAgent}</p>
                </details>
            </div>
        `;
        elements.galleryList.appendChild(errorElement);
        
        // 添加重试按钮事件
        document.getElementById('retryGalleryBtn')?.addEventListener('click', loadGallery);
        
        // 显示错误通知
        showNotification(`喵呜~ 加载照片失败: ${error.message}`, 'error');
    }
}

// 渲染图库项目（新函数，不会清除加载指示器）
function renderGalleryItems(images, loadingIndicator) {
    console.log(`开始渲染${images.length}张图片`);
    
    // 创建一个文档片段来提高性能
    const fragment = document.createDocumentFragment();
    
    // 跟踪已加载和总图片数
    let loadedCount = 0;
    const totalCount = images.length;
    
    // 更新加载指示器文本
    if (loadingIndicator) {
        const loadingText = loadingIndicator.querySelector('p');
        if (loadingText) {
            loadingText.textContent = `喵呜~ 正在加载${totalCount}张照片...`;
        }
    }
    
    // 图片加载完成处理函数
    const imageLoaded = () => {
        loadedCount++;
        
        // 更新加载指示器进度
        if (loadingIndicator) {
            const loadingText = loadingIndicator.querySelector('p');
            if (loadingText) {
                loadingText.textContent = `喵呜~ 已加载 ${loadedCount}/${totalCount} 张照片...`;
            }
        }
        
        // 所有图片加载完成时
        if (loadedCount === totalCount) {
            console.log('所有图片加载完成');
            
            // 移除加载指示器
            if (loadingIndicator) {
                loadingIndicator.remove();
            }
            
            // 显示成功消息
            showNotification(`喵~ 已成功加载${totalCount}张喵星人照片 ${getRandomCatEmoji()}`, 'success');
        }
    };
    
    // 创建每个图片项
    images.forEach((image, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        // 获取上传时间
        const uploadTime = image.uploadTime 
            ? formatDate(new Date(image.uploadTime))
            : '未知时间';
        
        // 获取原始文件名
        const originalFilename = image.originalFilename || image.name;
        
        // 随机挑选一个猫咪表情
        const catEmoji = getRandomCatEmoji();
        
        // 设置HTML内容
        galleryItem.innerHTML = `
            <div class="gallery-img-container">
                <div class="gallery-img-loading">
                    <i class='bx bx-loader-alt bx-spin'></i>
                </div>
                <img class="gallery-img" src="${image.jsdelivrUrl}" alt="${originalFilename}" style="opacity: 0; transition: opacity 0.3s ease;" onerror="this.src='https://cdn.jsdelivr.net/gh/cat-storage/images@main/cat-placeholder.jpg'; this.style.opacity = 1; this.parentNode.querySelector('.gallery-img-loading')?.remove();">
                <div class="gallery-img-actions">
                    <div class="gallery-img-action" title="复制链接" data-action="copy" data-index="${index}">
                        <i class='bx bx-link'></i>
                    </div>
                </div>
            </div>
            <div class="gallery-item-info">
                <div class="gallery-item-filename" title="${originalFilename}">${originalFilename} ${catEmoji}</div>
                <div class="gallery-item-time">${uploadTime}</div>
            </div>
        `;
        
        // 添加图片加载事件
        const img = galleryItem.querySelector('.gallery-img');
        img.onload = () => {
            // 图片加载成功
            img.style.opacity = '1';
            const loadingEl = img.parentNode.querySelector('.gallery-img-loading');
            if (loadingEl) loadingEl.remove();
            imageLoaded();
        };
        
        img.onerror = () => {
            // 图片加载失败
            const loadingEl = img.parentNode.querySelector('.gallery-img-loading');
            if (loadingEl) loadingEl.remove();
            imageLoaded();
        };
        
        // 添加到文档片段
        fragment.appendChild(galleryItem);
    });
    
    // 将所有元素添加到DOM
    elements.galleryList.appendChild(fragment);
    
    // 绑定图库操作事件
    document.querySelectorAll('.gallery-img-action').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            const index = parseInt(btn.getAttribute('data-index'));
            
            if (action === 'copy') {
                copyImageLink(index);
            }
        });
    });
}

// 复制图片链接
function copyImageLink(index) {
    const image = currentGalleryImages[index];
    if (!image) return;
    
    // 创建临时输入框
    const input = document.createElement('input');
    input.value = image.jsdelivrUrl;
    document.body.appendChild(input);
    input.select();
    
    // 复制并删除输入框
    document.execCommand('copy');
    document.body.removeChild(input);
    
    // 播放猫咪叫声
    playCatSound();
    
    // 显示猫爪动画
    showCatPaw();
    
    // 显示提示
    showNotification(`喵~ 已复制链接到剪贴板 ${getRandomCatEmoji()}`, 'success');
}

// 工具函数：格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 工具函数：格式化日期
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 显示提示消息
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `cat-notification ${type}`;
    
    // 根据类型选择图标
    let icon = '';
    switch (type) {
        case 'success':
            icon = '😸';
            break;
        case 'error':
            icon = '😿';
            break;
        case 'info':
        default:
            icon = '😺';
            break;
    }
    
    notification.innerHTML = `
        <span class="cat-notification-icon">${icon}</span>
        <span class="cat-notification-message">${message}</span>
    `;
    
    // 添加样式
    const style = document.createElement('style');
    if (!document.querySelector('#cat-notification-styles')) {
        style.id = 'cat-notification-styles';
        style.textContent = `
            .cat-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                min-width: 250px;
                max-width: 350px;
                padding: 12px 20px;
                border-radius: 30px;
                background-color: white;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
                z-index: 9999;
                display: flex;
                align-items: center;
                animation: slideIn 0.3s ease, fadeOut 0.5s ease 3s forwards;
                transform-origin: top right;
            }
            .cat-notification.success {
                background-color: rgba(134, 193, 102, 0.2);
                border-left: 3px solid #86C166;
            }
            .cat-notification.error {
                background-color: rgba(255, 118, 117, 0.2);
                border-left: 3px solid #FF7675;
            }
            .cat-notification.info {
                background-color: rgba(165, 222, 229, 0.2);
                border-left: 3px solid #A5DEE5;
            }
            .cat-notification-icon {
                font-size: 1.5rem;
                margin-right: 10px;
            }
            .cat-notification-message {
                font-size: 0.95rem;
                color: var(--dark-color);
                flex: 1;
            }
            @keyframes slideIn {
                from { transform: translateX(100%) scale(0.8); opacity: 0; }
                to { transform: translateX(0) scale(1); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; transform: translateX(0) scale(1); }
                to { opacity: 0; transform: translateX(10%) scale(0.9); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 几秒后删除
    setTimeout(() => {
        notification.remove();
    }, 3500);
}

// 文件处理的辅助函数

// 获取文件扩展名
function getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
}

// 获取文件类型图标
function getFileIcon(filename) {
    const ext = getFileExtension(filename);
    return config.fileTypeIcons[ext] || 'bxs-file';
}

// 获取文件类型名称
function getFileTypeName(filename) {
    const ext = getFileExtension(filename);
    return config.fileTypeNames[ext] || '文件';
}

// 获取文件图标的CSS类
function getFileIconClass(filename) {
    const ext = getFileExtension(filename);
    
    if (ext.match(/^(jpg|jpeg|png|gif|bmp|webp|svg)$/)) {
        return 'image';
    } else if (ext.match(/^(doc|docx|txt|rtf|odt|md)$/)) {
        return 'doc';
    } else if (ext.match(/^(pdf)$/)) {
        return 'pdf';
    } else if (ext.match(/^(zip|rar|7z|tar|gz)$/)) {
        return 'zip';
    } else if (ext.match(/^(html|htm|css|js|ts|json|xml)$/)) {
        return 'code';
    } else if (ext.match(/^(mp3|wav|ogg|flac|aac)$/)) {
        return 'audio';
    } else if (ext.match(/^(mp4|avi|mov|wmv|flv|mkv)$/)) {
        return 'video';
    }
    
    return 'default';
}

// 处理文件上传选择 (任意文件)
function handleFilesSelect(e) {
    if (e.target.files.length > 0) {
        handleFilesUpload(e.target.files);
    }
}

// 处理文件上传 (任意文件)
function handleFilesUpload(files) {
    if (files.length === 0) {
        return;
    }
    
    // 添加到上传队列
    Array.from(files).forEach(file => {
        // 检查文件是否已在队列中
        const isExist = filesUploadQueue.some(item => 
            item.name === file.name && 
            item.size === file.size && 
            item.lastModified === file.lastModified
        );
        
        if (!isExist) {
            filesUploadQueue.push(file);
        }
    });
    
    // 更新文件列表显示
    updateFilesUploadList();
    
    // 显示上传预览
    document.querySelector('.files-upload-preview').hidden = false;
    
    // 显示猫咪消息
    showNotification(`喵~ 已添加${files.length}个文件到上传队列 ${getRandomCatEmoji()}`, 'success');
}

// 更新文件上传列表显示 (任意文件)
function updateFilesUploadList() {
    // 更新文件计数
    elements.filesCount.textContent = filesUploadQueue.length;
    
    // 清空当前列表
    elements.filesFileList.innerHTML = '';
    
    // 添加文件项
    filesUploadQueue.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        // 格式化文件大小
        const formattedSize = formatFileSize(file.size);
        
        // 获取文件图标
        const iconClass = getFileIconClass(file.name);
        const fileIcon = getFileIcon(file.name);
        
        fileItem.innerHTML = `
            <i class='bx ${fileIcon} file-icon ${iconClass}'></i>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formattedSize} <span class="file-type-tag">${getFileTypeName(file.name)}</span></div>
            </div>
            <i class='bx bx-x file-remove' data-index="${index}"></i>
        `;
        
        elements.filesFileList.appendChild(fileItem);
    });
    
    // 绑定移除按钮事件
    elements.filesFileList.querySelectorAll('.file-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            removeFilesUpload(index);
        });
    });
    
    // 更新上传按钮状态
    elements.filesUploadBtn.disabled = filesUploadQueue.length === 0;
}

// 移除文件 (任意文件)
function removeFilesUpload(index) {
    filesUploadQueue.splice(index, 1);
    updateFilesUploadList();
    
    // 如果队列为空，隐藏上传预览
    if (filesUploadQueue.length === 0) {
        document.querySelector('.files-upload-preview').hidden = true;
    }
}

// 清空文件列表 (任意文件)
function clearFilesUploadList() {
    filesUploadQueue = [];
    updateFilesUploadList();
    document.querySelector('.files-upload-preview').hidden = true;
    
    // 显示猫咪消息
    showNotification(`喵~ 已清空上传队列 ${getRandomCatEmoji()}`, 'info');
}

// 复制所有文件链接
function copyAllFilesLinks() {
    const successResults = filesUploadResults.filter(result => result.status === 'success');
    
    if (successResults.length === 0) {
        showNotification('喵呜~ 没有可复制的链接', 'error');
        return;
    }
    
    // 获取选中的链接类型
    const linkType = document.querySelector('input[name="filesLinkType"]:checked').value;
    
    // 根据不同类型生成链接文本
    let text = '';
    
    for (const result of successResults) {
        const title = result.originalFilename || result.filename;
        
        switch (linkType) {
            case 'markdown':
                text += `[${title}](${result.jsdelivrUrl})\n\n`;
                break;
            case 'html':
                text += `<a href="${result.jsdelivrUrl}" target="_blank">${title}</a>\n\n`;
                break;
            case 'url':
                text += `${result.jsdelivrUrl}\n\n`;
                break;
        }
    }
    
    // 复制到剪贴板
    navigator.clipboard.writeText(text.trim()).then(() => {
        const button = elements.filesCopyAllBtn;
        const originalText = button.textContent;
        button.textContent = '已复制喵~';
        button.style.backgroundColor = 'var(--success-color)';
        
        // 播放猫咪音效
        playCatSound();
        // 显示猫爪动画
        showCatPaw();
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
        }, 2000);
        
        // 显示提示
        showNotification(`喵~ 已复制${successResults.length}个文件链接 ${getRandomCatEmoji()}`, 'success');
    }).catch(err => {
        console.error('复制失败:', err);
        showNotification('喵呜~ 复制失败了，请手动复制', 'error');
    });
}

// 开始文件上传 (任意文件)
async function startFilesUpload() {
    if (filesUploadQueue.length === 0 || isFilesUploading) {
        return;
    }
    
    isFilesUploading = true;
    elements.filesUploadBtn.disabled = true;
    elements.filesUploadBtn.textContent = '上传中...喵~';
    
    // 显示结果区域
    document.querySelector('.files-results').hidden = false;
    
    // 清空结果列表
    elements.filesResultList.innerHTML = '';
    
    // 清空结果数组
    filesUploadResults = [];
    
    // 显示猫咪提示
    showNotification(`喵呜~ 正在上传${filesUploadQueue.length}个文件，请稍等... ${getRandomCatEmoji()}`, 'info');
    
    // 逐个上传文件
    for (let i = 0; i < filesUploadQueue.length; i++) {
        const file = filesUploadQueue[i];
        await uploadGenericFile(file, i);
    }
    
    // 更新仓库信息
    fetchRepoConfig();
    
    // 恢复上传按钮状态
    isFilesUploading = false;
    elements.filesUploadBtn.disabled = false;
    elements.filesUploadBtn.textContent = '开始上传';
    
    // 清空上传队列
    filesUploadQueue = [];
    document.querySelector('.files-upload-preview').hidden = true;
    
    // 全部上传完成的提示
    if (filesUploadResults.filter(r => r.status === 'success').length > 0) {
        showNotification(getRandomCatPhrase(), 'success');
    }
}

// 上传任意文件
async function uploadGenericFile(file, index) {
    // 创建FormData
    const formData = new FormData();
    formData.append('file', file);
    
    // 创建结果项
    const resultItem = document.createElement('div');
    resultItem.id = `files-result-${index}`;
    resultItem.className = 'result-item loading';
    
    // 获取文件图标
    const fileIcon = getFileIcon(file.name);
    
    resultItem.innerHTML = `
        <div class="result-info">
            <div class="result-filename">
                <i class='bx ${fileIcon}'></i> ${file.name}
            </div>
            <div class="result-progress">
                <span class="progress-message">喵呜~ 努力上传中...</span>
                <div class="progress-bar">
                    <div class="progress-inner"></div>
                </div>
            </div>
        </div>
    `;
    elements.filesResultList.appendChild(resultItem);
    
    try {
        const startTime = Date.now();
        
        // 显示随机的猫咪上传消息
        const progressMessages = [
            '喵喵~正在努力上传...',
            '小猫咪加速中...',
            '文件即将送达猫窝...',
            '猫爪按下上传按钮...',
            '正用猫咪搬运文件...',
            '小猫咪正在打包文件...'
        ];
        
        // 创建随机进度更新
        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            const progressInner = resultItem.querySelector('.progress-inner');
            const progressMessage = resultItem.querySelector('.progress-message');
            
            // 随机更新进度
            if (elapsed < 10000) {  // 10秒内
                const progress = Math.min(95, elapsed / 100 + Math.random() * 10);
                progressInner.style.width = `${progress}%`;
                
                // 随机更新消息
                if (Math.random() > 0.9) {
                    progressMessage.textContent = progressMessages[Math.floor(Math.random() * progressMessages.length)];
                }
                
                progressTimer = setTimeout(updateProgress, 200 + Math.random() * 500);
            }
        };
        
        // 开始进度更新
        let progressTimer = setTimeout(updateProgress, 200);
        
        // 发送请求
        const response = await fetch(`${config.apiUrl}/upload`, {
            method: 'POST',
            body: formData,
        });
        
        // 清除进度更新
        clearTimeout(progressTimer);
        
        if (!response.ok) {
            throw new Error(`喵呜~ 上传失败了: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.error) {
            throw new Error(result.error);
        }
        
        // 添加原始文件对象到结果，用于记录文件类型
        result.file = file;
        result.status = 'success';
        result.fileType = getFileTypeName(file.name);
        result.fileIcon = getFileIcon(file.name);
        
        // 更新上传结果
        filesUploadResults[index] = result;
        updateFilesResultItem(result, index);
        
        // 播放成功声音
        playCatSound();
        
    } catch (error) {
        console.error('上传失败:', error);
        
        // 更新上传结果
        filesUploadResults[index] = {
            filename: file.name,
            status: 'error',
            error: error.message || '喵呜~ 上传失败了',
            fileIcon: getFileIcon(file.name)
        };
        
        updateFilesResultItem(filesUploadResults[index], index);
    }
}

// 更新文件上传结果项
function updateFilesResultItem(result, index) {
    const resultItem = document.getElementById(`files-result-${index}`);
    
    if (!resultItem) return;
    
    resultItem.className = `result-item ${result.status}`;
    
    if (result.status === 'success') {
        // 格式化时间
        const uploadTime = result.uploadTime ? formatDate(new Date(result.uploadTime)) : '刚刚';
        
        // 文件类型
        const fileType = result.fileType || getFileTypeName(result.filename);
        
        resultItem.innerHTML = `
            <div class="result-thumb-container">
                <div class="file-result-icon">
                    <i class='bx ${result.fileIcon || getFileIcon(result.filename)}'></i>
                </div>
                <div class="result-info">
                    <div class="result-filename">${result.originalFilename || result.filename} ${getRandomCatEmoji()}</div>
                    <div class="result-time">上传时间: ${uploadTime} <span class="file-type-tag">${fileType}</span></div>
                </div>
            </div>
            <div class="result-links">
                <div class="link-group">
                    <span class="link-label">jsDelivr:</span>
                    <span class="link-value">${result.jsdelivrUrl}</span>
                    <button class="copy-btn" data-clipboard="${result.jsdelivrUrl}">复制</button>
                </div>
                <div class="link-group">
                    <span class="link-label">GitHub:</span>
                    <span class="link-value">${result.rawUrl}</span>
                    <button class="copy-btn" data-clipboard="${result.rawUrl}">复制</button>
                </div>
            </div>
        `;
    } else if (result.status === 'error') {
        resultItem.innerHTML = `
            <div class="result-info">
                <div class="result-filename">
                    <i class='bx ${result.fileIcon || 'bxs-file'}'></i> 
                    ${result.filename} 😿
                </div>
                <div class="result-message">${result.error}</div>
            </div>
        `;
    }
    
    // 绑定复制按钮事件
    if (result.status === 'success') {
        resultItem.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const text = this.getAttribute('data-clipboard');
                copyToClipboard(text, this);
            });
        });
    }
}

// 初始化应用
window.addEventListener('DOMContentLoaded', () => {
    // 初始化
    initApp();
    
    // 添加猫爪动画元素
    addCatAnimation();
    
    // 应用加载完成
    showNotification(getRandomCatPhrase(), 'success');
}); 