//Import dependencies


var http = require('http');

const PORT = 5000


const server = http.createServer(async (req, res) => {
    //set the request route
    if (req.url === "/api/transfer" && req.method === "GET") {
        //response headers
        res.writeHead(200, { "Content-Type": "application/json" });
        const bip32 = require('bip32')
        const bip39 = require('bip39')
        const bitcoin = require('bitcoinjs-lib')
        let mnemonic = bip39.generateMnemonic()

        const HDWallet = require('ethereum-hdwallet')

        const { generateAccount } = require('tron-create-address')
        const { Seed, WalletServer } = require('cardano-wallet-js');


        var bitcoreDoge = require("bitcore-lib-doge");

        let walletServer = WalletServer.init('http://cardano-wallet-testnet.iog.solutions:8090/v2/');
        //let recoveryPhrase = Seed.generateRecoveryPhrase();
        let mnemonic_sentence = Seed.toMnemonicList(mnemonic);
        let passphrase = 'safetangocrypto2020';
        let name = 'safetangocrypto-wallet';

        var input = Buffer.from(mnemonic.toString());
        var hash = bitcoreDoge.crypto.Hash.sha256(input);
        var bn = bitcoreDoge.crypto.BN.fromBuffer(hash);
        var pk = new bitcoreDoge.PrivateKey(bn);
        var WIF = pk.toWIF();
        let dogeaddress = pk.toAddress();
        console.log('p address:' + dogeaddress)
        //console.log("Mnemonic : " + mnemonic + ", WIF key : " + WIF + " ,private key : " + pk + " , Public key : " + dogeaddress);

        const RippleAPI = require('ripple-lib').RippleAPI;

        const api = new RippleAPI({
            server: 'wss://s1.ripple.com' // Public rippled server hosted by Ripple, Inc.
        });

        const xrpaddress = api.generateAddress();
        console.log('address', xrpaddress.address);
        console.log('secret', xrpaddress.secret);

        const { address, privateKey } = generateAccount()
        console.log(`Tron address is ${address}`)
        console.log(`Tron private key is ${privateKey}`)



        //Define the network
        const network = bitcoin.networks.bitcoin //use networks.testnet for testnet

        // Derivation path
        const path = `m/49'/0'/0'/0` // Use m/49'/1'/0'/0 for testnet


        const hdwallet = HDWallet.fromMnemonic(mnemonic)
        const seed = bip39.mnemonicToSeedSync(mnemonic)
        let root = bip32.fromSeed(seed, network)

        let account = root.derivePath(path)
        let node = account.derive(0).derive(0)

        let btcAddress = bitcoin.payments.p2pkh({
            pubkey: node.publicKey,
            network: network,
        }).address

        let ethAddress = `0x${hdwallet.derive(`m/44'/60'/0'/0/0`).getAddress().toString('hex')}`
        let ethPKey = hdwallet.derive(`m/44'/60'/0'/0/0`).getPrivateKey().toString('hex')

        console.log(`
Wallet generated:
 - Address  : ${btcAddress},
 - Key : ${node.toWIF()}, 
 - Mnemonic : ${mnemonic}
     
`)

        //const data = { 'Address': btcAddress, 'key': node.toWIF(), 'Mneminic': mnemonic };

        //  const cars = ["Saab", "Volvo", "BMW"];
        //set the response
        res.write(JSON.stringify({
            BTC: [{ address: btcAddress, key: node.toWIF(), Mnemonic: mnemonic }], ETH: [{ address: ethAddress, key: ethPKey, Mnemonic: mnemonic }],
            TRX: [{ address: address, key: privateKey }], XRP: [{ address: xrpaddress.address, key: xrpaddress.secret }],
            DOGE: [{ address: `${dogeaddress}`, key: `${pk}`, mnemonic: mnemonic }]
        })

        );
        //end the response
        res.end();
    } else if (req.url === "/api/v2/transfer" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        transfer = require('./transfer')
        let hello = transfer();
        //set the response
        res.write(hello);
        //end the response
        res.end();



    }

    // If no route present
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});

server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});


//export default server

//export default server

