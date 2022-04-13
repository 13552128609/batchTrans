const WanProvider = require('wanchain-truffle-sdk').WanProvider;
const Web3 = require('web3');
const privateKey = '75e975b4659556869b039f1ea5bd7852ef1b11f3a30b5c35d36d0766aa4973c9';
const args = process.argv.slice(2)
const fromAddress = '0xEdBdF9e0C92528651dac75d2e9443140A8Cb283C';

const toAddress = '0xEdBdF9e0C92528651dac75d2e9443140A8Cb283C';

const value = '0x' + (1e18).toString(16);

// Wanchain **Testnet** RPC server, please replace to mainnet when you use.
// const rpcUrl = 'https://gwan-ssl.wandevs.org:46891';

const rpcUrl = 'http://34.209.149.18:36891';


const wanProvider = new WanProvider(privateKey, rpcUrl);

const web3 = new Web3(wanProvider);

async function getNonce(fromAddress){
    let nonce = await web3.eth.getTransactionCount(fromAddress);
//    let nonce = await web3.eth.getTransactionCount(fromAddress,'pending');
    console.log(nonce)
    return nonce
}

async function sign(nonce){
//    let tx = {from: fromAddress,chainId:'0x6', to: toAddress, value: '0xde0b6b3a7640000',nonce:'0x'+nonce.toString(16),gasPrice:'0x'+(2.5e9).toString(16),gas:'21000'.toString(16),Txtype:'0x1'};
    let tx = {from: fromAddress,chainId:'0x6', to: toAddress, value: '0xde0b6b3a7640000',nonce:'0x'+nonce.toString(16),gasPrice:(process.argv[3]),gas:'21000'.toString(16),Txtype:'0x1'};
    // let tx = {from: fromAddress,chainId:'0x3', to: toAddress, value: '0xde0b6b3a7640000',nonce:'0x'+nonce.toString(16),gasPrice:'0x'+(4000000007).toString(16),gas:'21000'.toString(16),Txtype:'0x1'};

    let rawdata = await web3.eth.signTransaction(tx);
    // console.log(rawdata)
    return rawdata
}

async function sendRawTrans(rawData){
    let tx = await web3.eth.sendSignedTransaction(rawData.raw);
    return tx
}
async function batchSend(count){
    let nonce =  await getNonce(fromAddress);
    let array = [];
    for (let j =0;j<count;j++){
        const func = async () => {
            let rawData = await sign(nonce+j)
            try{
            let tx = await sendRawTrans(rawData)
            console.log('Index: ',j,'Tx: ',tx)
            }catch(e){console.log(e)}
        }
        array.push(func());
    }

    await Promise.all(array);
    return 
}

async function batchSend2(count){
    try{
        let nonce =  await getNonce(fromAddress);
     let array = [];
     for (let j=0;j<count;j++){
    const func = async () =>{
    let rawData = await sign(nonce+j)
    web3.eth.sendSignedTransaction(rawData.raw, (err, txHash) => {
    if (err) {
    console.log('error:', err);
    }
    else {
    console.log('nonce',nonce+j,',txHash:', txHash)
    }
    })
    }
    array.push(func())
    }
    await Promise.all(array);

       }catch(err){


       }

 //   let nonce =  await getNonce(fromAddress);
 //   let array = [];
 //   for (let j=0;j<count;j++){
 //       const func = async () =>{
 //           let rawData = await sign(nonce+j)
 //           web3.eth.sendSignedTransaction(rawData.raw, (err, txHash) => {
 //               if (err) {
 //               console.log('error:', err);
 //               }
 //               else {
 //               console.log('nonce',nonce+j,',txHash:', txHash)
 //               }
 //           })
 //       }
 //       array.push(func())
 //   }
 //   await Promise.all(array);
}

// sendTrans(100)
// sign()

// batchSend(10)
//batchSend2(500)
//
console.log(process.argv)
batchSend2(process.argv[2])



/////////            node usePrivateKey.js  1  2000000000
