//Import dependencies


var http = require('http');

const PORT = 5000


const server = http.createServer(async (req, res) => {
    //set the request route
    if (req.url === "/api" && req.method === "GET") {
        //response headers
        res.writeHead(200, { "Content-Type": "application/json" });
        const bip32 = require('bip32')
        const bip39 = require('bip39')
        const bitcoin = require('bitcoinjs-lib')

        const HDWallet = require('ethereum-hdwallet')



        //Define the network
        const network = bitcoin.networks.bitcoin //use networks.testnet for testnet

        // Derivation path
        const path = `m/49'/0'/0'/0` // Use m/49'/1'/0'/0 for testnet

        let mnemonic = bip39.generateMnemonic()
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
        res.write(JSON.stringify({ btcdata: [{ address: btcAddress, key: node.toWIF(), Mnemonic: mnemonic }], ethdata: [{ address: ethAddress, key: ethPKey, Mnemonic: mnemonic }], })

        );
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
