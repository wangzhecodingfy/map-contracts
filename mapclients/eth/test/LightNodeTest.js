const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Relayer,LightNode start test", function () {

    let owner;
    let addr1;
    let addr2;
    let addr3;
    let addr4;
    let addr5;

    let verifyProof;
    let verifyProofContract;

    let lightClient;
    let lightNodeContract;
    let lightNodeContractAddress;

    let headerPlp = "0xf90279a09a2c09dc9f15e67f86dbf339e148ba0b4d0170fbfb72e420e30eaae1604b666994f18d71e825c43e5ee5f3bd0384670eef53a3309ea083c411e2b84bfdf0fd682b97b8b76907c8ae0dd7fb6f5dff9790dd1fbce5ddb3a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421b901000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001840130e0b6808461b3083eb8a0d7820302846765746888676f312e31352e36856c696e75780000000000000000f87ec0c080b841163f50d77d191c02c7fdd9b3967b018bbc82f3911dfe74bbcb793a8c0dc87b2633cbba77d0dba3305f467d985078cd72596f4fb20b363706e498570865b6f22e00f307b06a8dcc48dc7738d9873506c0c92ea747b2966bfce4c278b30fa27b63afb4069251b35a7d0056c0ec8eb2c653b3ecc80005c3808080a0000000000000000000000000000000000000000000000000000000000000000088000000000000000084342770c0"

    let header = [
        '0xbe969a97b675896c28bd335966142ecbb8055f3bd3ee6db3633972fb1a5c0bff',
        '0xA47444C9dAAC489777dfEB5f30b03A6F3B4b6337',
        '0xa03f640a889a8a4957b55255433d89a85ff08ab42d81590280f0f49506399b61',
        '0xfb5203303914ba108bd91e77e69f45124b630dfb23b5aa4c80ede1cd8db74020',
        '0x4cf51796b1d0879f6e4e1327bcfb076c672a72dab7be6e8dc77ee20674109814',
        '0x00000000000000200000400000000000080041000000008000000000000000000000010000000000000000200000010040000000800004000000000020200000020200000000000000000008000000000000000000000000000000008008000000000000020000000000000000000800000000001000000000000010200000000000000180000000000000000000000000000001000000000800010200000000020001000000000000000000200000000010000400000000000000000000011000000002000000010200020000000000000000000000000808000000000020000010000000000000008000000000000000000000000000400000000000000000',
        '2145638',
        '8000000',
        '160950',
        '1649851847',
        '0xd7820302846765746888676f312e31352e36856c696e75780000000000000000f8aec0c080b841f8cbb131f80ff58e82ba6ae89bbb5b3e5d5c87971ac5c6f04e9bd736d56a3aeb485574397571244a4b9da0ecd8f69111c67d9ab0ae63b6e817a3878c26472c2a01f30eb0bc888bf32d63fd40c5a3e247b426a6b7270029acc65e5b31cefcd56769215cd7f309b1c6fe850a978cedb7faf1ecd90080f30fb0f0e38417556f6d582f342807da189d474271507ddb967e10b473ee5d9709b6be32a5ded4420593744c658d3b3db77d0080',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000',
        '1000000000000'
    ]

    let headerHash;

    let rlpTxProve ="0xf90678b9021df9021aa01d6fb738cc56362afe68ca214793762accd09e6c6235ba8e2bdf09220ac3147aa01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d493479431022ef89d44e44c91b6e045e39086319ebd82aea0ceedecbd67c121e930a7ba05b76e1ac0010f53e7b17dec1492bbdfee48fd6b61a002f58750e0df869561e35fe4f37d992a591c2ac191bbd0245921e84bc3d72af8a084e55377663eaf19fa01e394121ceb68508b37e45f7ff45ebaf1da6b31bf8ee0b9010000000000000000000000000000000000200000000000000000000000000000000000000000080000000080000000000200000000000000040000000004200000000000000000000000000008000000000000000000000000080000000002000000000800000000004080000000400000000081000000000000001010000002008000000000000000000000000100000800000000000000000008000008000000020200000000002020000000000000000000000004000000000000000000000000000002000000000000000001000000000100010000000000000000000001000010000000000000000000000000000000000000000000000000001000000000847e9318f4838acb88837a121d83138e99845fb53d609cdb830300018c4f70656e457468657265756d86312e34332e31826c69a0c6d4f62b6e765e22dedd78d8be2f4ea9a77214501c667e37e080b73ae67e26a6887b1100000a8b6f71eb942252c2b255d20515666ae1a1fafd95b977886097942252c2b255d20515666ae1a1fafd95b9778860970ab9010cf90109018304b4b8b9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c0f9031af851a08efdfa43adca50cafb8e1628061847a0209eb9cdbeb4d46616cf4bcc20e5a5ca80808080808080a0e58215be848c1293dd381210359d84485553000a82b67410406d183b42adbbdd8080808080808080f901b180a0df0dba6ded9c6d2615bb89bc96156a0154ba6ebe5cc7f93716e6b38039b72449a06cde638d221b97a993d67ac84a363458c7ffbe89e799b867f3df7d4db83d1603a0b2ef94db7797a526995902b5304dd0bc5b7efd2ad875464a18d1fbb65be28904a053364e6fa056d9891d1f2e443e02675ed2c870a68e5c18a25fe99d2c4c70576ca04a110e344339bc53d22c026e43e5b0221e15350ff7b3fa0f439f07bb7011b8e3a0bbdc839943b747a24628101c3086e65ba0d111658da95b53c9554ecf90f7d9dda08c82e5c3c1352604de1ad7bfa27d168f156582adb74eb62665fa8f1b3a308f21a0f1c3678f9d4cb166be82e1dc65ab32bb3c3003e0d9a3af3b10463de483b7feb4a09bb5e0e3201ba8863804f7752ca2e39b95fe37efecd9d29b47b2570be6f3bfaaa016c1be187987d1ecd6d9ccb3e826ca86a1ff4ac16c89da9ada6fe7a6e07a4257a0815ad3537376ce2f9ec445c895e43d7160079d71ef5c0dc46a97b4b902265daba091dd325f0cb4305e846056e94d8bd5eb29f1719154c422aff1623e9215727f86a01f369b50c02a6065e66f5ec19193cf7371f5188b1bb416b1318699411f32fefe808080f9011020b9010cf90109018304b4b8b9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c0";



    let logs = [
        [
            "0xb586DC60e9e39F87c9CB8B7D7E30b2f04D40D14c",
            [
                "0x55b6db7dd8522bdf7ec2d1fb141241ed070d807546f1619b46d2e5844576395a",
                "0x00000000000000000000000005ab928d446d8ce6761e368c8e7be03c3168a9ec",
                "0x0000000000000000000000008b3be6c4ef99fbcd50934930b9f2b5893de26f98",
                "0x0000000000000000000000008b3be6c4ef99fbcd50934930b9f2b5893de26f98"],
            "0x81165384bf4941eefe0525f9ae2af050f3619e271e1bc27eed26ef878d6bda6f00000000000000000000000000000000000000000000000140b4e9349576800000000000000000000000000000000000000000000000000000000000000058f80000000000000000000000000000000000000000000000000000000000000001"
        ]
    ]

    let logHash;

    let extraData = "0xd7820302846765746888676f312e31352e36856c696e75780000000000000000f8aec0c080b841f8cbb131f80ff58e82ba6ae89bbb5b3e5d5c87971ac5c6f04e9bd736d56a3aeb485574397571244a4b9da0ecd8f69111c67d9ab0ae63b6e817a3878c26472c2a01f30eb0bc888bf32d63fd40c5a3e247b426a6b7270029acc65e5b31cefcd56769215cd7f309b1c6fe850a978cedb7faf1ecd90080f30fb0f0e38417556f6d582f342807da189d474271507ddb967e10b473ee5d9709b6be32a5ded4420593744c658d3b3db77d0080"
    let extra;


    beforeEach(async function () {

        [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();


    });

    it('verifyProof', async function () {

        const VerifyProofInfo = await ethers.getContractFactory("VerifyProof");
        verifyProof = await VerifyProofInfo.deploy();
        verifyProofContract = await verifyProof.deployed()

        console.log(verifyProofContract.address);

    });

    it("initialize,_encodeTxReceipt,_queryLog",async function () {
        const LightClient = await ethers.getContractFactory("LightNode");
         lightClient = await LightClient.deploy();
        lightNodeContract = await lightClient.deployed()
        lightNodeContractAddress = lightNodeContract.address;


        await lightClient.initialize(
            "0xf902aea06baa8e52bf924de7d419a45e136184546b666bfbf405b553ed8aef218151e8a394f22b4ae180279dabcf5cd8f4850545ae44521ce9a04ef5915116434d210eb813c2c2894440272d33fd415ee205a1be508e342b4058a0d7593a6973c2f2d94af2257c9428f8a00bb06891d88200251da94a1ac8d69500a041db3e75da563983d01c4ac081cd4e9d8e6208e81ecac9201385f888e440d906b901000000000000000000000200000000000000000000000000800000000000000000000000000000000000000020000000000020000000000000000800000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000200000000000000000000000000000000000000280000000000000000000000000000000000000000000000000000000000000000000000000000000083205f17837a120082c9b8846254e63cb8d0d7820302846765746888676f312e31352e36856c696e75780000000000000000f8aec0c080b841d857aebb465877a8accb4ac777ef5f52f35065f996cb8e54b76302f16667fc3077bc0fd4620b8119815bb7cd4f9167bf902602c604f5b1ec41453b13c5960bdb01f30eb09d9b0c2a063f70821f747ccec2ef0930e0a9586a0ef2e019b2a7a8423f4380948cd76868577f77e3eba51b320b56990080f30fb0e9901558de72b798baa869098b7ad1c3e0c66fb65931badbb5b797f7f8115bdb15bec6f05364250447bd7a1c801b100180a0000000000000000000000000000000000000000000000000000000000000000088000000000000000085e8d4a51000",
            "88"
        )

        console.log("epochs:"+ await lightClient.currentEpoch());
        console.log("blsKey:"+ await lightClient.currentValidators());



        //logHash = await lightClient._encodeTxReceipt(logs)
        //console.log(datalog);

        //console.log(await lightClient._decodeTxReceipt(logHash))
        //expect(await lightClient._decodeTxReceipt(logHash)).to.equal(logs);

        //console.log(await lightClient._decodeTxReceipt(datalog));

        let txDataLog = await lightClient._queryLog("0xb586dc60e9e39f87c9cb8b7d7e30b2f04d40d14c",logs)
        console.log("transactionLog:" + txDataLog.lg );





    });

    // it('_verifyTxParams', async function () {
    //     let verifyData = await lightClient._verifyTxParams("56","22776",
    //         ["0x8b3be6c4ef99fbcd50934930b9f2b5893de26f98","0x8b3be6c4ef99fbcd50934930b9f2b5893de26f98","999935000000000000"],
    //         ["0xb586dc60e9e39f87c9cb8b7d7e30b2f04d40d14c",
    //             [
    //                 "0x55b6db7dd8522bdf7ec2d1fb141241ed070d807546f1619b46d2e5844576395a",
    //                 "0x0000000000000000000000002170ed0880ac9a755fd29b2688956bd959f933f8",
    //                 "0x0000000000000000000000008b3be6c4ef99fbcd50934930b9f2b5893de26f98",
    //                 "0x0000000000000000000000008b3be6c4ef99fbcd50934930b9f2b5893de26f98"
    //             ],
    //             "0xbad75341622c0770b660c7cb44114d229d6e8095993ad7bd082fc4e6418930db0000000000000000000000000000000000000000000000000de07b95a97af000000000000000000000000000000000000000000000000000000000000000003800000000000000000000000000000000000000000000000000000000000058f8"
    //         ])
    //     console.log("VerifyResult:"+verifyData);
    //
    //
    //    // console.log(await lightClient._bytesSlice32("0xbad75341622c0770b660c7cb44114d229d6e8095993ad7bd082fc4e6418930db0000000000000000000000000000000000000000000000000de07b95a97af000000000000000000000000000000000000000000000000000000000000000003800000000000000000000000000000000000000000000000000000000000058f8" ,96));
    // });

    it('txVerify', async function () {

         await lightClient.setVerifyer(verifyProofContract.address);

        let headerTestData = [
            '0x1d6fb738cc56362afe68ca214793762accd09e6c6235ba8e2bdf09220ac3147a',
            '0x31022eF89D44e44c91B6E045e39086319eBd82aE',
            '0xceedecbd67c121e930a7ba05b76e1ac0010f53e7b17dec1492bbdfee48fd6b61',
            '0xaf9c6845c3a2e370ba5674608bd93ebbc220b2acc1a2e9019e87d792baf1ccf4',
            '0x84e55377663eaf19fa01e394121ceb68508b37e45f7ff45ebaf1da6b31bf8ee0',
            '0x00000000000000000000000000000000200000000000000000000000000000000000000000080000000080000000000200000000000000040000000004200000000000000000000000000008000000000000000000000000080000000002000000000800000000004080000000400000000081000000000000001010000002008000000000000000000000000100000800000000000000000008000008000000020200000000002020000000000000000000000004000000000000000000000000000002000000000000000001000000000100010000000000000000000001000010000000000000000000000000000000000000000000000000001000000000',
            '9096072',
            '8000029',
            '1281689',
            '1605713248',
            '0xdb830300018c4f70656e457468657265756d86312e34332e31826c69',
            '0xc6d4f62b6e765e22dedd78d8be2f4ea9a77214501c667e37e080b73ae67e26a6',
            '0x7b1100000a8b6f71',
            '0'
        ]

        let statusInfo = await lightClient.getStatus("true");
        console.log(statusInfo);

        let _hash = "0x84e55377663eaf19fa01e394121ceb68508b37e45f7ff45ebaf1da6b31bf8ee0";
        let  _expectedValue  ="0xf90109018304b4b8b9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c0";
        let proofs = [
            "0xf851a08efdfa43adca50cafb8e1628061847a0209eb9cdbeb4d46616cf4bcc20e5a5ca80808080808080a0e58215be848c1293dd381210359d84485553000a82b67410406d183b42adbbdd8080808080808080",
            "0xf901b180a0df0dba6ded9c6d2615bb89bc96156a0154ba6ebe5cc7f93716e6b38039b72449a06cde638d221b97a993d67ac84a363458c7ffbe89e799b867f3df7d4db83d1603a0b2ef94db7797a526995902b5304dd0bc5b7efd2ad875464a18d1fbb65be28904a053364e6fa056d9891d1f2e443e02675ed2c870a68e5c18a25fe99d2c4c70576ca04a110e344339bc53d22c026e43e5b0221e15350ff7b3fa0f439f07bb7011b8e3a0bbdc839943b747a24628101c3086e65ba0d111658da95b53c9554ecf90f7d9dda08c82e5c3c1352604de1ad7bfa27d168f156582adb74eb62665fa8f1b3a308f21a0f1c3678f9d4cb166be82e1dc65ab32bb3c3003e0d9a3af3b10463de483b7feb4a09bb5e0e3201ba8863804f7752ca2e39b95fe37efecd9d29b47b2570be6f3bfaaa016c1be187987d1ecd6d9ccb3e826ca86a1ff4ac16c89da9ada6fe7a6e07a4257a0815ad3537376ce2f9ec445c895e43d7160079d71ef5c0dc46a97b4b902265daba091dd325f0cb4305e846056e94d8bd5eb29f1719154c422aff1623e9215727f86a01f369b50c02a6065e66f5ec19193cf7371f5188b1bb416b1318699411f32fefe808080",
            "0xf9011020b9010cf90109018304b4b8b9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c0"
        ];
        let _key = "0x0005";

        let txLogsData = [
            "0x01",
            "308408",
            "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            []
        ]

       // console.log(await  lightClient.getVerifyExpectedValue(txLogsData,_expectedValue));

        console.log(await lightClient._decodeExpectedValue(_expectedValue));
        //console.log(await  lightClient._encodeTxReceipt(logs));
        console.log(await lightClient.getVerifyExpectedValueHash(txLogsData));

        let txProveData = [
            "0x0005",
            proofs,
            _expectedValue
        ]

        // let TxData = [
        //     "0x8b3be6c4ef99fbcd50934930b9f2b5893de26f98",
        //     "0x8b3be6c4ef99fbcd50934930b9f2b5893de26f98",
        //     "999935000000000000"
        // ]


        let proveData = [
            headerTestData,
            txLogsData,
            txProveData
        ]

       //console.log(proveData)
        console.log(await lightClient.getVerifyTrieProof(proveData));
      //  let headerHash = "0xf902afa0be969a97b675896c28bd335966142ecbb8055f3bd3ee6db3633972fb1a5c0bff94a47444c9daac489777dfeb5f30b03a6f3b4b6337a0a03f640a889a8a4957b55255433d89a85ff08ab42d81590280f0f49506399b61a08b98f41bf59d6e357c8020f04138490d5481a338320d219613c8cce82bcca7dea04cf51796b1d0879f6e4e1327bcfb076c672a72dab7be6e8dc77ee20674109814b90100000000000000002000004000000000000800410000000080000000000000000000000100000000000000002000000100400000008000040000000000202000000202000000000000000000080000000000000000000000000000000080080000000000000200000000000000000008000000000010000000000000102000000000000001800000000000000000000000000000010000000008000102000000000200010000000000000000002000000000100004000000000000000000000110000000020000000102000200000000000000000000000008080000000000200000100000000000000080000000000000000000000000004000000000000000008320bd66837a1200830274b6846256bdc7b8d0d7820302846765746888676f312e31352e36856c696e75780000000000000000f8aec0c080b841f8cbb131f80ff58e82ba6ae89bbb5b3e5d5c87971ac5c6f04e9bd736d56a3aeb485574397571244a4b9da0ecd8f69111c67d9ab0ae63b6e817a3878c26472c2a01f30eb0bc888bf32d63fd40c5a3e247b426a6b7270029acc65e5b31cefcd56769215cd7f309b1c6fe850a978cedb7faf1ecd90080f30fb0f0e38417556f6d582f342807da189d474271507ddb967e10b473ee5d9709b6be32a5ded4420593744c658d3b3db77d0080a0000000000000000000000000000000000000000000000000000000000000000088000000000000000085e8d4a51000";
        // let proveInfos = await lightClient._decodeHeader(headerHash);
        // //console.log(proveInfos);

       // console.log(await lightClient._encodeHeader(header));

        // let headerInfo = await lightClient._decodeHeader(proveInfo.header);
        // console.log("header:" + headerInfo);

        // let logsInfo = await lightClient._decodeTxReceipt(proveInfo.receipt);
        // console.log(logsInfo);

       //console.log(await lightClient._encodeTxReceipt())
       //  console.log(await lightClient.getProof(
       //      rlpTxProve,
       //     // "0x4cf51796b1d0879f6e4e1327bcfb076c672a72dab7be6e8dc77ee20674109814"
       //  ))

        // console.log( await lightClient.txVerify(
        //     "0xb586dc60e9e39f87c9cb8b7d7e30b2f04d40d14c",
        //     "56",
        //     "22776",
        //     proveData
        // ))


    });

    it('_encodeHeader,_decodeHeader',async function () {

       headerHash = await lightClient._encodeHeader(header);
        console.log("header:" + headerHash);

       await  lightClient._decodeHeader(headerHash);

    });

    it('_decodeExtraData', async function () {
       //let headerInfo = await lightClient._decodeHeader(headerPlp);
        //console.log(headerInfo);

       // extra = await lightClient._decodeExtraData(headerInfo.extraData);
        //console.log(extra);

       // let extraDataPre = await lightClient.splitExtra(headerInfo.extraData);
        //console.log(extraDataPre);

        //let extraDeleteAgg = await lightClient._deleteAgg(extra,extraDataPre);
        //console.log("agg-----" + extraDeleteAgg);

        //let extraDeleteAgg1 = await lightClient._deleteAgg(extra,headerInfo.extraData);
        //console.log("agg1-----" + extraDeleteAgg1);

        //let extraDleleteAanAggData1 = await lightClient._deleteSealAndAgg(extra,extraDataPre);
        //console.log( "data1-----"+extraDleleteAanAggData1);


        //let extraDleleteAanAggData2 = await lightClient._deleteSealAndAgg(extra,extraDeleteAgg);
        //console.log("data2-----" + extraDleleteAanAggData2)


        //console.log( await lightClient._decodeExtraData(extraData));
       //console.log(await lightClient.splitSignature("0x5113031cf7d57d9d111ac902b582bc855c029cab4d524de47cac0ae9127d0dd01ce8ef84d20b3465cea5d99c3889103ab7ec2c7b11447762a1920d6f1838147b01"))
        //console.log(await lightClient._deleteAgg(extra,extraData));
        //console.log(await lightClient._deleteSealAndAgg(extra,extraData))


        //header[10] = extraDeleteAgg;


        //console.log( header);
        // headerInfo.extraData = extraDleleteAanAggData1
        // console.log(headerInfo)
        // let header1 = [
        //         '0x9a2c09dc9f15e67f86dbf339e148ba0b4d0170fbfb72e420e30eaae1604b6669',
        //         '0xF18D71e825C43e5Ee5F3bD0384670eEf53a3309e',
        //         '0x83c411e2b84bfdf0fd682b97b8b76907c8ae0dd7fb6f5dff9790dd1fbce5ddb3',
        //         '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
        //         '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
        //         '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        //          "1" ,
        //          "19980470" ,
        //          "0" ,
        //       "1639123006" ,
        //         extraDleleteAanAggData2,
        //         '0x0000000000000000000000000000000000000000000000000000000000000000',
        //         '0x0000000000000000',
        //       "875000000" ,
        // ]
        // console.log( header1);
        //
        // let hashHeader = await lightClient._encodeHeader(header1);
        // console.log(hashHeader);



        // let blockInfo = await lightClient._encodeSealHash(
        //     "2145638",
        //     "0xe1c1aede3f35eb0d7028a48624528058516f2d86fe3e9c8e936d640f3efc09c1",
        //     "0xA47444C9dAAC489777dfEB5f30b03A6F3B4b6337"
        //
        // );


        //console.log("headerHash:" +headerHash);

        // let dataHash5 = await lightClient.getHash(hashHeader);
        // console.log("hash3------" + dataHash5.hash3);
        // console.log("hash1------" + dataHash5.hash1);

        //console.log("seal:" + extra.seal)
      // console.log(await lightClient._verifySign(extra.seal,dataHash5.hash3,"0xF18D71e825C43e5Ee5F3bD0384670eEf53a3309e"));



    });

    it('_verifyHeader ', async function () {
       console.log(await lightClient._verifyHeader(headerPlp));
       // console.log(await lightClient._decodeHeader("0xf903e4a00000000000000000000000000000000000000000000000000000000000000000940000000000000000000000000000000000000000a083c411e2b84bfdf0fd682b97b8b76907c8ae0dd7fb6f5dff9790dd1fbce5ddb3a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421b9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000808401312d008080b9020e0000000000000000000000000000000000000000000000000000000000000000f901ebf85494f18d71e825c43e5ee5f3bd0384670eef53a3309e94f22b4ae180279dabcf5cd8f4850545ae44521ce994a47444c9daac489777dfeb5f30b03a6f3b4b6337941f39d97a8f697502884fe01cf23dba4eb66e0481f90188b86041df7be08167a3c7635716418eb42508bee7d97165e6f3482fb55c0a32d2cdc07c8170b97e427c667a87fb8e6f041700b2b1dce0d01a8adadc5816c2c28762ad28730faa9464e65ae7e8031f45fdd7205c499fd92a41ccec5bc97f2dd15da700b860051fe96e2b46e5708d4081be01ecebadba33a9ec37c9c4219a509b1ff7f1a5f3a3866e4a67050df207cc6546ced94c006f67908ad64656566bb58ebce7ec6bb1a2534c40bf94f6ad205c686ff1ccad1be221c1c82a00cdf989ff98b418810200b86038030897213e9b7837e600785e3376214948c9bafda2551315fe969206d0be434661c8b4dd6a6298b7f9896efcf3dc002bfd7c2b4d1c7224b0516c76e5ac7fd58a6e72e22b58debcbcaa2b9c72837d6faa6e8e64e02ca222e3ebfd07f25a0580b860d8b24d419755d8d82b878993d58e7ddd19a19988e00ba55adff574dd9e3df3b45451fe2e56c5793048b0a2c617b11601c451c63e1ce5730f3877a77c026dfdb40349543dfef722dde6f4e06aaf3070ed740d26ae9193d893f5e9d87b67c460808080c3808080c3808080a00000000000000000000000000000000000000000000000000000000000000000880000000000000042843b9aca00"))

        lightClient.save(headerPlp);


    });





});
