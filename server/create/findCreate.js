const path = require("path").resolve(".")
const config = require(path + '/config.js')
const web3 = require(path + '/server/web3/init')
const web3Utils = require(path + '/server/web3/utils')

let nodeLen = config.mode.split('/')[1]
let mode = config.mode
let initType = config.initType

function findCreate (type) {
  return new Promise((resolve, reject) => {
    let rpcData = config.rpcArr[type]
    web3.setProvider(rpcData.url)
    web3Utils.reqAccountList(config.userArr[type].address).then(res => {
      if (res.msg === 'Success') {
        console.log('节点：' + rpcData.url + ' 获取创建账户数据成功！共有' + res.info.length + '条')
      } else {
        console.log('节点：' + rpcData.url + ' 获取创建账户数据 失败！')
      }
      // console.log(res)
      resolve(res.info)
    })
  })
  
}

function findAllCreate () {
  return new Promise((resolve, reject) => {
    let arr = []
    for (let i = 0; i < nodeLen; i++) {
      arr.push(findCreate(i))
    }
    Promise.all(arr).then(res => {
      // console.log(res)
      resolve(res)
    })
  })
}

function signApproval (params, type) {
  return new Promise((resolve, reject) => {
    let rpcData = config.rpcArr[type]
    // console.log(web3.currentProvider.host)
    web3.setProvider(rpcData.url)
    console.log(web3.currentProvider.host)
    web3Utils.getReqNonce(params.Account).then(nonce => {
      console.log('nonce')
      console.log(nonce)
      if (!isNaN(nonce)) {
        let rawTx = {
          from: config.userArr[type].address,
          nonce: nonce,
          data: 'ACCEPTREQADDR:' 
                + params.Account
                + ':'
                + params.Cointype 
                + ':' 
                + params.GroupId 
                + ':' 
                + params.Nonce 
                + ':' 
                + params.LimitNum 
                + ':' 
                + '0'
                + ':' 
                + 'AGREE'
        }
        console.log(rawTx)
        web3Utils.toSign(rawTx, config.userArr[type].pwd).then(res => {
          // console.log(res)
          // resolve(res)
          web3.dcrm.acceptReqAddr(res).then(res => {
            let cbData = res
            console.log('acceptReqAddr')
            console.log(cbData)
            if (cbData.Status === 'Success') {
              resolve(res)
            } else {
              reject({status: 'Error', info: ''})
            }
          })
        }).catch(err => {
          console.log('signApproval')
          console.error(err)
          reject({status: 'Error', info: err})
        })
      } else {
        reject({status: 'Error', info: nonce})
      }
    })
  })
}

function approval (type, params) {
  return new Promise((resolve, reject) => {
    let arr = []
    for (let obj of params) {
      arr.push(signApproval(obj, type))
    }
    Promise.all(arr).then(res => {
      resolve(res)
    }).catch(err => {
      reject({status: 'Error', info: err})
    })
  })
}

function oneTouchApproval () {
  findAllCreate().then(res => {
    let arr = []
    for (let i = 0; i < res.length; i ++) {
      arr.push(approval(i, res[i]))
    }
    Promise.all(arr).then(res2 => {
      console.log(res2)
    }).catch(err => {

    })
  }).catch(err => {
    console.log('oneTouchApproval')
    console.log(err)
  })
}

// findAllCreate()
// oneTouchApproval()

module.exports = {
  findAllCreate,
  oneTouchApproval
}