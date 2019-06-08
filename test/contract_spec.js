// /*global contract, config, it, assert*/

const FacultyRating = require('Embark/contracts/FacultyRating');

let accounts;

// For documentation please see https://embark.status.im/docs/contracts_testing.html
config({
  //deployment: {
  //  accounts: [
  //    // you can configure custom accounts with a custom balance
  //    // see https://embark.status.im/docs/contracts_testing.html#Configuring-accounts
  //  ]
  //},
  contracts: {
    "FacultyRating": {
      args: [
        ["0x5dc59f8f0d5a190068424a9006cf583e7abdd64c","0xcb88b6b42c802aed732829bd30416ff962616be0","0x80c843af8e5ae9153538d759f7ad35e9461b5699","0x89858009a5805ef26fb866750cdf1f679825e9b9","0xe7f114591446e149ad12892c0ae5c0fa48adbcac"],
        ["0x13d046b3d364ae7bedda764cee2ecaf1871417b3","0xc5cfc420676bfa7c8be134091212bc0e0470fdf5","0xaba6d155158d6eac14d91783132eb71c010e1865","0x809f71a58a39d621346c31535380753f8d1e826b"]
      ]
    }
  }
}, (_err, web3_accounts) => {
  accounts = web3_accounts
});

contract("FacultyRating", function () {
  this.timeout(0);
  it("Lab3PersonalAccounting was deployed", async () => {
    let address = await Lab3PersonalAccounting.options.address;
    assert.ok(address);
  });
}

