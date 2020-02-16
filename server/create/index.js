const path = require("path").resolve(".")
const config = require(path + '/config.js')
const web3 = require(path + '/server/web3/init')
const web3Utils = require(path + '/server/web3/utils')

let nodeLen = config.mode.split('/')[1]
let mode = config.mode
let initType = config.initType
let enodeArr = []

function getEnode (type) {
  return new Promise((resolve, reject) => {
    // console.log(config.rpcArr[type].url)
    web3.setProvider(config.rpcArr[type].url)
    web3Utils.getEnode().then(res => {
      console.log(res)
      resolve(res)
    }).catch(err  => {
      console.log('getEnode')
      reject({status: 'Error', info: err.message})
    })
  })
}

function getEnodeArr () {
  return new Promise((resolve, reject) => {
    let  arr = []
    for (let i = 0; i < nodeLen; i++ ) {
      arr.push(getEnode(i))
    }
    Promise.all(arr).then(res => {
      // console.log(res)
      enodeArr = res
      resolve(res)
    }).catch(err => {
      console.log('getEnodeArr')
      reject({status: 'Error', info: err.message})
    })
  })
}

function signEnode (type, enode) {
  return new Promise((resolve, reject) => {
    let eNodeKey = enode.match(/enode:\/\/(\S*)@/)[1]
    // console.log(eNodeKey)
    let rawTx = {
      from: config.userArr[type].address,
      data: eNodeKey
    }
    // console.log(rawTx)
    // console.log(config.userArr[type].pwd)
    web3Utils.toSign(rawTx, config.userArr[type].pwd).then(res => {
      // console.log(res)
      resolve(res)
    }).catch(err => {
      console.log('signEnode')
      console.error(err)
      reject({status: 'Error', info: err.message})
    })
  })
}

function getSignEnode () {
  return new Promise((resolve, reject) => {
    getEnodeArr().then(res => {
      // console.log(res)
      let  arr = []
      for (let i = 0; i < nodeLen; i++ ) {
        arr.push(signEnode(i, res[i]))
      }
      Promise.all(arr).then(res => {
        // console.log(res)
        resolve(res)
      }).catch(err => {
        console.log('getSignEnode')
        reject({status: 'Error', info: err.message})
      })
    }).catch(err => {
      console.log('getSignEnode2')
      reject({status: 'Error', info: err.message})
    })
  })
}

function createGroup () {
  return new Promise((resolve, reject) => {
    let arr = []
    for (let obj of enodeArr) {
      arr.push(obj)
    }
    // console.log(arr)
    // console.log(mode)
    // console.log(web3.currentProvider.host)
    web3.setProvider(config.rpcArr[initType].url)
    // console.log(web3.currentProvider.host)
    web3Utils.createGroup(mode, arr).then(res => {
      let gInfo = res
      // console.log(gInfo)
      if (gInfo.msg === 'Success') {
        resolve(res.info.Gid)
        // this.gID = res.info.Gid
        // this.openPwdDialog()
      } else {
        // this.msgError(gInfo.info.toString())
        reject({status: 'Error', info: gInfo.info.toString()})
      }
    }).catch(err => {
      console.log('createGroup')
      console.error(err)
      reject({status: 'Error', info: err.error})
    })
  })
}

function getInitData () {
  return new Promise((resolve, reject) => {
    getSignEnode().then(res => {
      console.log(res)
      let enodeSign = res
      createGroup().then(res2 => {
        // console.log('res2')
        // console.log(res2)
        resolve({
          n: enodeSign,
          gId: res2
        })
      }).catch(err => {
        console.log('getInitData')
        console.error(err)
        reject({status: 'Error', info: err})
      })
    }).catch(err => {
      console.log('getInitData')
      console.error(err)
      reject({status: 'Error', info: err})
    })
  })
}

function getCreateSign () {
  return new Promise((resolve, reject) => {
    getInitData().then(res => {
      console.log(res)
      let data = 'REQDCRMADDR:' + res.gId + ':' + mode
      for (let obj of res.n) {
        data += ':' + obj
      }
      // console.log(data)
      let address = config.userArr[initType].address
      let dataPage = {
        from: address,
      }
      web3Utils.getReqNonce(address).then(nonce => {
        dataPage.nonce = nonce
        dataPage.value = 0
        dataPage.data = data
        // console.log(dataPage)
        web3Utils.toSign(dataPage, config.userArr[initType].pwd).then(res => {
          // console.log(res)
          resolve(res)
        }).catch(err => {
          console.log('getNonce')
          console.error(err)
          reject({status: 'Error', info: err})
        })
      })
    }).catch(err => {
      console.error(err)
      reject({status: 'Error', info: err.message})
    })
  })
}

function reqAccount () {
  return new Promise((resolve, reject) => {
    getCreateSign().then(res => {
      // console.log(res)
      web3Utils.reqAccount(res, '0').then(res => {
        resolve(res)
      }).catch(err => {
        console.error(err)
        reject({status: 'Error', info: err})
      })
    }).catch(err => {
      console.error(err)
      reject({status: 'Error', info: err})
    })
  })
}

function create (type) {
  reqAccount().then(res => {
    console.error(res)
  }).catch(err => {
    console.error(err)
  })
  // getInitData().then(res => {
  //   console.log(res)
  // }).catch(err => {
  //   console.error(err)
  // })
  // Promise.all([
  //   getSignEnode(),
  //   createGroup()
  // ]).then(res => {
  //   console.log('res')
  //   console.log(res)
  // }).catch(err => {
  //   console.error(err)
  // })
  // getSignEnode().then(res => {
  //   console.log(res)
  //   createGroup().then(res2 => {
  //     console.log('res2')
  //     console.log(res2)
  //   }).catch(err => {
  //     console.log('create')
  //     console.error(err)
  //   })
  // }).catch(err => {
  //   console.log('create')
  //   console.error(err)
  // })
}

// create()
module.exports = create