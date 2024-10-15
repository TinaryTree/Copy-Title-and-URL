chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: copyTitleAndURL
  });
});

// 注入到页面中的函数
function copyTitleAndURL() {
  const title = document.title;
  const url = window.location.href;
  const textToCopy = `${title}\n${url}`;

  // 使用 Clipboard API 复制
  navigator.clipboard.writeText(textToCopy).then(() => {
    // 复制成功后调用更换图标的函数
    chrome.runtime.sendMessage({ action: 'copySuccess' });
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}

// 监听从页面中传递的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'copySuccess') {
    // 更换图标为成功状态的图标
    chrome.action.setIcon({ path: "success_icon.png" });

    // 1秒后恢复为默认图标
    setTimeout(() => {
      chrome.action.setIcon({ path: "icon.png" });  // 默认图标
    }, 1000);
  }
});
