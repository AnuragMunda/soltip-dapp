/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/soltip.json`.
 */
export type Soltip = {
  "address": "9UXhm3zakFtqXYYgEuT2VQhhp7ots23N52PHKxynFCZ9",
  "metadata": {
    "name": "soltip",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "closeProfile",
      "discriminator": [
        167,
        36,
        181,
        8,
        136,
        158,
        46,
        207
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "profile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  80,
                  82,
                  79,
                  70,
                  73,
                  76,
                  69
                ]
              },
              {
                "kind": "account",
                "path": "creator"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initializeProfile",
      "discriminator": [
        32,
        145,
        77,
        213,
        58,
        39,
        251,
        234
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "profile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  80,
                  82,
                  79,
                  70,
                  73,
                  76,
                  69
                ]
              },
              {
                "kind": "account",
                "path": "creator"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "email",
          "type": "string"
        },
        {
          "name": "bio",
          "type": "string"
        },
        {
          "name": "aboutMe",
          "type": "string"
        }
      ]
    },
    {
      "name": "setCoinValue",
      "discriminator": [
        75,
        92,
        169,
        224,
        149,
        37,
        13,
        219
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "profile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  80,
                  82,
                  79,
                  70,
                  73,
                  76,
                  69
                ]
              },
              {
                "kind": "account",
                "path": "creator"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "value",
          "type": "u64"
        }
      ]
    },
    {
      "name": "supportCreator",
      "discriminator": [
        162,
        115,
        57,
        64,
        112,
        75,
        21,
        43
      ],
      "accounts": [
        {
          "name": "supporter",
          "writable": true,
          "signer": true
        },
        {
          "name": "supporterAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  83,
                  85,
                  80,
                  80,
                  79,
                  82,
                  84,
                  69,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "profile.creator",
                "account": "profile"
              },
              {
                "kind": "account",
                "path": "supporter"
              },
              {
                "kind": "account",
                "path": "profile.supporter_count",
                "account": "profile"
              }
            ]
          }
        },
        {
          "name": "profile",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "name",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "message",
          "type": {
            "option": "string"
          }
        }
      ]
    },
    {
      "name": "updateProfile",
      "discriminator": [
        98,
        67,
        99,
        206,
        86,
        115,
        175,
        1
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "profile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  80,
                  82,
                  79,
                  70,
                  73,
                  76,
                  69
                ]
              },
              {
                "kind": "account",
                "path": "creator"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "name",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "email",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "bio",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "aboutMe",
          "type": {
            "option": "string"
          }
        }
      ]
    },
    {
      "name": "withdrawCoins",
      "discriminator": [
        127,
        161,
        109,
        223,
        216,
        108,
        146,
        181
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "profile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  80,
                  82,
                  79,
                  70,
                  73,
                  76,
                  69
                ]
              },
              {
                "kind": "account",
                "path": "creator"
              }
            ]
          }
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "profile",
      "discriminator": [
        184,
        101,
        165,
        188,
        95,
        63,
        127,
        188
      ]
    },
    {
      "name": "supporter",
      "discriminator": [
        198,
        125,
        73,
        94,
        72,
        40,
        233,
        159
      ]
    }
  ],
  "events": [
    {
      "name": "closeProfileEvent",
      "discriminator": [
        49,
        199,
        38,
        148,
        206,
        28,
        3,
        25
      ]
    },
    {
      "name": "initializeProfileEvent",
      "discriminator": [
        189,
        118,
        188,
        102,
        185,
        210,
        62,
        210
      ]
    },
    {
      "name": "supportCreatorEvent",
      "discriminator": [
        47,
        237,
        171,
        174,
        65,
        99,
        119,
        117
      ]
    },
    {
      "name": "updateCoinValueEvent",
      "discriminator": [
        231,
        232,
        19,
        175,
        194,
        41,
        50,
        119
      ]
    },
    {
      "name": "updateProfileEvent",
      "discriminator": [
        15,
        250,
        133,
        11,
        68,
        57,
        250,
        45
      ]
    },
    {
      "name": "withdrawFundEvent",
      "discriminator": [
        24,
        221,
        59,
        23,
        62,
        212,
        94,
        139
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "nameTooLong",
      "msg": "Name exceeds maximum length"
    },
    {
      "code": 6001,
      "name": "messageTooLong",
      "msg": "Message exceeds maximum length"
    },
    {
      "code": 6002,
      "name": "invalidAmount",
      "msg": "Amount must be greater than 0"
    }
  ],
  "types": [
    {
      "name": "closeProfileEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "solTransferred",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "initializeProfileEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "profile",
            "type": "pubkey"
          },
          {
            "name": "creator",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "profile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "email",
            "type": "string"
          },
          {
            "name": "bio",
            "type": "string"
          },
          {
            "name": "aboutMe",
            "type": "string"
          },
          {
            "name": "fund",
            "type": "u64"
          },
          {
            "name": "coinValue",
            "type": "u64"
          },
          {
            "name": "supporterCount",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "supportCreatorEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "supporter",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "supporter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "supporter",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "tip",
            "type": "u64"
          },
          {
            "name": "message",
            "type": {
              "option": "string"
            }
          }
        ]
      }
    },
    {
      "name": "updateCoinValueEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "profile",
            "type": "pubkey"
          },
          {
            "name": "coinValue",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "updateProfileEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "profile",
            "type": "pubkey"
          },
          {
            "name": "creator",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "withdrawFundEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "profile",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
