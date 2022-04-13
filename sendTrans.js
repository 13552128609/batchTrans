const ethers = require('ethers')
const Web3 = require('web3')
const BigNumber = require('bignumber.js')
const net = require('net')
const url = 'http://35.161.174.197:45717'
async function main() {
    let user = "0x2d0E7c0813A51d3bd1d08246Af2A8a7A57d8922E"
    let wallet = new ethers.Wallet("0xa4369e77024c2ade4994a9345af5c47598c7cfb36c65e8a4a3117519883d9014", new ethers.providers.JsonRpcProvider(url))
    //let web3 = new Web3(new Web3.providers.IpcProvider('/home/ubuntu/.wanchain/testnet/gwan.ipc', net))
    let web3 = new Web3(url)
    let nonce = await web3.eth.getTransactionCount(user)
    console.log("nonce:", nonce)
    for(let i=0; i<5000; i++) {
        let tx = {
            type: 0,
            chainId: 999,
            nonce:nonce+i,
            to: user,
            value:0x1,
            gasPrice: 6000000000,
            gasLimit: 30000
        }
    // let unsignedTransaction = await wallet.populateTransaction(tx)
 
    // let signedTransaction =  await wallet.signTransaction(unsignedTransaction)

    // let back = ethers.utils.parseTransaction(signedTransaction)
    // console.log("back hash:",back.hash, back)
    // web3.eth.sendSignedTransaction(signedTransaction, console.log)
        wallet.signTransaction(tx).then((signedTransaction)=>{
            web3.eth.sendSignedTransaction(signedTransaction, console.log)
        })

    }


}

main()
