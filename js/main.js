(function(){
    //声明变量
    let oEnter = document.getElementById('js-enter');              // 发送消息按钮
    let oCount = document.getElementById('js-conut');              // 在线人数
    let oCount2 = document.getElementById('js-conut2');            // 在线人数
    let oLogin = document.getElementById('js-login');              // 登录弹窗
    let oLoginBtn = document.getElementById('js-loginBtn');        // 登录按钮
    let oOpenBton = document.getElementById('js-openBtn');         // 打开用户列表的按钮
    let oBg = document.getElementById('js-bg');                   // 遮罩
    let oChatBox = document.getElementById('js-chatBox');          // 聊天窗口
    let oMessageBox = document.getElementById('js-messageBox');    // 消息窗口
    let oUserBox = document.getElementById('js-userList');        // 用户列表
    let loginStatus = false;                                       // 登录状态
    let nickName = '';
    let socket = io('127.0.0.1:3000');

    // 清除HTML标签
    function delHtmlTag (str) {
        return str.replace(/<[^>]+>/g,"");
    }
    //连接服务器
    socket.on('connect', function () {
        console.log('成功连接服务器')
    });
    // 登录状态
    socket.on('login', function (data) {
        if (data.status === 'ok') {
            loginStatus = true;
            oLogin.style.visibility = 'hidden'
        } else {
            alert(data.text)
        }
    });
    // 用户登录
    function userLogin () {
        let loginName = delHtmlTag(document.getElementById('js-loginName').value)
        if (loginName === '') {
            alert('你必须输入用户名')
        } else if (loginName.length > 10) {
            alert('用户名不能超过十个字符')
        } else {
            nickName = loginName;
            // 登录
            socket.emit('login', {
                name: nickName
            })
        }
    }
    //登录按钮点击事件
    oLoginBtn.addEventListener('click', userLogin)
    document.getElementById('js-loginName').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            userLogin()
        }
    });
    // 发送消息方法
    function sendMessage () {
        let oText = document.getElementById('js-text');
        let sText = delHtmlTag(oText.value)
        if (sText === '') {
            alert('不能为空')
            return false
        } else if (sText.length > 30) {
            alert('内容不能超过30个字');
            return false
        }
        socket.emit('message', {
            name: nickName,
            text: sText
        });
        oMessageBox.innerHTML += `<li class="my">
            <div class="name">${nickName}</div>
            <div class="message">${sText}</div>
            </li>`;
        oText.value = '';
        oMessageBox.scrollTop = oMessageBox.scrollHeight;//如果当前消息列表为空，则滚动到最上端
    }
    //发送按钮点击事件
    oEnter.addEventListener('click', sendMessage);//按钮点击事件
    document.getElementById('js-text').addEventListener('keydown', function () {//键盘敲击事件
        if (event.key === 'Enter') {
            sendMessage()
        }
    });
    // 消息列表显示
    socket.on('message', function (data) {
        oMessageBox.innerHTML += `<li>
            <div class="name">${delHtmlTag(data.name)}</div>
            <div class="message">${delHtmlTag(data.text)}</div>
           </li>`;
        oMessageBox.scrollTop = oMessageBox.scrollHeight
    });
    // 系统通知
    socket.on('sys', function (data) {
        oCount.innerHTML = oCount2.innerHTML = data.count;
        oMessageBox.innerHTML += `<li class="sys">
            <div class="name">系统通知</div>
            <div class="message">${delHtmlTag(data.text)}</div>
            </li>`;
    //遍历用户数组，显示当前在线用户列表
        let sUser = '';
        data.users.forEach(el => {
            sUser += `<li>${el}</li>`
        });
        oUserBox.innerHTML = sUser
    });
    // 打开用户列表事件
    oOpenBton.addEventListener('click', function () {
        oChatBox.classList.toggle('open')
    });
    // 关闭用户列表事件
    oBg.addEventListener('click', function () {
        oChatBox.classList.remove('open')
    })

})();