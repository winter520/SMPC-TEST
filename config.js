module.exports = {
  /**
   * @description 默认节点
   */
  serverRPC: 'http://139.196.26.212:5011',
  /**
   * @description 默认选择
   */
  initType: 0,
  /**
   * @description 默认模式 
   */
  mode: '5/5',
  /**
   * @description 节点
   */
  rpcArr: [
    {name: 'Fusion', url: 'http://139.196.26.212:5011'},
    {name: 'Fantom', url: 'http://47.92.168.85:5012'},
    {name: 'Totle', url: 'http://207.180.231.214:5013'},
    {name: 'KIT', url: 'http://104.210.49.28:5014'},
    {name: 'Realio', url: 'http://212.129.146.143:5015'},
  ],
  /**
   * @description 账户 
   */
  userArr: [
    {address: '0x04e4BEFc76C4027eA4e689c4F2896370A779DC5d', pwd: '0xab25c0348491c63623e1ba9c69f19a0d3d45982b68c148931bf3536c24f97c99'},
    {address: '0x074475Cb797BB4145088B26F0E24BC45aA45321b', pwd: '0x57b2eb52985614cd49a9b43425770487b4b056990be98c6659b90b3419e28459'},
    {address: '0x0808B483e61DeB2984C8179b0001c412e45e677C', pwd: '0xc03a73c43365ffc048781bc5f1b1077f80de7cdc33ce54352514ed74d13541b2'},
    {address: '0x02722070d8865f8aD7CbA7a695D61CB88DfD0296', pwd: '0x0115e1d79748ea3e03a2b78dc6d52ec52f10f37cf2d33a78158c4961dd26b51b'},
    {address: '0x00890DB405A8d8823cABF669b5a4E8Ac90fD1261', pwd: '0xf697c6823949823102914c4e5a3606b0d0511254f31b853039eede4650a14a9a'},
  ],
  /**
   * @description 启动gdcrm路径
   */
  rawTx: {
    to: '0x00000000000000000000000000000000000000dc',
    gasLimit: 80000,
    gasPrice: 100000,
  },
}
