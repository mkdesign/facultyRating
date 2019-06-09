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
  it("rate my professor contract was deployed", async () => {
    let address = await FacultyRating.options.address;
    assert.ok(address);
  });
  it("isWhiteListed for student with valid address", async function(){
    await FacultyRating.methods.isWhiteListed("0x5dc59f8f0d5a190068424a9006cf583e7abdd64c").send({from: accounts[0]});
    let result = await FacultyRating.methods.isWhiteListed("0x5dc59f8f0d5a190068424a9006cf583e7abdd64c").call();
    //expect(result).to.be.true;
    assert.equal(result, true);
  });
  it("isWhiteListed for student with invalid address", async function(){
    try{
      await FacultyRating.methods.isWhiteListed("0x0000000000000000000000000000000000000000").send({from: accounts[0]});
    }
    catch(error){
      let actualMessage = error.message;
      let expectedMessage = "Account is zero address";
      assert(actualMessage.includes(expectedMessage));

    }
  });
//testing addWhiteList function 
  it("add unlisted address to whitelist as admin", function(){
    FacultyRating.methods.addWhiteList("0x80c846af8e5ae9153538d759f7ad35e9461b5699").send({from: accounts[0]});
  });
  it("add unlisted address to whitelist as non-admin", async function(){
    try{
      await FacultyRating.methods.addWhiteList("0x89858009a5805ef26fb866750cdf1f679825e9b9").send({from: accounts[1]});
    }
    catch(error){
      let actualMessage = error.message;
      let expectedMessage = "Request denied, you are not admin!";
      assert(actualMessage.includes(expectedMessage));
    }
  });
  context("add listed address to whitelist", function(){
    // beforeEach(async function(){
    //   await FacultyRating.methods.addWhiteList("0xe7f114591446e149ad12892c0ae5c0fa48adbcac").send({from: accounts[0]});
    // });
    let listedAddress = "0x5dc59f8f0d5a190068424a9006cf583e7abdd64c"
    it("as admin", async function(){
      try{
        await FacultyRating.methods.addWhiteList(listedAddress).send({from: accounts[0]});
      }
      catch(error){
        let actualMessage = error.message;
        let expectedMessage = "The account is already exist";
        assert(actualMessage.includes(expectedMessage));
      }
    });
    it("as non-admin", async function(){
      try{
        await FacultyRating.methods.addWhiteList(listedAddress).send({from: accounts[1]});
      }
      catch(error){
        let actualMessage = error.message;
        let expectedMessage = "Request denied, you are not admin!";
        assert(actualMessage.includes(expectedMessage));
      }
    });
  });

  context("remove listed people from the list", async function(){
    // beforeEach(async function(){
    //   await FacultyRating.methods.addWhiteList("0xe7f114591446e149ad12892c0ae5c0fa48adbcac").send({from: accounts[0]}); 
    // });
    let listedAddress = "0x5dc59f8f0d5a190068424a9006cf583e7abdd64c"
    it("as admin", async function(){
      await FacultyRating.methods.removeFromWhiteList(listedAddress).send({from: accounts[0]});
    });
    it("as non-admin", async function(){
      try{
        await FacultyRating.methods.removeFromWhiteList(listedAddress).send({from: accounts[1]});
      }
      catch(error){
        let actualMessage = error.message;
        let expectedMessage = "Request denied, you are not admin!";
        assert(actualMessage.includes(expectedMessage));
      }
    });
  });
  context("remove unlisted people from the list", async function(){
    it("as admin", async function(){
      try{
        await FacultyRating.methods.removeFromWhiteList("0x583031d1113ad414f02576bd6afabfb302140225").send({from: accounts[0]});
      }
      catch(error){
        let actualMessage = error.message;
        let expectedMessage = "The account is not on whiteList.";
        assert(actualMessage.includes(expectedMessage));
      }
    });
    it("as non-admin", async function(){
      try{
        await FacultyRating.methods.removeFromWhiteList("0x583031d1113ad414f02576bd6afabfb302140225").send({from: accounts[1]});
      }
      catch(error){
        let actualMessage = error.message;
        let expectedMessage = "Request denied, you are not admin!";
        assert(actualMessage.includes(expectedMessage));
      }
    });
  });

  context("sending feedback to existed teacher", async function(){
    let teacher="0x13d046b3d364ae7bedda764cee2ecaf1871417b3";
    let rate = 10;
    //let listedMem = "0x5dc59f8f0d5a190068424a9006cf583e7abdd64c"
    before("list admin addr", async function(){
      let listedMem = accounts[0];
      await FacultyRating.methods.addWhiteList(listedMem).send({from: accounts[0]});
    })
    it("sending feedback to existed teacher as listed member", async function(){
      await FacultyRating.methods.sendFeedBack(teacher,rate).send({from: accounts[0]});
    });
    it("sending feedback to existed teacher as non-listed admin", async function(){
      try{
        await FacultyRating.methods.sendFeedBack(teacher, rate).send({from: accounts[0]});
      }
      catch(error){
        let actualMessage = error.message;
        let expectedMessage = "You must be on the whitelist in order to send feedback.";
        assert(actualMessage.includes(expectedMessage));
      }
    });
  });
  context("sending feedback to nonexistent teacher address", async function(){
    let nonexistentTeacher = "0xca35b7d915458ef540ade6068dfe2f44e8fa733c";
    let rate = 5;
    it("sending feedback as unlisted admin", async function(){
      try{
        await FacultyRating.methods.sendFeedBack(nonexistentTeacher,rate).send({from: accounts[0]});
      }
      catch(error){
        let actualMessage = error.message;
        //console.log(error.message)
        let expectedMessage = "this teacher does not exist";
        assert(actualMessage.includes(expectedMessage));
      }
    });
    it("sending feedback as listed admin", async function(){
      //await await FacultyRating.methods.addWhiteList(accounts[0]).send({from: accounts[0]});
      try{
        await FacultyRating.methods.sendFeedBack(nonexistentTeacher,rate).send({from: accounts[0]});
      }
      catch(error){
        let actualMessage = error.message;
        let expectedMessage = "this teacher does not exist";
        assert(actualMessage.includes(expectedMessage));
      }
    });
  });
  context("getting rating of the listed teacher", async function(){
    let ratedTeacher = "0xc5cfc420676bfa7c8be134091212bc0e0470fdf5";
    //let rate = 10;
    
    it("getting rating as admin", async function(){
      await FacultyRating.methods.getRates(ratedTeacher).send({from: accounts[0]});
      let teachersRate = await FacultyRating.methods.getRates(ratedTeacher).call();
      assert.equal(teachersRate, "0");
    });
    it("getting rating as non-admin", async function(){
      try{
        await FacultyRating.methods.getRates(ratedTeacher).send({from: accounts[1]});
        let teachersRate = await FacultyRating.methods.getRates(ratedTeacher).call();
      }
      catch(error){
        let actualMessage = error.message;
        let expectedMessage = "Request denied, you are not admin!";
        assert(actualMessage.includes(expectedMessage));
      }
    });
  });
  context("getting rating of the unlisted teacher", async function(){
    let unlistedTeacher = "0xdd870fa1b7c4700f2bd7f44238821c26f7392148";
    it("getting unlisted teacher's rating as admin", async function(){
      try{
        await FacultyRating.methods.getRates(unlistedTeacher).send({from: accounts[0]});
        let teachersRate = await FacultyRating.methods.getRates(ratedTeacher).call();
      }
      catch(error){
        let actualMessage = error.message;
        let expectedMessage = "this teacher does not exist";
        assert(actualMessage.includes(expectedMessage));
      }
    });
    it("getting unlisted teacher's rating as non-admin", async function(){
      try{
        await FacultyRating.methods.getRates(unlistedTeacher).send({from: accounts[1]});
        let teachersRate = await FacultyRating.methods.getRates(ratedTeacher).call();
      }
      catch(error){
        let actualMessage = error.message;
        let expectedMessage = "Request denied, you are not admin!";
        assert(actualMessage.includes(expectedMessage));
      }
    })
  })
})

