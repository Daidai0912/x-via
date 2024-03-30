// ==UserScript==
// @name         转nekobox规则
// @namespace    https://matsuridayo.github.io/nb4a-route/
// @version      0.2
// @description  nekobox
// @author       You
// @match        *://*/*
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @grant        GM_registerMenuCommand
// @downloadURL  https://raw.githubusercontent.com/Daidai0912/x-via/main/自用/nekobox-rule.js
// ==/UserScript==

(function() {
    'use strict';

    GM_registerMenuCommand('转nekobox规则', function() {
        var textContent = document.body.innerText.split('\n');
        var filteredContent = [];

        for (var i = 0; i < textContent.length; i++) {
            var line = textContent[i];
            line = line.replace(/\^/g, '');
            if (line.includes('*')) {
                line = line.replace(/\|\|/g, 'regexp:');
            } else {
                line = line.replace(/\|\|/g, '');
            }

            if (line.startsWith('/') && line.endsWith('/')) {
                line = 'regexp:' + line.substring(1, line.length - 1);
            }

            if (!line.startsWith('regexp:') && line.endsWith('.')) {
                line = 'regexp:' + line;
            }

            if (line.includes('|') || line.includes('!') || line.includes('/') || line.includes('$') || line.includes('?')) {
                continue;
            }

            if (line.endsWith('.png') || line.endsWith('.apk') || line.endsWith('.zip') || line.endsWith('.gif') || line.endsWith('.jpg') || line.endsWith('.jpeg') || line.endsWith('.txt') || line.endsWith('.json') || /[\u4E00-\u9FA5]/.test(line)) {
                continue;
            }

            if (line.trim() === '' || !line.includes('.')) {
                continue;
            }

            if (line.startsWith('regexp')) {
                line = line.replace(/\./g, '\\.');
                line = line.replace(/\*/g, '.*');
            }

            line = line.replace(/\s+/g, ' ').trim();

            if (line.includes(' ')) {
                continue;
            }

            filteredContent.push(line);
        }

        var finalContent = filteredContent.join('\n');

        if (!finalContent.trim()) {
            Swal.fire({
                position: "top",
                icon: "question",
                title: "不是规则链接网页",
                showConfirmButton: false,
                timer: 1000,
            });
            return;
        }

        Swal.fire({
            title: '可进行复制',
            input: 'textarea',
            inputValue: finalContent,
            inputAttributes: {
                autocapitalize: 'off',
                style: 'font-size: 12px;'
            },
            showCancelButton: true,
            cancelButtonText: '取消',
            confirmButtonText: '保存',
            showLoaderOnConfirm: true,
            preConfirm: (editedList) => {},
            allowOutsideClick: () => Swal.isLoading(),
        });
    });
})();
