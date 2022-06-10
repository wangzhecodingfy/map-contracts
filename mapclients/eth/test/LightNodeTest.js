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


    let blsCode;
    let bc;


     let header =
        [
            '0x55c7e51c72094013140782a4b58a8ce54cf0e269ef40090bed532915ff8bcba3',
            '0x16FdBcAC4D4Cc24DCa47B9b80f58155a551ca2aF',
            '0x9f1882228048b3b6fcd16e33ded392dda1aaf06548cfa5fd035c6f71cfab5c27',
            '0xd3ef08509b58dd0bc78ad813f8d0dcbb0815bacd178418a7e1349159133015b4',
            '0x3d0a4f1e4cb1ad9502dc205b56c8d147d27e88f66c784e4ea7dcff83bedd1aed',
            '0x00000800000000000000000000000000000000000000000040000000000020000000000000000000200000000000000000000000000000000100000000000000000000000000000000000008400000000000000000000000000000000000000000000000000020000000800000000000000000000000000000000010000000000000000000000000000000000000000000000000000000020000020000810000000000000000000000000000000000000000000000000000000000000000001000000002000000000000000000000000000000000000000000000000000000000008000000000000000400000000000000000000000000000000000000000000',
            '53828',
            '8000000',
            '105029',
            '1653550219',
            '0xd7820304846765746888676f312e31352e36856c696e75780000000000000000f8d3c0c0c080b841ae5d714f8dfc16a910385e654a5e686388d9aeaeeefa21f3517e3cecc0a82071090f3f3fc68c12189fea8b87811e58ca2a25e5b9f682d3fe14192599a3e5f35201f8440bb8400dfd6c83fad64379b4a012781ce61bf565f351da95600e476c98d3f69413799a02f06decf57ccde54cd821ba944192653fb45f5851266fa994e1edbb9e04835d80f8440fb8402140e41b34e47f8619a67c0de3da7db6e8c323baf0bd678b6d65917dbdfbb8de2b69b1a0f4a64e50103b048573f1e132f461113338a872d30266b4654993299c80',
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            '0x0000000000000000',
            '100000000000'
        ];

    let header1 =
        [
            '0x607a00fd2ece0fc5c875d80114a2812f099da7c609cf456a83b8cef7c8b4d8d4',
            '0x7607c9cdd733d8cDA0A644839Ec2bAc5Fa180eD4',
            '0xa78c350e781193a2ef5fa260e1596c8b83be35bf8779e5ae01f466b4fe82c2a5',
            '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
            '0xc6d25f717cec0e7dbcff98d282f4a2d7e327133ca953d83ef37eca9175bb02cb',
            '0x10040000000000000000000000000000000000000000000000000000081020010000000080800000000000000100000200000000000008800000000004008000100000200000000000000008000000000000000000800000000000000000000000008000020000000000000100000800000100000a00400000000010000008000000000000000000000000000000000000000000000000000000200000000000000000080000000080002000000080020000000000800000000000000000000000000002004002000000000100400080040080000000010000000000000020000400000000000000000000000a00000000004000000000004000000000000000',
            '1000',
            '8000000',
            '0',
            '1654593276',
            '0xd7820304846765746888676f312e31352e36856c696e75780000000000000000f8d3c0c0c080b84172941ecd53450ff52f6315872f3cdc8769c98025dc95dbd0503efc80ba0578e56de555e25dc33fbe461f82310df19eeadf20f4bfb7905f87da4b2d4760ce853c00f8440db84004017fa35d23482fb010423283569b741e611cfb967ee12673805bdecff8919a1c590bd715dbc1f6a8e133983225b571b8db7c349a2405cb15a266bcf1ed09b280f8440fb84009168743f4edbd649fe78550c30a550f750de2634a366588a70d15e2c5af4fb71b96e5fdc1e066b4b7a0ce799cc479d14535aef536e06cb34cf273321e11d0c780',
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            '0x0000000000000000',
            '100000000000'
        ];

    let aggPK1 =
        [
            "0x1e765f27b1bc2822f1543fec2a14530db0eb56175e2cd5bc7c6567ef7d605204",
            "0x10ebefa20bce22d0bce4bba43a151c8eedfed5c6487e98e21907da5384aba903",
            "0x19933df8221f1532677d57c1bafb9220fa098a4774a482b37c98746d32d25ed3",
            "0x1e9dcff0a16587d79dd67fc7917cdce9c2813b4e47adc7a1803e121e7cff9995"
        ];

    let header17 =
        [
            '0x11d1bdbe99cf7beab3fcc90370d3ad07c16ef657595a9fcad373124cd1e300ae',
            '0xb4e1BC0856f70A55764FD6B3f8dD27F2162108E9',
            '0x64a061f0e370c445872c195ff0f4f7d76b619a74bc355367b60a1e5dfb3080aa',
            '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
            '0x30f31274204607eff0960a36ad4677f10df08abab4171790ab24ba64de36a5f8',
            '0x10040000000000000000000000000000000000000000000000000000081020010000000080800000000000000100000200000000000008800000000004008000100000200000000000000008000000000000000000800000000000000000000000008000020000000000000100000800000100000a00400000000010000008000000000000000000000000000000000000000000000000000000200000000000000000080000000080002000000080020000000000800000000000000000000000000002004002000000000100400080040080000000010000000000000020000400000000000000000000000a00000000004000000000004000000000000000',
            '17000',
            '8000000',
            '0',
            '1654673276',
            '0xd7820304846765746888676f312e31352e36856c696e75780000000000000000f8d3c0c0c080b841d9bce14bad5aaaff52437f800d4a2595526830cc37340f21136322565d1dcb1465e96a766aa3c23aade6e6e7dfaa4dd4e1aa20176e5b1d09f5694a0b231c7ec801f8440bb840293d6fe49e0c01df1856447222d21dddea224ff8d92215f2fab0a12109a892b90c88ac85d8b9edc5f73db75028d6b4eb256e9d14a695cf915ab77863f7e4c55380f8440fb8402b1d4bef0ca2c3db984848317559cab9d18ff271289666b7ead2d06ef920a5f91f0d00917537f24938b7d37134da880144b49d1f0b54b7830f49d9146df8e5fd80',
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            '0x0000000000000000',
            '100000000000'
        ];


    let aggPK17 =
        [
            "0x1be18aedd99fb45417482e31b131f56c159e105b4398ebf7f808eed293f18837",
            "0x0f149ba9a53cea459067c574c09e843ade5415f2425204e8bd70f39ed546f560",
            "0x13b701b0110eaf8a260d2d47c383d16c80af33bf20b7a3602f646fc78cac05f8",
            "0x1ef18cd7d88c8439ba45ff4d510fabfadd0e7b44dfe00a4672684c3676f92619"
        ];

    let header18 =
        [
            '0x4ee98470c66eeeed1be95cdf5fafbb8dfed2c05ee2d1cd237848e0f855337395',
            '0xb4e1BC0856f70A55764FD6B3f8dD27F2162108E9',
            '0x370316241afbbbce5cb3e5e49a39b7dac3209f35eb46c0ce8e923a01de395070',
            '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
            '0x767a1aa5f6e39a2682701c5f5160ff8c03fef61e0562563a9e163dc9c02077bb',
            '0x10040000000000000000000000000000000000000000000000000000081020010000000080800000000000000100000200000000000008800000000004008000100000200000000000000008000000000000000000800000000000000000000000008000020000000000000100000800000100000a00400000000010000008000000000000000000000000000000000000000000000000000000200000000000000000080000000080002000000080020000000000800000000000000000000000000002004002000000000100400080040080000000010000000000000020000400000000000000000000000a00000000004000000000004000000000000000',
            '18000',
            '8000000',
            '0',
            '1654678276',
            '0xd7820304846765746888676f312e31352e36856c696e75780000000000000000f901aed5942673412d42b76bf89e17618e29949187f20cc420f882b88007ec86c8473a4db8c61bda55a88c16d5849202e73b5197393de33c5ccfa352502269c6a07985250219734455b1002870f0596f55859f37a6f7e3699b861a42a72d415c5e34673383c34273e3ca50c219e6c71825a5f70db8b9324a58dcd66dd81f250931181428a18e463fd457407c4ec46b4300e1c1f090bde57cda28f9c40ff842b840058dac972571094f3c7be404030e7c70a5115ee0aa0ec113705e6596c1a3126008ebb41053052485a37a5f234baa3426725a3d189ace18181948ea5b67e1885380b8419b1ba312a51a22d5d84dbbc6313f7c8345d6bb84f4c180fdea891d180354d30b2f8a81ef0c69f6172ff80a5005ed089542498d185e85d165543badf4d716614a00f8440eb84013f8c72d3cff53c5fcbf34fa5efcb38a7a1660479076c5b9cae53c08a56c944224ab94da1fafd58ccbfd633be1290c817cf75293c491c6ec453e0766b629acd680f8440fb8400490658f7b370eb795bac3436c9a04202952a32de9b86f8bd569a080d5c09fa70f274d377c829c33136bd02c9a7b8270381173cf716ae2a6e3f2ae1638f5bde480',
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            '0x0000000000000000',
            '100000000000'
        ];

    let aggPK18 =
        [

            "0x152bb6d9b41151a2f6774afe12450ae2760f571009246a1408f9e0e5012a18d7",
            "0x028120ae77c88dfa049c595d69f6186be11a2187cebbf04f2a1d2fde8691dfb4",
            "0x1419a80b2f032c886f02b0a0565e90746a8d5921ea5b755f887737b20f687246",
            "0x13a77b0eb9ddf3e6b6d2fa165a02695015a29f26b6298ceb2bdcd73f991e7c92"
        ];

    let header19 =
        [
            "0x42717ebf940dbb271ec27938a018e524dd55611eb5c86e393ad9702b84eca57e",
            "0x7A3a26123DBD9CFeFc1725fe7779580B987251Cb",
            "0xdd0d0d88a1de6cab731dfcfa9fc11f8955b536bdd06c5cf99acfffc22597c87e",
            "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
            "0xa571828dbdd70002709cbd614050e3152d8816d96b7cac3fb818b13df05d2dfd",
            "0x10040000000002000000000000000000000000000000000000200000081020010000020080800000000000000100000200000000000008800000000004008000100000200000000000000008000000000000000000800000000000000000000000008000020000000000000100000800000100000a00400000000010000008000000000000000000000000000000000000000000000000000000200000000000000000080000000080002000000080020000000000800000000000000000000000008002004002000000000100400080040080000000010000000000000020000400000000000000000000000a0000000000c000000000004000000000000000",
            "19000",
            "8000000",
            "0",
            "1654683276",
            "0xd7820304846765746888676f312e31352e36856c696e75780000000000000000f8d3c0c0c080b8417db7381e2565d7e9a66aae90592d6207953c14a9317d50f23348e424426ca05e2c3684467742f4148c8f09e48bdaf26d2a64cca511cb9ecb4d75d7b97a9c1e1501f8440fb840139b522eb898776d97b7564e4532ef4cbcedb5c0112ee84df7a3030faa650aaa1742e36351ac0e066231c94b0d1c24411ac723954ca18edfc21f5790910c5bc801f8440fb8400a11d3c08adced452fc9be55e738f567551cba1e33608269950bba24239ba83f013c4f70c6fb1fc6f0dcf805ad151af1dc79e16e25c5ad257d18ad2bcd3cfe2980",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x0000000000000000",
            "100000000000"
        ];


    let  aggPK19 =
        [
            "0x17da81082948ac895cb6c05cb0c7e0242e352ad7be0c211620dcee6057b33d41",
            "0x10094c6ceb607d2d259f36f9c70752c12c48c0563218ef41e88b11e4855ee4ae",
            "0x274244d66f64ac713a36fd16e900fcb52de513ebbcb4851e43d527a2ef95ceb5",
            "0x23ba6d4ff86d101855284f1a070d1c958216506f1c40ef04addc183aa8babcd3"
        ];

    let headerHash;

    let logs = [
        [
            "0x1f9D9D9B34D26e087EE00f61896f3E01dD929843",
            [
                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                "0x0000000000000000000000006621f2b6da2bed64b5ffbd6c5b2138547f44c8f9",
                "0x0000000000000000000000006d6247501b822fd4eaa76fcb64baea360279497f"
            ] ,
            "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000"
        ]

    ];

    let txReceipt = [
        "2",
        "0x01",
        "37535",
        "0x00000800000000000000000000000000000000000000000040000000000000000000000000000000200000000000000000000000000000000100000000000000000000000000000000000008400000000000000000000000000000000000000000000000000020000000800000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000002000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000",
        logs
    ];

    let g2 = ["0","0","0","0"];

    let header15960 =
        [
            "0x6917f05c21f28c687ce93801e0512f57cc6fc146c2e21e194af55ee6a144b052",
            "0x7A3a26123DBD9CFeFc1725fe7779580B987251Cb",
            "0x1163718b8acab33587c12df51ccaee55c646520d1071bf88e2edacad454405a0",
            "0xa90a8e3ca09f1d755aa791aa19d17d1b2b085993972a85e26d1c5010f71d2fb4",
            "0x0ecb0225266e6af30504fb96cb36f4889057dc5eb59b4ccb45f3e0f951d35876",
            "0x00000000000000000000000002000000080000000000000000000000000000000000000000000000000000800000002000010000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000200000400",
            "15960",
            "8000000",
            "24688",
            "1654668076",
            "0xd7820304846765746888676f312e31352e36856c696e75780000000000000000f8d3c0c0c080b84125443a64a55ba20e8c22777253b201e4928de07cf4e487ff59504890f5c59d044a7a27bb1916dfdf79996f5898516e455b24a127e341dd16c0b346b3ab7be28c00f8440eb840086ddc5250a0e90364d70c8a8507f2887a040b4beb1df3cda9c885933e1c92e525245d3f5e734be11871f4147b483fea6e4d24c083038c22446655628049da3680f8440fb84017466b7ab808d939cd32c5618ebdccb58d6b6c92677fa9d7a9856561871aba2e23b62b9251c50d6d781cb52ead9330dfdb3e56035dc9269ea364e04b8f6891d180",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x0000000000000000",
            "100000000000"
        ];

    let aggPk15960 =
        [
            "0x152bb6d9b41151a2f6774afe12450ae2760f571009246a1408f9e0e5012a18d7",
            "0x028120ae77c88dfa049c595d69f6186be11a2187cebbf04f2a1d2fde8691dfb4",
            "0x1419a80b2f032c886f02b0a0565e90746a8d5921ea5b755f887737b20f687246",
            "0x13a77b0eb9ddf3e6b6d2fa165a02695015a29f26b6298ceb2bdcd73f991e7c92"
        ];

    let logs15960 =
        [
            [
                "0xF0623c7C418eE84F33e5fAF5840ca3a6D1ec113D",
                [
                    "0x4fed921c0dd94ef52307d954f2459b84c049f5c348455dcdd9d1b5d653f9c94c",
                    "0x000000000000000000000000f855a761f9182c4b22a04753681a1f6324ed3449",
                    "0x000000000000000000000000f855a761f9182c4b22a04753681a1f6324ed3449",
                    "0x0000000000000000000000000000000000000000000000000000000000000064"
                ],
                "0x"
            ]
        ];

    let receipt15960 =
        [
            "2",
            "0x01",
            "24688",
            "0x00000000000000000000000002000000080000000000000000000000000000000000000000000000000000800000002000010000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000200000400",
            logs15960
        ];

    let provedata15960 =
        [
            header15960,
            aggPk15960,
            receipt15960,
            "0x00",
            [
                "0xf901b1822080b901ab02f901a701826070b9010000000000000000000000000002000000080000000000000000000000000000000000000000000000000000800000002000010000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000200000400f89ef89c94f0623c7c418ee84f33e5faf5840ca3a6d1ec113df884a04fed921c0dd94ef52307d954f2459b84c049f5c348455dcdd9d1b5d653f9c94ca0000000000000000000000000f855a761f9182c4b22a04753681a1f6324ed3449a0000000000000000000000000f855a761f9182c4b22a04753681a1f6324ed3449a0000000000000000000000000000000000000000000000000000000000000006480"
            ]

        ];

    let provedata =
        [
            header,
            g2,
            txReceipt,
            "0x0800",
            [
                "0xf851a0fc7c25e8a18de063cc65a2d3914f1482b11a96d8058bc3e7594e26482c0a49eb80808080808080a05b6a980042de579f163badeeac9510c3ef0bdb555dfc53d61eb8bbb33faec3a28080808080808080",
                "0xf901ae30b901aa02f901a60182929fb9010000000800000000000000000000000000000000000000000040000000000000000000000000000000200000000000000000000000000000000100000000000000000000000000000000000008400000000000000000000000000000000000000000000000000020000000800000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000002000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000f89df89b941f9d9d9b34d26e087ee00f61896f3e01dd929843f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa00000000000000000000000006621f2b6da2bed64b5ffbd6c5b2138547f44c8f9a00000000000000000000000006d6247501b822fd4eaa76fcb64baea360279497fa00000000000000000000000000000000000000000000000000de0b6b3a7640000"
            ]


        ];
    let receiptTest = [
        "2",
        "0x01",
        "24688",
        "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000400000000000000000800000000000000000000000000000000000001000000000000000000000000000000000000000000002000000000000000000000000200000000000000000020002000000000000000000000000000000000000000000000004000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000400",
        [
            [
                "0xca3D958f3c164353a27633d3a4b93Ccda969f2AF",
                [
                    "0x4fed921c0dd94ef52307d954f2459b84c049f5c348455dcdd9d1b5d653f9c94c",
                    "0x0000000000000000000000005907d676af9c39ed62d49de8099d8eb8af1f654b",
                    "0x0000000000000000000000005907d676af9c39ed62d49de8099d8eb8af1f654b",
                    "0x0000000000000000000000000000000000000000000000000000000000000078"
                ],
                "0x"
            ]
        ]
    ]




    let extraData = "0xd7820302846765746888676f312e31352e36856c696e75780000000000000000f8aec0c080b841f8cbb131f80ff58e82ba6ae89bbb5b3e5d5c87971ac5c6f04e9bd736d56a3aeb485574397571244a4b9da0ecd8f69111c67d9ab0ae63b6e817a3878c26472c2a01f30eb0bc888bf32d63fd40c5a3e247b426a6b7270029acc65e5b31cefcd56769215cd7f309b1c6fe850a978cedb7faf1ecd90080f30fb0f0e38417556f6d582f342807da189d474271507ddb967e10b473ee5d9709b6be32a5ded4420593744c658d3b3db77d0080"
    let extra;


    beforeEach(async function () {

        [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();


    });

    // it('verifyProof', async function () {
    //
    //     const VerifyProofInfo = await ethers.getContractFactory("VerifyProof");
    //     verifyProof = await VerifyProofInfo.deploy();
    //     verifyProofContract = await verifyProof.deployed()
    //
    //     console.log(verifyProofContract.address);
    //
    //
    // });

    it("deploy LightNode",async function () {
        const LightClient = await ethers.getContractFactory("LightNode");
        lightClient = await LightClient.deploy();
        lightNodeContract = await lightClient.deployed()
        lightNodeContractAddress = lightNodeContract.address;


    });

    it('initialize ', async function () {
        let g1Hex = [
            "0x13524ec450b9ac611fb332a25b6c2eb436d13ac8a540f69a50d6ff8d4fe9f2492b7d0f6e80e80e9b5f9c7a9fa2d482c2e8ea6c1657057c5548b7e30412d48bc3",
            "0x0e3450c5b583e57d8fe736d276e9e4bb2ce4b38a5e9ac77b1289ba14a5e9cf581ce786f52d5bd0e77c1eacfa3dd5df0e22464888fa4bfab6eff9f29e8f86084b",
            "0x2f6dd4eda4296d9cf85064adbe2507901fcd4ece425cc996827ba4a2c111c8121e6fe59e1d18c107d480077debf3ea265a52325725a853a710f7ec3af5e32869",
            "0x05fde1416ab5b30e4b140ad4a29a52cd9bc85ca27bd4662ba842a2e22118bea60dc32694f317d886daac5419b39412a33ee89e07d39d557e4e2b0e48696ac311"
        ]

        blsCode = await ethers.getContractFactory("BlsCode");
        bc = await blsCode.deploy();
        await bc.deployed();

        const g0 = await bc.decodeG1(g1Hex[0]);
        const g1 = await bc.decodeG1(g1Hex[1]);
        const g2 = await bc.decodeG1(g1Hex[2]);
        const g3 = await bc.decodeG1(g1Hex[3]);
        g1List = [
            g0,
            g1,
            g2,
            g3,
        ]

        let addresss = [
            "0xb4e1BC0856f70A55764FD6B3f8dD27F2162108E9",
            "0x7A3a26123DBD9CFeFc1725fe7779580B987251Cb",
            "0x7607c9cdd733d8cDA0A644839Ec2bAc5Fa180eD4",
            "0x65b3FEe569Bf82FF148bddEd9c3793FB685f9333"
        ]
        let _weights = [1, 1, 1, 1]

        let _threshold = 3;

        let _epoch = 17;

        let _epochSize = 1000;


        // console.log(_threshold,addresss,g1List,_weights,_epoch,_epochSize)

        await lightClient.initialize(_threshold, addresss, g1List, _weights, _epoch, _epochSize);

        // console.log(await  lightClient.getValidator("0"));
    });



    it('verifyProofData', async function () {
        // console.log(verifyProofContract.address);
        // console.log(await lightClient.verifyProof());
        //await lightClient.setVerifyer(verifyProofContract.address);

        //console.log(await lightClient.verifyProof());


        // let statusInfo = await lightClient.getStatus("true");
        // console.log(statusInfo);
        console.log(await lightClient.getVerifyExpectedValueHash(receiptTest));

       // console.log(await lightClient.verifyProofData(provedata15960));




    });

    it('_encodeHeader,_decodeHeader',async function () {

        headerHash = await lightClient._encodeHeader(header);
        //console.log("header:" + headerHash);

        //await  lightClient._decodeHeader(headerPlp);

    });

    it('_decodeExtraData', async function () {
        headerHash = await lightClient._encodeHeader(header18);
        let headerInfo = await lightClient._decodeHeader(headerHash);
        //console.log(headerInfo);
        extra = await lightClient._decodeExtraData(headerInfo.extraData);
        //console.log(extra);

        console.log(await lightClient.getPrepareCommittedSeal(header18, extra.aggregatedSeal.round));

        console.log(await lightClient.callStatic.checkSig(
            header18,
            extra,
            aggPK18
        ));

        //let extraDataPre = await lightClient.splitExtra(headerInfo.extraData);
        // console.log(extraDataPre);

        // let extraDeleteAgg = await lightClient._deleteAgg(extra,extraDataPre);
        // console.log("agg-----" + extraDeleteAgg);

        //let extraDeleteAggTest = await lightClient._deleteAggTest(extra,extraDataPre);
        //console.log("agg-----" + extraDeleteAggTest);

        //let extraDeleteAgg1 = await lightClient._deleteAgg(extra,headerInfo.extraData);
        //console.log("agg1-----" + extraDeleteAgg1);

        // let extraDleleteAanAggData1 = await lightClient._deleteSealAndAgg(extra,extraDataPre);
        // console.log( "data1-----"+extraDleleteAanAggData1);


        // let extraDleleteAanAggData2 = await lightClient._deleteSealAndAgg(extra,extraDeleteAgg);
        // console.log("data2-----" + extraDleleteAanAggData2)

        //let istbs =  await lightClient._encodeAggregatedSeal("0","0x","0");
        //istbs = "0xf891c0c0c080b8412a6649625d0a5d11b7a075763015324b2b343924cf96a30eb173e3f097f8b9c24fc12a88c84d1a9cd7aa38b9384cd0e38b567405f31189b546f4d0098f0a2d1000c3808080f8440fb8401d2a8c9d328d7b1a4cb17c61e3650618bd79f1f00c073ad2998424277adf197c2c655040821e89a99934813b84b7823ef7a06045cbe58502af31a2744a35567e80";
        //let extraDleleteAanAggData2Test = await  lightClient._deleteSealAndAggTest(extra,extraDeleteAggTest);
        // console.log( extraDleleteAanAggData2Test)


        //console.log( await lightClient._decodeExtraData(extraData));
        //console.log(await lightClient.splitSignature("0x5113031cf7d57d9d111ac902b582bc855c029cab4d524de47cac0ae9127d0dd01ce8ef84d20b3465cea5d99c3889103ab7ec2c7b11447762a1920d6f1838147b01"))
        //console.log(await lightClient._deleteAgg(extra,extraData));
        //console.log(await lightClient._deleteSealAndAgg(extra,extraData))


        //header[10] = extraDeleteAgg;


        //console.log( header);
        // headerInfo.extraData = extraDleleteAanAggData1
        // console.log(headerInfo)
        //let header1 =
        // [
        //     '0x4d38359349eb407e28bd4e985010506ba934996102b5551492836016fc749b49',
        //     '0x6C5938B49bACDe73a8Db7C3A7DA208846898BFf5',
        //     '0xbe0461a71dfa948ab0a94fb034cfb6fce599dca83044d4f104466b743061a9ef',
        //     '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
        //     '0x6d013934131ee6c51393a8648672ec3225fb412478b83a1dd53f73ef545b4439',
        //     '0x10040000000000000000000000000000000000000000000000000000001020010000000080800000000000000000000000000000000008000000000004000000000000000004000000000008200000000020000000000000000000000000000000000000020000000000000000000800000000100a0000000000001000000800000000002000000000080000000000000000000000000000000020000000000004000000000000008000200000008040000000000080000000080000000000000000000a000002000000000000000000000080000000000000200000080020000400004000000000008100000000000000000000000000004000000000000000',
        //     '1000',
        //     '8000000',
        //     '0',
        //     '1653286079',
        //     extraDleleteAanAggData2Test,
        //     '0x0000000000000000000000000000000000000000000000000000000000000000',
        //     '0x0000000000000000',
        //     '100000000000'
        // ]
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
        //console.log(hashHeader);



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
        // console.log(await lightClient._verifySign(extra.seal,dataHash5.hash3,"0x6C5938B49bACDe73a8Db7C3A7DA208846898BFf5"));
        // console.log(await lightClient._verifySign(extra.seal,dataHash5.hash1,"0x6C5938B49bACDe73a8Db7C3A7DA208846898BFf5"));



    });

    it('_verifyHeader ', async function () {
        // console.log(headerHash)
        console.log(await lightClient._verifyHeader(headerHash));

    });

    it('updateBlockHeader', async function () {

        //console.log(await lightClient.weightedMultisig());

        await lightClient.updateBlockHeader(header18,aggPK18);

        await lightClient.updateBlockHeader(header19,aggPK19);

        // console.log(await  lightClient.getValidator("1"));

        //console.log(await lightClient.getBits("13"))


    });



});
