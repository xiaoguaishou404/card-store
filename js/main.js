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

    // 模板系统
    const templates = {
        default: {
            background: 'white',
            textColor: '#333'
        },
        transparent: {
            background: 'transparent',
            textColor: '#333'
        }
    };

    // 更新卡片属性
    function updateCardProperties() {
        editor.style.width = `${cardWidth.value}px`;
        if (parseInt(cardHeight.value) > 0) {
            editor.style.height = `${cardHeight.value}px`;
            editor.style.minHeight = `${cardHeight.value}px`;
        } else {
            editor.style.height = 'auto';
            editor.style.minHeight = '440px';
        }
        editor.style.borderRadius = `${borderRadius.value}px`;
        editor.style.padding = `${padding.value}px`;
    }

    // 监听属性变化
    [cardWidth, cardHeight, borderRadius, padding].forEach(input => {
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
            editor.style.background = template.background;
            editor.style.color = template.textColor;
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
        html2canvas(editor, {
            backgroundColor: editor.style.background,
            scale: 2,
            logging: false,
            useCORS: true,
            onclone: function(clonedDoc) {
                const clonedEditor = clonedDoc.querySelector('#cardEditor');
                clonedEditor.style.transform = 'none';
            }
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = '时光信纸.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
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
        updateCardProperties();

        // 重置模板
        document.querySelector('.template-item[data-template="default"]').click();
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
}); 