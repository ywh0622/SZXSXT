import Mock from 'mockjs'

let projectList = [
    // {
    //     "showName":"Magic Draw",
    //     "icon":'collectionTag',
    //     "models":[
    //         {
    //             showName: '秒表模型',
    //             icon:'cpu',
    //             childProjects:[
    //                 {
    //                     showName: '秒表',
    //                     icon:'folder',
    //                     childProjects: [
    //                         {
    //                             showName: '功能',
    //                             icon:'folder',
    //                             childProjects: [
    //                                 {
    //                                     showName: '复位',
    //                                     icon:'refreshLeft',
    //                                     childProjects: [
    //                                         {
    //                                             showName: 'Relations',
    //                                             icon:'topRight',
    //                                             childProjects: [
    //                                                 {
    //                                                     showName: 'Control Flow',
    //                                                     icon:'topRight'
    //                                                 },
    //                                                 {
    //                                                     showName: 'Control Flow',
    //                                                     icon:'bottomRight'
    //                                                 }
    //                                               ],
    //                                         },
    //                                         {
    //                                             showName: '复位',
    //                                             icon:'refreshLeft'
    //                                         },
    //                                         {
    //                                             showName: '<>',
    //                                             icon:'removeFilled'
    //                                         },
    //                                         {
    //                                             showName: '<>',
    //                                             icon:'removeFilled'
    //                                         },
    //                                         {
    //                                             showName: 'time=0',
    //                                             icon:'connection'
    //                                         }
    //                                       ],
    //                                 },
    //                                 {
    //                                     showName: '计数',
    //                                     icon:'editPen',
    //                                     childProjects: [
    //                                         {
    //                                             showName: 'Relations',
    //                                             icon:'topRight',
    //                                             childProjects: [
    //                                                 {
    //                                                     showName: 'Control Flow',
    //                                                     icon:'bottomRight'
    //                                                 },
    //                                                 {
    //                                                     showName: 'Control Flow',
    //                                                     icon:'bottomRight'
    //                                                 },
    //                                                 {
    //                                                     showName: 'Control Flow',
    //                                                     icon:'bottomRight'
    //                                                 }
    //                                               ],
    //                                         },
    //                                         {
    //                                             showName: '计数',
    //                                             icon:'editPen'
    //                                         },
    //                                         {
    //                                             showName: '<>',
    //                                             icon:'removeFilled',
    //                                             childProjects: [
    //                                                 {
    //                                                     showName: 'Trigger.after(1s)',
    //                                                     icon:'bottomLeft'
    //                                                 }
    //                                               ],
    //                                         },
    //                                         {
    //                                             showName: '<>',
    //                                             icon:'removeFilled'
    //                                         },
    //                                         {
    //                                             showName: '<>',
    //                                             icon:'removeFilled'
    //                                         },
    //                                         {
    //                                             showName: 'time=time+1',
    //                                             icon:'connection'
    //                                         },
    //                                         {
    //                                             showName: 'TimeEvent After(1s)',
    //                                             icon:'connection'
    //                                         }
    //                                       ],
    //                                 }
    //                               ],
    //                         },
    //                         {
    //                             showName: '结构',
    //                             icon:'folder',
    //                             childProjects: [
    //                                 {
    //                                     showName: '结构',
    //                                     icon:'tickets'
    //                                 },
    //                                 {
    //                                     showName: '秒表',
    //                                     icon:'watch',
    //                                     childProjects: [
    //                                         {
    //                                             showName: '秒表',
    //                                             icon:'watch',
    //                                             childProjects: [
    //                                                 {
    //                                                     showName: '秒表',
    //                                                     icon:'watch'
    //                                                 },
    //                                                 {
    //                                                     showName: '<>',
    //                                                     icon:'removeFilled',
    //                                                     childProjects: [
    //                                                         {
    //                                                             showName: 'Relations',
    //                                                             icon:'topRight',
    //                                                             childProjects: [
    //                                                                 {
    //                                                                     showName: 'Transition',
    //                                                                     icon:'topRight'
    //                                                                 },
    //                                                                 {
    //                                                                     showName: 'Transition',
    //                                                                     icon:'topRight'
    //                                                                 },
    //                                                                 {
    //                                                                     showName: 'Transition pause',
    //                                                                     icon:'topRight',
    //                                                                     childProjects: [
    //                                                                         {
    //                                                                             showName: 'Trigger pause',
    //                                                                             icon:'bottomLeft'
    //                                                                         }
    //                                                                     ]
    //                                                                 },
    //                                                                 {
    //                                                                     showName: 'Transition reset',
    //                                                                     icon:'topRight',
    //                                                                     childProjects: [
    //                                                                         {
    //                                                                             showName: 'Trigger reset',
    //                                                                             icon:'bottomLeft'
    //                                                                         }
    //                                                                     ]
    //                                                                 },
    //                                                                 {
    //                                                                     showName: 'Transition resume',
    //                                                                     icon:'topRight',
    //                                                                     childProjects: [
    //                                                                         {
    //                                                                             showName: 'Trigger resume',
    //                                                                             icon:'bottomLeft'
    //                                                                         }
    //                                                                     ]
    //                                                                 },
    //                                                                 {
    //                                                                     showName: 'Transition start',
    //                                                                     icon:'topRight',
    //                                                                     childProjects: [
    //                                                                         {
    //                                                                             showName: 'Trigger start',
    //                                                                             icon:'bottomLeft'
    //                                                                         }
    //                                                                     ]
    //                                                                 }
    //                                                             ]
    //                                                         },
    //                                                         {
    //                                                             showName: '< >',
    //                                                             icon:'removeFilled'
    //                                                         },
    //                                                         {
    //                                                             showName: '计数',
    //                                                             icon:'editPen',
    //                                                             childProjects: [
    //                                                                 {
    //                                                                     showName: '计数',
    //                                                                     icon:'editPen'
    //                                                                 }
    //                                                             ]
    //                                                         },
    //                                                         {
    //                                                             showName: '停止',
    //                                                             icon:'closeBold'
    //                                                         },
    //                                                         {
    //                                                             showName: '准备',
    //                                                             icon:'select',
    //                                                             childProjects: [
    //                                                                 {
    //                                                                     showName: '复位',
    //                                                                     icon:'refreshLeft',
    //                                                                     childProjects: [
    //                                                                         {
    //                                                                             showName: 'Relations',
    //                                                                             icon:'topRight',
    //                                                                             childProjects: [
    //                                                                                 {
    //                                                                                     showName: 'Control Flow',
    //                                                                                     icon:'bottomRight'
    //                                                                                 },
    //                                                                                 {
    //                                                                                     showName: 'Control Flow',
    //                                                                                     icon:'bottomRight'
    //                                                                                 }
    //                                                                             ]
    //                                                                         },
    //                                                                         {
    //                                                                             showName: '复位',
    //                                                                             icon:'refreshLeft'
    //                                                                         },
    //                                                                         {
    //                                                                             showName: '< >',
    //                                                                             icon:'removeFilled'
    //                                                                         },
    //                                                                         {
    //                                                                             showName: '.复位',
    //                                                                             icon:'refreshLeft'
    //                                                                         },
    //                                                                         {
    //                                                                             showName: '<  >',
    //                                                                             icon:'removeFilled'
    //                                                                         },
    //                                                                     ]
    //                                                                 }
    //                                                             ]
    //                                                         }
    //                                                     ]
    //                                                 },
    //                                                 {
    //                                                     showName: 'SignalEvent pause',
    //                                                     icon:'connection'
    //                                                 },
    //                                                 {
    //                                                     showName: 'SignalEvent reset',
    //                                                     icon:'connection'
    //                                                 },
    //                                                 {
    //                                                     showName: 'SignalEvent resume',
    //                                                     icon:'connection'
    //                                                 },
    //                                                 {
    //                                                     showName: 'SignalEvent start',
    //                                                     icon:'connection'
    //                                                 }
    //                                             ],
    //                                         },
    //                                         {
    //                                             showName: 'time:real',
    //                                             icon:'connection'
    //                                         }
    //                                       ],
    //                                 }
    //                               ],
    //                         }
    //                       ],
    //                 }
    //             ]
    //         },
    //         {
    //             "showName": 'XX模型',
    //             "icon":'cpu',
    //             "childProjects":[
    //                 {
    //                     "showName": 'XX System',
    //                     "icon":'folder',
    //                     "childProjects": [
    //                         {
    //                             "showName": 'File1',
    //                             "icon":'collectionTag'
    //                         },
    //                         {
    //                             "showName": 'File2',
    //                             "icon":'collectionTag'
    //                         }
    //                       ],
    //                 }
    //             ]
    //         },
    //     ]
    // }

    {
        "date": "2023-01-02 20-40-49",
        "models": [{
            "showName": "秒表",
            "icon": "document",
            "name": "秒表",
            "childProjects": [{
                "showName": "Package <功能>",
                "icon": "document",
                "name": "功能",
                "childProjects": [{
                    "showName": "Activity <计数>",
                    "icon": "folder",
                    "name": "计数",
                    "childProjects": [{
                        "showName": "Control Flow < >",
                        "icon": "postcard",
                        "name": "",
                        "childProjects": [{
                            "showName": "Literal Unlimited Natural < >",
                            "icon": "documentAdd",
                            "name": "",
                            "id": "_2021x_1_30e0104_1666103211094_200994_3338",
                            "tagName": "LiteralUnlimitedNatural",
                            "type": "Literal Unlimited Natural",
                            "value": "1"
                        }],
                        "id": "_2021x_1_30e0104_1666103211093_258076_3337",
                        "source": "_2021x_1_30e0104_1666103079825_856363_3308",
                        "tagName": "ControlFlow",
                        "type": "Control Flow",
                        "target": "_2021x_1_30e0104_1666103093981_658026_3314"
                    }, {
                        "showName": "Control Flow <test>",
                        "icon": "postcard",
                        "name": "test",
                        "childProjects": [{
                            "showName": "Literal Unlimited Natural < >",
                            "icon": "documentAdd",
                            "name": "",
                            "id": "_2021x_1_30e0104_1666103317399_647833_3357",
                            "tagName": "LiteralUnlimitedNatural",
                            "type": "Literal Unlimited Natural",
                            "value": "1"
                        }],
                        "id": "_2021x_1_30e0104_1666103317398_913139_3356",
                        "source": "_2021x_1_30e0104_1666103093981_658026_3314",
                        "tagName": "ControlFlow",
                        "type": "Control Flow",
                        "target": "_2021x_1_30e0104_1666103237482_979277_3340"
                    }, {
                        "showName": "Control Flow < >",
                        "icon": "postcard",
                        "name": "",
                        "childProjects": [{
                            "showName": "Literal Unlimited Natural < >",
                            "icon": "documentAdd",
                            "name": "",
                            "id": "_2021x_1_30e0104_1666103356591_128754_3364",
                            "tagName": "LiteralUnlimitedNatural",
                            "type": "Literal Unlimited Natural",
                            "value": "4"
                        }],
                        "id": "_2021x_1_30e0104_1666103356591_861743_3363",
                        "source": "_2021x_1_30e0104_1666103237482_979277_3340",
                        "tagName": "ControlFlow",
                        "type": "Control Flow",
                        "target": "_2021x_1_30e0104_1666103356587_913645_3361"
                    }, {
                        "showName": "Time Event < >",
                        "icon": "notebook",
                        "name": "",
                        "childProjects": [{
                            "showName": "Time Expression < >",
                            "icon": "camera",
                            "name": "",
                            "childProjects": [{
                                "showName": "Literal String < >",
                                "icon": "picture",
                                "name": "",
                                "id": "_2021x_1_30e0104_1666103151654_876022_3330",
                                "tagName": "LiteralString",
                                "type": "Literal String"
                            }],
                            "id": "_2021x_1_30e0104_1666103093987_387151_3317",
                            "tagName": "TimeExpression",
                            "type": "Time Expression"
                        }],
                        "id": "_2021x_1_30e0104_1666103093986_360563_3316",
                        "tagName": "TimeEvent",
                        "type": "Time Event"
                    }, {
                        "showName": "Diagram <计数>",
                        "icon": "tickets",
                        "name": "计数",
                        "childProjects": [{
                            "showName": "String Tagged Value < >",
                            "icon": "dataAnalysis",
                            "id": "_2021x_1_30e0104_1666103053888_151120_3279_application_be00301_1073306188629_537791_2",
                            "tagName": "StringTaggedValue",
                            "type": "String Tagged Value"
                        }, {
                            "showName": "String Tagged Value < >",
                            "icon": "dataAnalysis",
                            "id": "_2021x_1_30e0104_1666103053888_151120_3279_application_be00301_1073394345322_922552_1",
                            "tagName": "StringTaggedValue",
                            "type": "String Tagged Value"
                        }, {
                            "showName": "String Tagged Value < >",
                            "icon": "dataAnalysis",
                            "id": "_2021x_1_30e0104_1666103053888_151120_3279_application_be00301_1077726770128_871366_1",
                            "tagName": "StringTaggedValue",
                            "type": "String Tagged Value"
                        }, {
                            "showName": "String Tagged Value < >",
                            "icon": "dataAnalysis",
                            "id": "_2021x_1_30e0104_1666103053888_151120_3279_application_16_8beta_8ca0285_1257244649124_794756_344",
                            "tagName": "StringTaggedValue",
                            "type": "String Tagged Value"
                        }],
                        "id": "_2021x_1_30e0104_1666103053888_151120_3279",
                        "tagName": "Diagram",
                        "type": "Diagram"
                    }, {
                        "showName": "Initial Node < >",
                        "icon": "memo",
                        "name": "",
                        "id": "_2021x_1_30e0104_1666103079825_856363_3308",
                        "tagName": "InitialNode",
                        "type": "Initial Node"
                    }, {
                        "showName": "Accept Event Action < >",
                        "icon": "collection",
                        "name": "",
                        "childProjects": [{
                            "showName": "Trigger < >",
                            "icon": "folderOpened",
                            "name": "",
                            "id": "_2021x_1_30e0104_1666103093983_767072_3315",
                            "tagName": "Trigger",
                            "type": "Trigger",
                            "event": "TimeEvent",
                            "when": "2s"
                        }],
                        "id": "_2021x_1_30e0104_1666103093981_658026_3314",
                        "tagName": "AcceptEventAction",
                        "type": "Accept Event Action"
                    }, {
                        "showName": "Opaque Action < >",
                        "icon": "scaleToOriginal",
                        "name": "",
                        "id": "_2021x_1_30e0104_1666103237482_979277_3340",
                        "tagName": "OpaqueAction",
                        "type": "Opaque Action",
                        "body": "time=time+1"
                    }, {
                        "showName": "Activity Final Node < >",
                        "icon": "setUp",
                        "name": "",
                        "id": "_2021x_1_30e0104_1666103356587_913645_3361",
                        "tagName": "ActivityFinalNode",
                        "type": "Activity Final Node"
                    }],
                    "id": "_2021x_1_30e0104_1666103008878_198502_3278",
                    "tagName": "Activity",
                    "type": "Activity"
                }, {
                    "showName": "Activity <复位>",
                    "icon": "folder",
                    "name": "复位",
                    "childProjects": [{
                        "showName": "Control Flow < >",
                        "icon": "postcard",
                        "name": "",
                        "childProjects": [{
                            "showName": "Literal Unlimited Natural < >",
                            "icon": "documentAdd",
                            "name": "",
                            "id": "_2021x_1_30e0104_1666103505943_937630_3421",
                            "tagName": "LiteralUnlimitedNatural",
                            "type": "Literal Unlimited Natural",
                            "value": "1"
                        }],
                        "id": "_2021x_1_30e0104_1666103505943_522255_3420",
                        "source": "_2021x_1_30e0104_1666103454233_378326_3403",
                        "tagName": "ControlFlow",
                        "type": "Control Flow",
                        "target": "_2021x_1_30e0104_1666103505939_547951_3418"
                    }, {
                        "showName": "Control Flow < >",
                        "icon": "postcard",
                        "name": "",
                        "childProjects": [{
                            "showName": "Literal Unlimited Natural < >",
                            "icon": "documentAdd",
                            "name": "",
                            "id": "_2021x_1_30e0104_1666103511277_111504_3428",
                            "tagName": "LiteralUnlimitedNatural",
                            "type": "Literal Unlimited Natural",
                            "value": "1"
                        }],
                        "id": "_2021x_1_30e0104_1666103511276_886314_3427",
                        "source": "_2021x_1_30e0104_1666103433390_211182_3397",
                        "tagName": "ControlFlow",
                        "type": "Control Flow",
                        "target": "_2021x_1_30e0104_1666103454233_378326_3403"
                    }, {
                        "showName": "Diagram <复位>",
                        "icon": "tickets",
                        "name": "复位",
                        "childProjects": [{
                            "showName": "String Tagged Value < >",
                            "icon": "dataAnalysis",
                            "id": "_2021x_1_30e0104_1666103410469_543945_3368_application_be00301_1073306188629_537791_2",
                            "tagName": "StringTaggedValue",
                            "type": "String Tagged Value"
                        }, {
                            "showName": "String Tagged Value < >",
                            "icon": "dataAnalysis",
                            "id": "_2021x_1_30e0104_1666103410469_543945_3368_application_be00301_1073394345322_922552_1",
                            "tagName": "StringTaggedValue",
                            "type": "String Tagged Value"
                        }, {
                            "showName": "String Tagged Value < >",
                            "icon": "dataAnalysis",
                            "id": "_2021x_1_30e0104_1666103410469_543945_3368_application_be00301_1077726770128_871366_1",
                            "tagName": "StringTaggedValue",
                            "type": "String Tagged Value"
                        }, {
                            "showName": "String Tagged Value < >",
                            "icon": "dataAnalysis",
                            "id": "_2021x_1_30e0104_1666103410469_543945_3368_application_16_8beta_8ca0285_1257244649124_794756_344",
                            "tagName": "StringTaggedValue",
                            "type": "String Tagged Value"
                        }],
                        "id": "_2021x_1_30e0104_1666103410469_543945_3368",
                        "tagName": "Diagram",
                        "type": "Diagram"
                    }, {
                        "showName": "Initial Node < >",
                        "icon": "memo",
                        "name": "",
                        "id": "_2021x_1_30e0104_1666103433390_211182_3397",
                        "tagName": "InitialNode",
                        "type": "Initial Node"
                    }, {
                        "showName": "Opaque Action < >",
                        "icon": "scaleToOriginal",
                        "name": "",
                        "id": "_2021x_1_30e0104_1666103454233_378326_3403",
                        "tagName": "OpaqueAction",
                        "type": "Opaque Action",
                        "body": "time=0"
                    }, {
                        "showName": "Activity Final Node < >",
                        "icon": "setUp",
                        "name": "",
                        "id": "_2021x_1_30e0104_1666103505939_547951_3418",
                        "tagName": "ActivityFinalNode",
                        "type": "Activity Final Node"
                    }],
                    "id": "_2021x_1_30e0104_1666103410470_495042_3369",
                    "tagName": "Activity",
                    "type": "Activity"
                }],
                "id": "_2021x_1_30e0104_1666102729916_451041_3216",
                "tagName": "Package",
                "type": "Package"
            }, {
                "showName": "Package <结构>",
                "icon": "document",
                "name": "结构",
                "childProjects": [{
                    "showName": "Block <秒表>",
                    "icon": "documentDelete",
                    "name": "秒表",
                    "childProjects": [{
                        "showName": "Value Property <time>",
                        "icon": "documentChecked",
                        "name": "time",
                        "id": "_2021x_1_30e0104_1666102815549_392322_3275",
                        "tagName": "Property",
                        "type": "Value Property"
                    }, {
                        "showName": "State Machine <秒表>",
                        "icon": "iphone",
                        "name": "秒表",
                        "childProjects": [{
                            "showName": "Signal Event < >",
                            "icon": "dataBoard",
                            "name": "",
                            "id": "_2021x_1_30e0104_1666103943377_269389_3526",
                            "tagName": "SignalEvent",
                            "type": "Signal Event"
                        }, {
                            "showName": "Signal Event < >",
                            "icon": "dataBoard",
                            "name": "",
                            "id": "_2021x_1_30e0104_1666104013541_852386_3531",
                            "tagName": "SignalEvent",
                            "type": "Signal Event"
                        }, {
                            "showName": "Signal Event < >",
                            "icon": "dataBoard",
                            "name": "",
                            "id": "_2021x_1_30e0104_1666104054529_865609_3536",
                            "tagName": "SignalEvent",
                            "type": "Signal Event"
                        }, {
                            "showName": "Signal Event < >",
                            "icon": "dataBoard",
                            "name": "",
                            "id": "_2021x_1_30e0104_1666104093821_683199_3541",
                            "tagName": "SignalEvent",
                            "type": "Signal Event"
                        }, {
                            "showName": "Diagram <秒表>",
                            "icon": "tickets",
                            "name": "秒表",
                            "childProjects": [{
                                "showName": "String Tagged Value < >",
                                "icon": "dataAnalysis",
                                "id": "_2021x_1_30e0104_1666103588504_53113_3430_application_be00301_1073306188629_537791_2",
                                "tagName": "StringTaggedValue",
                                "type": "String Tagged Value"
                            }, {
                                "showName": "String Tagged Value < >",
                                "icon": "dataAnalysis",
                                "id": "_2021x_1_30e0104_1666103588504_53113_3430_application_be00301_1073394345322_922552_1",
                                "tagName": "StringTaggedValue",
                                "type": "String Tagged Value"
                            }, {
                                "showName": "String Tagged Value < >",
                                "icon": "dataAnalysis",
                                "id": "_2021x_1_30e0104_1666103588504_53113_3430_application_be00301_1077726770128_871366_1",
                                "tagName": "StringTaggedValue",
                                "type": "String Tagged Value"
                            }, {
                                "showName": "String Tagged Value < >",
                                "icon": "dataAnalysis",
                                "id": "_2021x_1_30e0104_1666103588504_53113_3430_application_16_8beta_8ca0285_1257244649124_794756_344",
                                "tagName": "StringTaggedValue",
                                "type": "String Tagged Value"
                            }],
                            "id": "_2021x_1_30e0104_1666103588504_53113_3430",
                            "tagName": "Diagram",
                            "type": "Diagram"
                        }, {
                            "showName": "Region < >",
                            "icon": "copyDocument",
                            "name": "",
                            "childProjects": [{
                                "showName": "Transition < >",
                                "icon": "documentCopy",
                                "name": "",
                                "id": "_2021x_1_30e0104_1666103588624_634318_3461",
                                "tagName": "Transition",
                                "type": "Transition"
                            }, {
                                "showName": "Transition < >",
                                "icon": "documentCopy",
                                "name": "",
                                "childProjects": [{
                                    "showName": "Trigger < >",
                                    "icon": "folderOpened",
                                    "name": "",
                                    "id": "_2021x_1_30e0104_1666103943374_630038_3525",
                                    "tagName": "Trigger",
                                    "type": "Trigger",
                                    "event": "SignalEvent"
                                }],
                                "id": "_2021x_1_30e0104_1666103686043_657191_3513",
                                "tagName": "Transition",
                                "type": "Transition"
                            }, {
                                "showName": "Transition < >",
                                "icon": "documentCopy",
                                "name": "",
                                "childProjects": [{
                                    "showName": "Trigger < >",
                                    "icon": "folderOpened",
                                    "name": "",
                                    "id": "_2021x_1_30e0104_1666104013541_518092_3530",
                                    "tagName": "Trigger",
                                    "type": "Trigger",
                                    "event": "SignalEvent"
                                }],
                                "id": "_2021x_1_30e0104_1666103691285_385330_3516",
                                "tagName": "Transition",
                                "type": "Transition"
                            }, {
                                "showName": "Transition < >",
                                "icon": "documentCopy",
                                "name": "",
                                "childProjects": [{
                                    "showName": "Trigger < >",
                                    "icon": "folderOpened",
                                    "name": "",
                                    "id": "_2021x_1_30e0104_1666104054529_894538_3535",
                                    "tagName": "Trigger",
                                    "type": "Trigger",
                                    "event": "SignalEvent"
                                }],
                                "id": "_2021x_1_30e0104_1666103693612_192014_3519",
                                "tagName": "Transition",
                                "type": "Transition"
                            }, {
                                "showName": "Transition < >",
                                "icon": "documentCopy",
                                "name": "",
                                "childProjects": [{
                                    "showName": "Trigger < >",
                                    "icon": "folderOpened",
                                    "name": "",
                                    "id": "_2021x_1_30e0104_1666104093821_591281_3540",
                                    "tagName": "Trigger",
                                    "type": "Trigger",
                                    "event": "SignalEvent"
                                }],
                                "id": "_2021x_1_30e0104_1666103696850_717168_3522",
                                "tagName": "Transition",
                                "type": "Transition"
                            }, {
                                "showName": "Transition < >",
                                "icon": "documentCopy",
                                "name": "",
                                "id": "_2021x_1_30e0104_1666104788904_176053_4011",
                                "tagName": "Transition",
                                "type": "Transition"
                            }, {
                                "showName": "Pseudo State < >",
                                "icon": "firstAidKit",
                                "name": "",
                                "id": "_2021x_1_30e0104_1666103588619_166_3459",
                                "tagName": "Pseudostate",
                                "type": "Pseudo State"
                            }, {
                                "showName": "State <准备>",
                                "icon": "ticket",
                                "name": "准备",
                                "childProjects": [{
                                    "showName": "Activity <复位>",
                                    "icon": "folder",
                                    "name": "复位",
                                    "childProjects": [{
                                        "showName": "Control Flow < >",
                                        "icon": "postcard",
                                        "name": "",
                                        "childProjects": [{
                                            "showName": "Literal Unlimited Natural < >",
                                            "icon": "documentAdd",
                                            "name": "",
                                            "id": "_2021x_1_30e0104_1666104342169_135207_3791",
                                            "tagName": "LiteralUnlimitedNatural",
                                            "type": "Literal Unlimited Natural",
                                            "value": "1"
                                        }],
                                        "id": "_2021x_1_30e0104_1666104342168_953351_3790",
                                        "source": "_2021x_1_30e0104_1666104342168_568701_3787",
                                        "tagName": "ControlFlow",
                                        "type": "Control Flow",
                                        "target": "_2021x_1_30e0104_1666104342168_425504_3789"
                                    }, {
                                        "showName": "Control Flow < >",
                                        "icon": "postcard",
                                        "name": "",
                                        "childProjects": [{
                                            "showName": "Literal Unlimited Natural < >",
                                            "icon": "documentAdd",
                                            "name": "",
                                            "id": "_2021x_1_30e0104_1666104342170_442042_3793",
                                            "tagName": "LiteralUnlimitedNatural",
                                            "type": "Literal Unlimited Natural",
                                            "value": "1"
                                        }],
                                        "id": "_2021x_1_30e0104_1666104342170_248157_3792",
                                        "source": "_2021x_1_30e0104_1666104342168_425504_3789",
                                        "tagName": "ControlFlow",
                                        "type": "Control Flow",
                                        "target": "_2021x_1_30e0104_1666104342168_909744_3788"
                                    }, {
                                        "showName": "Diagram <复位>",
                                        "icon": "tickets",
                                        "name": "复位",
                                        "childProjects": [{
                                            "showName": "String Tagged Value < >",
                                            "icon": "dataAnalysis",
                                            "id": "_2021x_1_30e0104_1666104342171_953723_3795_application_be00301_1073306188629_537791_2",
                                            "tagName": "StringTaggedValue",
                                            "type": "String Tagged Value"
                                        }, {
                                            "showName": "String Tagged Value < >",
                                            "icon": "dataAnalysis",
                                            "id": "_2021x_1_30e0104_1666104342171_953723_3795_application_be00301_1073394345322_922552_1",
                                            "tagName": "StringTaggedValue",
                                            "type": "String Tagged Value"
                                        }, {
                                            "showName": "String Tagged Value < >",
                                            "icon": "dataAnalysis",
                                            "id": "_2021x_1_30e0104_1666104342171_953723_3795_application_be00301_1077726770128_871366_1",
                                            "tagName": "StringTaggedValue",
                                            "type": "String Tagged Value"
                                        }, {
                                            "showName": "String Tagged Value < >",
                                            "icon": "dataAnalysis",
                                            "id": "_2021x_1_30e0104_1666104342171_953723_3795_application_16_8beta_8ca0285_1257244649124_794756_344",
                                            "tagName": "StringTaggedValue",
                                            "type": "String Tagged Value"
                                        }],
                                        "id": "_2021x_1_30e0104_1666104342171_953723_3795",
                                        "tagName": "Diagram",
                                        "type": "Diagram"
                                    }, {
                                        "showName": "Initial Node < >",
                                        "icon": "memo",
                                        "name": "",
                                        "id": "_2021x_1_30e0104_1666104342168_568701_3787",
                                        "tagName": "InitialNode",
                                        "type": "Initial Node"
                                    }, {
                                        "showName": "Activity Final Node < >",
                                        "icon": "setUp",
                                        "name": "",
                                        "id": "_2021x_1_30e0104_1666104342168_909744_3788",
                                        "tagName": "ActivityFinalNode",
                                        "type": "Activity Final Node"
                                    }, {
                                        "showName": "Call Behavior Action < >",
                                        "icon": "management",
                                        "name": "",
                                        "id": "_2021x_1_30e0104_1666104342168_425504_3789",
                                        "tagName": "CallBehaviorAction",
                                        "type": "Call Behavior Action"
                                    }],
                                    "id": "_2021x_1_30e0104_1666104342170_313902_3794",
                                    "tagName": "Activity",
                                    "type": "Activity"
                                }],
                                "id": "_2021x_1_30e0104_1666103588622_643422_3460",
                                "tagName": "State",
                                "type": "State"
                            }, {
                                "showName": "State <计数>",
                                "icon": "ticket",
                                "name": "计数",
                                "childProjects": [{
                                    "showName": "Activity <计数>",
                                    "icon": "folder",
                                    "name": "计数",
                                    "childProjects": [{
                                        "showName": "Control Flow < >",
                                        "icon": "postcard",
                                        "name": "",
                                        "childProjects": [{
                                            "showName": "Literal Unlimited Natural < >",
                                            "icon": "documentAdd",
                                            "name": "",
                                            "id": "_2021x_1_30e0104_1666104142165_397030_3548",
                                            "tagName": "LiteralUnlimitedNatural",
                                            "type": "Literal Unlimited Natural",
                                            "value": "1"
                                        }],
                                        "id": "_2021x_1_30e0104_1666104142164_782949_3547",
                                        "source": "_2021x_1_30e0104_1666104142159_274763_3544",
                                        "tagName": "ControlFlow",
                                        "type": "Control Flow",
                                        "target": "_2021x_1_30e0104_1666104142164_867589_3546"
                                    }, {
                                        "showName": "Control Flow < >",
                                        "icon": "postcard",
                                        "name": "",
                                        "childProjects": [{
                                            "showName": "Literal Unlimited Natural < >",
                                            "icon": "documentAdd",
                                            "name": "",
                                            "id": "_2021x_1_30e0104_1666104142166_910368_3550",
                                            "tagName": "LiteralUnlimitedNatural",
                                            "type": "Literal Unlimited Natural",
                                            "value": "1"
                                        }],
                                        "id": "_2021x_1_30e0104_1666104142166_731017_3549",
                                        "source": "_2021x_1_30e0104_1666104142164_867589_3546",
                                        "tagName": "ControlFlow",
                                        "type": "Control Flow",
                                        "target": "_2021x_1_30e0104_1666104142159_910492_3545"
                                    }, {
                                        "showName": "Diagram <计数>",
                                        "icon": "tickets",
                                        "name": "计数",
                                        "childProjects": [{
                                            "showName": "String Tagged Value < >",
                                            "icon": "dataAnalysis",
                                            "id": "_2021x_1_30e0104_1666104142168_946710_3552_application_be00301_1073306188629_537791_2",
                                            "tagName": "StringTaggedValue",
                                            "type": "String Tagged Value"
                                        }, {
                                            "showName": "String Tagged Value < >",
                                            "icon": "dataAnalysis",
                                            "id": "_2021x_1_30e0104_1666104142168_946710_3552_application_be00301_1073394345322_922552_1",
                                            "tagName": "StringTaggedValue",
                                            "type": "String Tagged Value"
                                        }, {
                                            "showName": "String Tagged Value < >",
                                            "icon": "dataAnalysis",
                                            "id": "_2021x_1_30e0104_1666104142168_946710_3552_application_be00301_1077726770128_871366_1",
                                            "tagName": "StringTaggedValue",
                                            "type": "String Tagged Value"
                                        }, {
                                            "showName": "String Tagged Value < >",
                                            "icon": "dataAnalysis",
                                            "id": "_2021x_1_30e0104_1666104142168_946710_3552_application_16_8beta_8ca0285_1257244649124_794756_344",
                                            "tagName": "StringTaggedValue",
                                            "type": "String Tagged Value"
                                        }],
                                        "id": "_2021x_1_30e0104_1666104142168_946710_3552",
                                        "tagName": "Diagram",
                                        "type": "Diagram"
                                    }, {
                                        "showName": "Initial Node < >",
                                        "icon": "memo",
                                        "name": "",
                                        "id": "_2021x_1_30e0104_1666104142159_274763_3544",
                                        "tagName": "InitialNode",
                                        "type": "Initial Node"
                                    }, {
                                        "showName": "Activity Final Node < >",
                                        "icon": "setUp",
                                        "name": "",
                                        "id": "_2021x_1_30e0104_1666104142159_910492_3545",
                                        "tagName": "ActivityFinalNode",
                                        "type": "Activity Final Node"
                                    }, {
                                        "showName": "Call Behavior Action < >",
                                        "icon": "management",
                                        "name": "",
                                        "id": "_2021x_1_30e0104_1666104142164_867589_3546",
                                        "tagName": "CallBehaviorAction",
                                        "type": "Call Behavior Action"
                                    }],
                                    "id": "_2021x_1_30e0104_1666104142166_292278_3551",
                                    "tagName": "Activity",
                                    "type": "Activity"
                                }],
                                "id": "_2021x_1_30e0104_1666103624014_694094_3480",
                                "tagName": "State",
                                "type": "State"
                            }, {
                                "showName": "State <停止>",
                                "icon": "ticket",
                                "name": "停止",
                                "id": "_2021x_1_30e0104_1666103640629_642152_3496",
                                "tagName": "State",
                                "type": "State"
                            }],
                            "id": "_2021x_1_30e0104_1666103588512_848790_3432",
                            "tagName": "Region",
                            "type": "Region"
                        }],
                        "id": "_2021x_1_30e0104_1666103588509_724988_3431",
                        "tagName": "StateMachine",
                        "type": "State Machine"
                    }],
                    "id": "_2021x_1_30e0104_1666102762429_989900_3218",
                    "tagName": "Class",
                    "type": "Block"
                }, {
                    "showName": "Diagram <结构>",
                    "icon": "tickets",
                    "name": "结构",
                    "childProjects": [{
                        "showName": "String Tagged Value < >",
                        "icon": "dataAnalysis",
                        "id": "_2021x_1_30e0104_1666102782965_733229_3219_application_be00301_1073306188629_537791_2",
                        "tagName": "StringTaggedValue",
                        "type": "String Tagged Value"
                    }, {
                        "showName": "String Tagged Value < >",
                        "icon": "dataAnalysis",
                        "id": "_2021x_1_30e0104_1666102782965_733229_3219_application_be00301_1073394345322_922552_1",
                        "tagName": "StringTaggedValue",
                        "type": "String Tagged Value"
                    }, {
                        "showName": "String Tagged Value < >",
                        "icon": "dataAnalysis",
                        "id": "_2021x_1_30e0104_1666102782965_733229_3219_application_be00301_1077726770128_871366_1",
                        "tagName": "StringTaggedValue",
                        "type": "String Tagged Value"
                    }, {
                        "showName": "String Tagged Value < >",
                        "icon": "dataAnalysis",
                        "id": "_2021x_1_30e0104_1666102782965_733229_3219_application_16_8beta_8ca0285_1257244649124_794756_344",
                        "tagName": "StringTaggedValue",
                        "type": "String Tagged Value"
                    }],
                    "id": "_2021x_1_30e0104_1666102782965_733229_3219",
                    "tagName": "Diagram",
                    "type": "Diagram"
                }],
                "id": "_2021x_1_30e0104_1666102740844_481037_3217",
                "tagName": "Package",
                "type": "Package"
            }, {
                "showName": "Package <状态>",
                "icon": "document",
                "name": "状态",
                "id": "_2021x_1_30e0104_1666102892467_540030_3277",
                "tagName": "Package",
                "type": "Package"
            }, {
                "showName": "Package <信号>",
                "icon": "document",
                "name": "信号",
                "childProjects": [{
                    "showName": "Signal <start>",
                    "icon": "reading",
                    "name": "start",
                    "id": "_2021x_1_30e0104_1666103823663_413935_3524",
                    "tagName": "Signal",
                    "type": "Signal"
                }, {
                    "showName": "Signal <pause>",
                    "icon": "reading",
                    "name": "pause",
                    "id": "_2021x_1_30e0104_1666103971601_819547_3529",
                    "tagName": "Signal",
                    "type": "Signal"
                }, {
                    "showName": "Signal <resume>",
                    "icon": "reading",
                    "name": "resume",
                    "id": "_2021x_1_30e0104_1666104029134_591072_3534",
                    "tagName": "Signal",
                    "type": "Signal"
                }, {
                    "showName": "Signal <reset>",
                    "icon": "reading",
                    "name": "reset",
                    "id": "_2021x_1_30e0104_1666104086230_851645_3539",
                    "tagName": "Signal",
                    "type": "Signal"
                }],
                "id": "_2021x_1_30e0104_1666103759424_203325_3523",
                "tagName": "Package",
                "type": "Package"
            }],
            "id": "_2021x_1_30e0104_1666102704321_352579_3215",
            "tagName": "Package",
            "type": "Package"
        }],
        "showName": "MagicDraw",
        "modeltype": "MagicDraw",
        "icon": "user",
        "update": "0",
        "id": "B19080618",
        "tagName": "User"
    }
]

export default {
    getRepoList: config => {
        return {
            code: 200,
            data: {
                list: projectList,
            }
        }
    }
}