document.addEventListener('DOMContentLoaded', function() {
    const editor = document.getElementById('cardEditor');
    const container = editor.closest('.container');
    const qrCodeElement = document.getElementById('qrCode');
    const exportBtn = document.getElementById('exportBtn');
    const resetBtn = document.getElementById('resetBtn');
    const content = editor.querySelector('.content');
    const wordCount = editor.querySelector('.word-count');
    const dateElement = editor.querySelector('.date');
    const qrLink = document.getElementById('qrLink');

    // 属性控制
    const cardWidth = document.getElementById('cardWidth');
    const cardHeight = document.getElementById('cardHeight');
    const borderRadius = document.getElementById('borderRadius');
    const padding = document.getElementById('padding');
    const rotation = document.getElementById('rotation');
    const aspectRatio = document.getElementById('aspectRatio');

    // 模板系统
    const templates = {
        'vertical-blue': {
            containerBg: 'linear-gradient(180deg, #7CC5FF 0%, #4FB8FF 100%)',
            background: 'linear-gradient(180deg, #91D3FF 0%, #63C1FF 100%)',
            textColor: '#ffffff'
        },
        'sunset': {
            containerBg: 'linear-gradient(180deg, #FF8F71 0%, #FF3B3B 100%)',
            background: 'linear-gradient(180deg, #FFA588 0%, #FF5252 100%)',
            textColor: '#ffffff'
        },
        'mint': {
            containerBg: 'linear-gradient(180deg, #7BE495 0%, #329D9C 100%)',
            background: 'linear-gradient(180deg, #8FFFA7 0%, #40B4B3 100%)',
            textColor: '#ffffff'
        },
        'purple': {
            containerBg: 'linear-gradient(180deg, #B28DFF 0%, #7C4DFF 100%)',
            background: 'linear-gradient(180deg, #C4A6FF 0%, #9065FF 100%)',
            textColor: '#ffffff'
        },
        'dark': {
            containerBg: 'linear-gradient(180deg, #434343 0%, #000000 100%)',
            background: 'linear-gradient(180deg, #545454 0%, #1a1a1a 100%)',
            textColor: '#ffffff'
        },
        'pure-white': {
            containerBg: '#f5f5f5',
            background: '#ffffff',
            textColor: '#333333'
        },
        'pure-black': {
            containerBg: '#000000',
            background: '#1a1a1a',
            textColor: '#ffffff'
        },
        'transparent': {
            containerBg: 'transparent',
            background: 'transparent',
            textColor: '#333333'
        }
    };

    // 工具栏按钮
    const batchCreateBtn = document.getElementById('batchCreateBtn');
    const saveBtn = document.getElementById('saveBtn');
    const reloadBtn = document.getElementById('reloadBtn');
    const cutBtn = document.getElementById('cutBtn');
    const copyBtn = document.getElementById('copyBtn');
    const gridBtn = document.getElementById('gridBtn');
    const shareBtn = document.getElementById('shareBtn');
    const duplicateBtn = document.getElementById('duplicateBtn');
    const togglePanelBtn = document.getElementById('togglePanelBtn');

    // 更新卡片属性
    function updateCardProperties() {
        // 基础属性
        container.style.width = `${cardWidth.value}px`;
        
        // 高度和比例处理
        if (aspectRatio.value !== 'auto') {
            const [w, h] = aspectRatio.value.split(':').map(Number);
            const calculatedHeight = (cardWidth.value * h) / w;
            editor.style.height = `${calculatedHeight}px`;
            editor.style.minHeight = `${calculatedHeight}px`;
            cardHeight.value = calculatedHeight;
            cardHeight.disabled = true;
        } else {
            cardHeight.disabled = false;
            if (parseInt(cardHeight.value) > 0) {
                editor.style.height = `${cardHeight.value}px`;
                editor.style.minHeight = `${cardHeight.value}px`;
            } else {
                editor.style.height = 'auto';
                editor.style.minHeight = '440px';
            }
        }

        // 其他样式
        editor.style.borderRadius = `${borderRadius.value}px`;
        editor.style.padding = `${padding.value}px`;
        container.style.transform = `rotate(${rotation.value}deg)`;
    }

    // 监听属性变化
    [cardWidth, cardHeight, borderRadius, padding, rotation, aspectRatio].forEach(input => {
        input.addEventListener('input', updateCardProperties);
    });

    // 模板切换
    document.querySelectorAll('.template-item').forEach(item => {
        item.addEventListener('click', function() {
            const templateName = this.dataset.template;
            const template = templates[templateName];

            // 更新激活状态
            document.querySelector('.template-item.active').classList.remove('active');
            this.classList.add('active');

            // 应用模板样式到容器和卡片
            container.style.background = template.containerBg;
            editor.dataset.template = templateName;
            editor.style.background = template.background;
            editor.style.color = template.textColor;

            // 更新相关元素颜色
            const elements = editor.querySelectorAll('.date, .word-count, .signature');
            elements.forEach(el => {
                el.style.color = template.textColor === '#ffffff' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.5)';
            });

            // 更新签名分隔线颜色
            const signature = editor.querySelector('.signature');
            signature.style.borderTopColor = template.textColor === '#ffffff' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
        });
    });

    // 更新日期
    function updateDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        dateElement.textContent = `${year}年${month}月${day}日`;
    }

    // 更新字数统计
    function updateWordCount() {
        const text = content.textContent.trim();
        const count = text.length;
        wordCount.textContent = `字数：${count}`;
    }

    // 生成二维码
    function generateQRCode(text) {
        if (!text) {
            qrCodeElement.classList.remove('visible');
            qrCodeElement.innerHTML = '';
            return;
        }
        
        const qr = qrcode(0, 'L');
        qr.addData(text);
        qr.make();
        const qrImg = qr.createImgTag(3);
        // 替换img标签的样式，移除背景色
        const modifiedQrImg = qrImg.replace('<img', '<img style="background: transparent;"');
        qrCodeElement.innerHTML = modifiedQrImg;
        qrCodeElement.classList.add('visible');
    }

    // 监听二维码链接输入
    qrLink.addEventListener('input', function() {
        const link = this.value.trim();
        generateQRCode(link);
    });

    // 导出图片
    exportBtn.addEventListener('click', function() {
        const originalTransform = container.style.transform;
        container.style.transform = 'none'; // 临时移除旋转以便正确导出

        html2canvas(container, {
            backgroundColor: null,
            scale: 2,
            logging: false,
            useCORS: true
        }).then(canvas => {
            // 如果需要旋转
            if (rotation.value !== '0') {
                const rotatedCanvas = document.createElement('canvas');
                const ctx = rotatedCanvas.getContext('2d');
                const angle = parseFloat(rotation.value) * Math.PI / 180;
                
                // 计算旋转后的画布大小
                const sin = Math.abs(Math.sin(angle));
                const cos = Math.abs(Math.cos(angle));
                rotatedCanvas.width = canvas.height * sin + canvas.width * cos;
                rotatedCanvas.height = canvas.height * cos + canvas.width * sin;
                
                // 移动到中心点并旋转
                ctx.translate(rotatedCanvas.width/2, rotatedCanvas.height/2);
                ctx.rotate(angle);
                ctx.drawImage(canvas, -canvas.width/2, -canvas.height/2);
                
                canvas = rotatedCanvas;
            }

            const link = document.createElement('a');
            link.download = '时光信纸.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });

        container.style.transform = originalTransform; // 恢复旋转
    });

    // 重置
    resetBtn.addEventListener('click', function() {
        content.textContent = '「时光信纸，用二维码留住珍贵瞬间。」\n\n扫描专属二维码，打开尘封记忆，让每一张照片都成为时光的信使，珍藏感动，传递温暖。';
        updateDate();
        updateWordCount();
        
        // 重置属性
        cardWidth.value = '440';
        cardHeight.value = '0';
        borderRadius.value = '15';
        padding.value = '30';
        rotation.value = '0';
        aspectRatio.value = 'auto';
        qrLink.value = ''; // 清空二维码链接
        updateCardProperties();
        generateQRCode(''); // 隐藏二维码

        // 重置模板
        document.querySelector('.template-item[data-template="vertical-blue"]').click();
    });

    // 监听内容变化
    content.addEventListener('input', updateWordCount);

    // 防止回车键换行过多
    content.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.execCommand('insertLineBreak', false, null);
        }
    });

    // 批量创建功能
    batchCreateBtn.addEventListener('click', function() {
        const count = prompt('请输入要创建的卡片数量：', '1');
        if (count && !isNaN(count) && count > 0) {
            // TODO: 实现批量创建逻辑
            alert('批量创建功能即将上线');
        }
    });

    // 保存功能
    saveBtn.addEventListener('click', function() {
        const cardData = {
            content: content.innerHTML,
            template: editor.dataset.template,
            properties: {
                width: cardWidth.value,
                height: cardHeight.value,
                borderRadius: borderRadius.value,
                padding: padding.value,
                rotation: rotation.value,
                aspectRatio: aspectRatio.value
            }
        };
        localStorage.setItem('cardData', JSON.stringify(cardData));
        alert('保存成功！');
    });

    // 重新加载
    reloadBtn.addEventListener('click', function() {
        const savedData = localStorage.getItem('cardData');
        if (savedData) {
            const cardData = JSON.parse(savedData);
            content.innerHTML = cardData.content;
            
            // 恢复属性
            const props = cardData.properties;
            cardWidth.value = props.width;
            cardHeight.value = props.height;
            borderRadius.value = props.borderRadius;
            padding.value = props.padding;
            rotation.value = props.rotation;
            aspectRatio.value = props.aspectRatio;
            
            // 应用模板
            document.querySelector(`.template-item[data-template="${cardData.template}"]`).click();
            
            // 更新所有属性
            updateCardProperties();
            updateWordCount();
        }
    });

    // 剪切功能
    cutBtn.addEventListener('click', function() {
        document.execCommand('cut');
    });

    // 复制功能
    copyBtn.addEventListener('click', function() {
        document.execCommand('copy');
    });

    // 网格对齐切换
    let gridEnabled = false;
    gridBtn.addEventListener('click', function() {
        gridEnabled = !gridEnabled;
        this.classList.toggle('active');
        editor.style.backgroundImage = gridEnabled ? 
            'linear-gradient(to right, rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.1) 1px, transparent 1px)' : 
            'none';
        editor.style.backgroundSize = gridEnabled ? '20px 20px' : 'auto';
    });

    // 分享功能
    shareBtn.addEventListener('click', async function() {
        try {
            const canvas = await html2canvas(editor, {
                backgroundColor: editor.style.background === 'transparent' ? null : editor.style.background,
                scale: 2,
                logging: false,
                useCORS: true
            });
            
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            const file = new File([blob], '时光信纸.png', { type: 'image/png' });
            
            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: '分享时光信纸',
                    text: '我用时光信纸创建了一张卡片'
                });
            } else {
                // 降级方案：下载图片
                const link = document.createElement('a');
                link.download = '时光信纸.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }
        } catch (error) {
            console.error('分享失败:', error);
            alert('分享失败，请重试');
        }
    });

    // 复制卡片
    duplicateBtn.addEventListener('click', function() {
        const clone = editor.cloneNode(true);
        clone.id = 'cardEditor_' + Date.now();
        editor.parentNode.appendChild(clone);
        // TODO: 实现多卡片管理
        alert('复制功能即将上线');
    });

    // 切换属性面板
    togglePanelBtn.addEventListener('click', function() {
        const panel = document.querySelector('.properties-panel');
        panel.classList.toggle('hidden');
        this.classList.toggle('active');
    });

    // 初始化
    updateDate();
    updateWordCount();
    updateCardProperties();
    // 初始化模板
    document.querySelector('.template-item[data-template="vertical-blue"]').click();
}); 