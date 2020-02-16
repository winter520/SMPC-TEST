const path = require("path").resolve(".")
const config = require(path + '/config.js')
const web3 = require(path + '/server/web3/init')
const web3Utils = require(path + '/server/web3/utils')

const creat = require(path + '/server/create/index')
const find = require(path + '/server/create/findCreate')


process.stdout.write('请输入内容'+"\n")
process.stdin.on("data", (input) => {
  let inputTxt = input.toString().trim()
  console.log(inputTxt)
  if (inputTxt === '00') {
    creat()
  } else if (inputTxt === '01') {
    find.findAllCreate()
  } else if (inputTxt === '02') {
    find.oneTouchApproval()
  } else {
    process.stdout.write('指令不存在'+"\n")
  }
})

// process.stdin.on("data", (input) => {
//   let inputTxt = input.toString().trim()
//   console.log(inputTxt)
//   if (inputTxt === '0') {
//     creat()
//   } else {
//     process.stdout.write('指令不存在'+"\n")
//   }
// })