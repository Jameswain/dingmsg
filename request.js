const http = require('http');
const https = require('https');
const isHttps = /https:?/;

function requrest(url, options, postData) {
  const transport = isHttps.test(url) ? https : http
  return new Promise(async (resolve, reject) => {
    const method = options.method.toLowerCase();
    if (['post', 'put'].includes(method)) {
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }
    const req = transport.request(url, options, res => {
      res.setEncoding('utf-8')
      let result = '';
      res.on('data', data => {
        result += data
      })
      res.on('end', () => {
        try {
          resolve(JSON.parse(result))
        } catch (e) {
          resolve(result)
        }
      })
    })

    req.on('error', e => {
      console.log(`request error: ${e.message}`)
      reject(e)
    })

    if (['post', 'put'].includes(method)) {
      req.write(postData)
    }
    req.end()
  })
}

const createRequest = method => (url, data = {}, options = {}) => {
  const postData = JSON.stringify(data)
  return requrest(
    url,
    Object.assign({
      method
    }, {
      ...options,
      headers: {
        ...(options.headers || {})
      }
    }),
    postData
  )
}

exports.requrest = requrest;
exports.createRequest = createRequest;
exports.get = createRequest('get');
exports.put = createRequest('put');
exports.post = createRequest('post');
