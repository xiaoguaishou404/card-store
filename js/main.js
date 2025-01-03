document.addEventListener('DOMContentLoaded', function() {
    const editor = document.getElementById('cardEditor');
    const templateSelect = document.getElementById('templateSelect');
    const colorPicker = document.getElementById('colorPicker');
    const fontSelect = document.getElementById('fontSelect');
    const fontSize = document.getElementById('fontSize');
    const watermarkUpload = document.getElementById('watermarkUpload');
    const watermarkElement = document.getElementById('watermark');
    const qrCodeElement = document.getElementById('qrCode');
    const exportBtn = document.getElementById('exportBtn');
    const resetBtn = document.getElementById('resetBtn');

    // 模板系统
    const templates = {
        default: {
            backgroundColor: '#ffffff',
            fontFamily: 'Microsoft YaHei',
            fontSize: '16px',
            padding: '20px'
        },
        elegant: {
            backgroundColor: '#f8f9fa',
            fontFamily: 'SimSun',
            fontSize: '18px',
            padding: '30px'
        },
        simple: {
            backgroundColor: '#ffffff',
            fontFamily: 'KaiTi',
            fontSize: '16px',
            padding: '15px'
        }
    };

    // 应用模板
    templateSelect.addEventListener('change', function() {
        const template = templates[this.value];
        editor.style.backgroundColor = template.backgroundColor;
        editor.style.fontFamily = template.fontFamily;
        editor.style.fontSize = template.fontSize;
        editor.style.padding = template.padding;
    });

    // 文字颜色
    colorPicker.addEventListener('input', function() {
        editor.style.color = this.value;
    });

    // 字体
    fontSelect.addEventListener('change', function() {
        editor.style.fontFamily = this.value;
    });

    // 字号
    fontSize.addEventListener('input', function() {
        editor.style.fontSize = this.value + 'px';
    });

    // 水印
    watermarkUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '100px';
                img.style.maxHeight = '100px';
                watermarkElement.innerHTML = '';
                watermarkElement.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    });

    // 生成二维码
    function generateQRCode(text) {
        const qr = qrcode(0, 'L');
        qr.addData(text);
        qr.make();
        qrCodeElement.innerHTML = qr.createImgTag(3);
    }

    // 默认二维码
    generateQRCode(window.location.href);

    // 导出图片
    exportBtn.addEventListener('click', function() {
        html2canvas(editor, {
            backgroundColor: null,
            scale: 2,
            logging: false,
            useCORS: true
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = '卡片.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });

    // 重置
    resetBtn.addEventListener('click', function() {
        editor.innerHTML = '在这里输入您的文字...';
        editor.style = '';
        watermarkElement.innerHTML = '';
        templateSelect.value = 'default';
        colorPicker.value = '#000000';
        fontSelect.value = 'Microsoft YaHei';
        fontSize.value = '16';
    });

    // 初始化
    templateSelect.value = 'default';
    const defaultTemplate = templates.default;
    editor.style.backgroundColor = defaultTemplate.backgroundColor;
    editor.style.fontFamily = defaultTemplate.fontFamily;
    editor.style.fontSize = defaultTemplate.fontSize;
    editor.style.padding = defaultTemplate.padding;
}); 