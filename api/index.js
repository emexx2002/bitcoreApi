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

        //Define the network
        const network = bitcoin.networks.bitcoin //use networks.testnet for testnet

        // Derivation path
        const path = `m/49'/0'/0'/0` // Use m/49'/1'/0'/0 for testnet

        let mnemonic = bip39.generateMnemonic()
        const seed = bip39.mnemonicToSeedSync(mnemonic)
        let root = bip32.fromSeed(seed, network)

        let account = root.derivePath(path)
        let node = account.derive(0).derive(0)

        let btcAddress = bitcoin.payments.p2pkh({
            pubkey: node.publicKey,
            network: network,
        }).address

        console.log(`
Wallet generated:
 - Address  : ${btcAddress},
 - Key : ${node.toWIF()}, 
 - Mnemonic : ${mnemonic}
     
`)

        //const data = {JSON.stringify({ data: [{ address: btcAddress, key: node.toWIF(), Mnemonic: mnemonic }] } };

        //  const cars = ["Saab", "Volvo", "BMW"];
        //set the response
        res.write(`
        Wallet generated:
         - Address  : ${btcAddress},
         - Key : ${node.toWIF()}, 
         - Mnemonic : ${mnemonic}
             
        `);
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
