// ==UserScript==
// @name         转nekobox规则
// @namespace    https://matsuridayo.github.io/nb4a-route/
// @version      0.1
// @description  nekobox
// @author       You
// @match        *://*/*
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    // 将 || 替换为 regexp:
    function replacePipe(pipeText) {
        return pipeText.replace(/\|\|/g, 'regexp:');
    }

    // 删除不以 regexp: 开头的行
    function removeNonRegexp(text) {
        return text.split('\n').filter(line => line.trim().startsWith('regexp:')).join('\n');
    }

    // 替换 . 为 \.
    function replaceDot(dotText) {
        return dotText.replace(/\./g, '\\.');
    }

    // 替换 * 为 .*
    function replaceAsterisk(asteriskText) {
        return asteriskText.replace(/\*/g, '.*');
    }

    // 替换 ^ 为空
    function replaceCaret(caretText) {
        return caretText.replace(/\^/g, '');
    }

    // 删除多余的空格，但保留换行符
    function removeExtraSpaces(text) {
        return text.replace(/[^\S\r\n]+/g, ' ').trim();
    }

    // 删除包含图片后缀的行
    function removeImageLines(text) {
        return text.split('\n').filter(line => !/\.(png|gif|jpg|jpeg|bmp|svg)$/i.test(line)).join('\n');
    }

    // 删除包含特殊字符的行
    function removeSpecialLines(text) {
        return text.split('\n').filter(line => !/[/$?|]/.test(line)).join('\n');
    }

    // 判断是否是规则链接网页
    function isRegularPage(text) {
        // 统计 || 的数量
        const pipeCount = (text.match(/\|\|/g) || []).length;
        return pipeCount >= 10; // 当网页中少于十个 || 时，返回 false
    }

    // 执行文本操作并弹出提示框
    function manipulateText() {
        // 获取网页上的所有文本
        let allText = document.body.innerText;

        if (!isRegularPage(allText)) {
            // 如果不是规则链接网页，弹出提示框
            Swal.fire({
                position: "top",
                icon: "question",
                title: "不是规则链接网页",
                showConfirmButton: false,
                timer: 1000,
            });
            return; // 结束函数执行
        }

        // 替换 || 为 regexp:
        allText = replacePipe(allText);

        // 删除不以 regexp: 开头的行
        allText = removeNonRegexp(allText);

        // 替换 . 为 \.
        allText = replaceDot(allText);

        // 替换 * 为 .*
        allText = replaceAsterisk(allText);

        // 替换 ^ 为空
        allText = replaceCaret(allText);

        // 删除多余的空格，但保留换行符
        allText = removeExtraSpaces(allText);

        // 删除包含图片后缀的行
        allText = removeImageLines(allText);

        // 删除包含特殊字符的行
        allText = removeSpecialLines(allText);

        if (!allText.trim()) {
            // 如果不是规则链接网页，弹出提示框
            Swal.fire({
                position: "top",
                icon: "question",
                title: "不是规则链接网页",
                showConfirmButton: false,
                timer: 1000,
            });
            return; // 结束函数执行
        }

        // 显示包含操作后文本的警告框
        Swal.fire({
            title: '可进行复制',
            input: 'textarea',
            inputValue: allText,

            // 设置input属性
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
    }

    // 创建一个菜单命令用于文本操作
    GM_registerMenuCommand('转nekobox规则', manipulateText);
})();
