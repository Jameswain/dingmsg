const { post } = require('./request');

/**
 * 
 * @param {string} dinghook 
 * @param {string} title 
 * @param {string[]} text 
 * @param {object} opts 
 */
async function sendDingTalk(dinghook, title, text = [], opts = {}) {
  const params = {
    msgtype: 'markdown',
    markdown: {
      "title": title,
      "text": text.join('\n')
    },
    ...opts
    // at: {
    //   isAtAll: true
    // }
  };
  await post(dinghook, params);
}

/**
 * 发送钉钉消息
 */
exports.sendDingTalk = sendDingTalk;