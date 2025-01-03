document.addEventListener('DOMContentLoaded', function() {
    const editor = document.getElementById('cardEditor');
    const qrCodeElement = document.getElementById('qrCode');
    const exportBtn = document.getElementById('exportBtn');
    const resetBtn = document.getElementById('resetBtn');
    const content = editor.querySelector('.content');
    const wordCount = editor.querySelector('.word-count');
    const dateElement = editor.querySelector('.date');

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
            background: 'linear-gradient(180deg, #4FB8FF 0%, #2E8DE1 100%)',
            textColor: '#ffffff'
        },
        'transparent': {
            background: 'transparent',
            textColor: '#333333'
        }
    };

    // 更新卡片属性
    function updateCardProperties() {
        // 基础属性
        editor.style.width = `${cardWidth.value}px`;
        
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
        editor.style.transform = `rotate(${rotation.value}deg)`;
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

            // 应用模板样式
            editor.dataset.template = templateName;
            editor.style.background = template.background;
            editor.style.color = template.textColor;

            // 更新相关元素颜色
            const elements = editor.querySelectorAll('.date, .word-count, .signature');
            elements.forEach(el => {
                el.style.color = templateName === 'vertical-blue' ? 'rgba(255, 255, 255, 0.8)' : '#666';
            });

            // 更新签名分隔线颜色
            const signature = editor.querySelector('.signature');
            signature.style.borderTopColor = templateName === 'vertical-blue' ? 'rgba(255, 255, 255, 0.2)' : '#eee';
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
        const qr = qrcode(0, 'L');
        qr.addData(text);
        qr.make();
        qrCodeElement.innerHTML = qr.createImgTag(3);
    }

    // 导出图片
    exportBtn.addEventListener('click', function() {
        const originalTransform = editor.style.transform;
        editor.style.transform = 'none'; // 临时移除旋转以便正确导出

        html2canvas(editor, {
            backgroundColor: editor.style.background === 'transparent' ? null : editor.style.background,
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

        editor.style.transform = originalTransform; // 恢复旋转
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
        updateCardProperties();

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

    // 初始化
    updateDate();
    updateWordCount();
    updateCardProperties();
    generateQRCode(window.location.href);
    // 初始化模板
    document.querySelector('.template-item[data-template="vertical-blue"]').click();
}); 