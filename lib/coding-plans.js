/**
 * CODING_PLAN_PRICING — DSH 预设全部 coding plan / token-plan provider 的官方美元单价。
 *
 * 由 `node scripts/sync-coding-plans.mjs` 从本机 DeepSeek Harness 内置的
 * `@earendil-works/pi-ai` catalog 生成，勿手改——价格随 DSH 发行版更新，升级后
 * 重跑该脚本即可同步。单位为美元 / 1M tokens。
 *
 * 语义：
 * - kind "coding"：opencode 等平台公开的官方量价（$ / 1M tokens）。
 * - kind "subscription"：基于订阅 token 包的 provider，官方不公布逐 token 单价，
 *   一律视为 0（订阅额度内含，调用不额外产生费用）。
 * - 人民币展示价 = usd × 插件配置 `codingUsdCnyRate`（默认参考汇率）。
 * - 用户 `prices` 中对该模型名的精确条目仍可整体覆盖（优先级最高）。
 *
 * 来源：@earendil-works/pi-ai v0.82.1
 * 生成时间：2026-08-17T06:10:20.326Z
 */
export const CODING_PLAN_SOURCE = Object.freeze({
  package: "@earendil-works/pi-ai",
  version: "0.82.1",
  generatedAt: "2026-08-17T06:10:20.326Z"
});

export const CODING_PLAN_PRICING = {
  "opencode-go": {
    "label": "OpenCode GO",
    "kind": "coding",
    "models": {
      "minimax-m3": {
        "usd": {
          "input": 0.3,
          "cacheRead": 0.06,
          "output": 1.2
        }
      },
      "qwen3.7-max": {
        "usd": {
          "input": 2.5,
          "cacheRead": 0.5,
          "output": 7.5
        }
      },
      "qwen3.7-plus": {
        "usd": {
          "input": 0.4,
          "cacheRead": 0.04,
          "output": 1.6
        }
      },
      "deepseek-v4-flash": {
        "usd": {
          "input": 0.14,
          "cacheRead": 0.0028,
          "output": 0.28
        }
      },
      "deepseek-v4-pro": {
        "usd": {
          "input": 0.435,
          "cacheRead": 0.003625,
          "output": 0.87
        }
      },
      "glm-5.1": {
        "usd": {
          "input": 1.4,
          "cacheRead": 0.26,
          "output": 4.4
        }
      },
      "glm-5.2": {
        "usd": {
          "input": 1.4,
          "cacheRead": 0.26,
          "output": 4.4
        }
      },
      "hy3": {
        "usd": {
          "input": 0.14,
          "cacheRead": 0.035,
          "output": 0.58
        }
      },
      "kimi-k2.6": {
        "usd": {
          "input": 0.95,
          "cacheRead": 0.16,
          "output": 4
        }
      },
      "kimi-k2.7-code": {
        "usd": {
          "input": 0.95,
          "cacheRead": 0.19,
          "output": 4
        }
      },
      "kimi-k3": {
        "usd": {
          "input": 3,
          "cacheRead": 0.3,
          "output": 15
        }
      },
      "mimo-v2.5": {
        "usd": {
          "input": 0.14,
          "cacheRead": 0.0028,
          "output": 0.28
        }
      },
      "mimo-v2.5-pro": {
        "usd": {
          "input": 0.435,
          "cacheRead": 0.003625,
          "output": 0.87
        }
      },
      "minimax-m2.7": {
        "usd": {
          "input": 0.3,
          "cacheRead": 0.06,
          "output": 1.2
        }
      },
      "qwen3.6-plus": {
        "usd": {
          "input": 0.5,
          "cacheRead": 0.05,
          "output": 3
        }
      },
      "grok-4.5": {
        "usd": {
          "input": 2,
          "cacheRead": 0.5,
          "output": 6
        }
      }
    }
  },
  "opencode": {
    "label": "OpenCode Zen",
    "kind": "coding",
    "models": {
      "claude-fable-5": {
        "usd": {
          "input": 10,
          "cacheRead": 1,
          "output": 50
        }
      },
      "claude-haiku-4-5": {
        "usd": {
          "input": 1,
          "cacheRead": 0.1,
          "output": 5
        }
      },
      "claude-opus-4-1": {
        "usd": {
          "input": 15,
          "cacheRead": 1.5,
          "output": 75
        }
      },
      "claude-opus-4-5": {
        "usd": {
          "input": 5,
          "cacheRead": 0.5,
          "output": 25
        }
      },
      "claude-opus-4-6": {
        "usd": {
          "input": 5,
          "cacheRead": 0.5,
          "output": 25
        }
      },
      "claude-opus-4-7": {
        "usd": {
          "input": 5,
          "cacheRead": 0.5,
          "output": 25
        }
      },
      "claude-opus-4-8": {
        "usd": {
          "input": 5,
          "cacheRead": 0.5,
          "output": 25
        }
      },
      "claude-opus-5": {
        "usd": {
          "input": 5,
          "cacheRead": 0.5,
          "output": 25
        }
      },
      "claude-sonnet-4": {
        "usd": {
          "input": 3,
          "cacheRead": 0.3,
          "output": 15
        }
      },
      "claude-sonnet-4-5": {
        "usd": {
          "input": 3,
          "cacheRead": 0.3,
          "output": 15
        }
      },
      "claude-sonnet-4-6": {
        "usd": {
          "input": 3,
          "cacheRead": 0.3,
          "output": 15
        }
      },
      "claude-sonnet-5": {
        "usd": {
          "input": 2,
          "cacheRead": 0.2,
          "output": 10
        }
      },
      "qwen3.5-plus": {
        "usd": {
          "input": 0.2,
          "cacheRead": 0.02,
          "output": 1.2
        }
      },
      "qwen3.6-plus": {
        "usd": {
          "input": 0.5,
          "cacheRead": 0.05,
          "output": 3
        }
      },
      "gemini-3-flash": {
        "usd": {
          "input": 0.5,
          "cacheRead": 0.05,
          "output": 3
        }
      },
      "gemini-3.1-pro": {
        "usd": {
          "input": 2,
          "cacheRead": 0.2,
          "output": 12
        }
      },
      "gemini-3.5-flash": {
        "usd": {
          "input": 1.5,
          "cacheRead": 0.15,
          "output": 9
        }
      },
      "gemini-3.5-flash-lite": {
        "usd": {
          "input": 0.3,
          "cacheRead": 0.03,
          "output": 2.5
        }
      },
      "gemini-3.6-flash": {
        "usd": {
          "input": 1.5,
          "cacheRead": 0.15,
          "output": 7.5
        }
      },
      "big-pickle": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "deepseek-v4-flash": {
        "usd": {
          "input": 0.14,
          "cacheRead": 0.028,
          "output": 0.28
        }
      },
      "deepseek-v4-flash-free": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "deepseek-v4-pro": {
        "usd": {
          "input": 1.74,
          "cacheRead": 0.145,
          "output": 3.84
        }
      },
      "glm-5": {
        "usd": {
          "input": 1,
          "cacheRead": 0.2,
          "output": 3.2
        }
      },
      "glm-5.1": {
        "usd": {
          "input": 1.4,
          "cacheRead": 0.26,
          "output": 4.4
        }
      },
      "glm-5.2": {
        "usd": {
          "input": 1.4,
          "cacheRead": 0.26,
          "output": 4.4
        }
      },
      "grok-build-0.1": {
        "usd": {
          "input": 1,
          "cacheRead": 0.2,
          "output": 2
        }
      },
      "kimi-k2.5": {
        "usd": {
          "input": 0.6,
          "cacheRead": 0.08,
          "output": 3
        }
      },
      "kimi-k2.6": {
        "usd": {
          "input": 0.95,
          "cacheRead": 0.16,
          "output": 4
        }
      },
      "kimi-k2.7-code": {
        "usd": {
          "input": 0.95,
          "cacheRead": 0.19,
          "output": 4
        }
      },
      "laguna-s-2.1-free": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "ling-3.0-flash-free": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "mimo-v2.5-free": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "minimax-m2.5": {
        "usd": {
          "input": 0.3,
          "cacheRead": 0.06,
          "output": 1.2
        }
      },
      "minimax-m2.7": {
        "usd": {
          "input": 0.3,
          "cacheRead": 0.06,
          "output": 1.2
        }
      },
      "minimax-m3": {
        "usd": {
          "input": 0.3,
          "cacheRead": 0.06,
          "output": 1.2
        }
      },
      "nemotron-3-ultra-free": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "north-mini-code-free": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "gpt-5": {
        "usd": {
          "input": 1.07,
          "cacheRead": 0.107,
          "output": 8.5
        }
      },
      "gpt-5-codex": {
        "usd": {
          "input": 1.07,
          "cacheRead": 0.107,
          "output": 8.5
        }
      },
      "gpt-5-nano": {
        "usd": {
          "input": 0.05,
          "cacheRead": 0.005,
          "output": 0.4
        }
      },
      "gpt-5.1": {
        "usd": {
          "input": 1.07,
          "cacheRead": 0.107,
          "output": 8.5
        }
      },
      "gpt-5.1-codex": {
        "usd": {
          "input": 1.07,
          "cacheRead": 0.107,
          "output": 8.5
        }
      },
      "gpt-5.1-codex-max": {
        "usd": {
          "input": 1.25,
          "cacheRead": 0.125,
          "output": 10
        }
      },
      "gpt-5.1-codex-mini": {
        "usd": {
          "input": 0.25,
          "cacheRead": 0.025,
          "output": 2
        }
      },
      "gpt-5.2": {
        "usd": {
          "input": 1.75,
          "cacheRead": 0.175,
          "output": 14
        }
      },
      "gpt-5.2-codex": {
        "usd": {
          "input": 1.75,
          "cacheRead": 0.175,
          "output": 14
        }
      },
      "gpt-5.3-codex": {
        "usd": {
          "input": 1.75,
          "cacheRead": 0.175,
          "output": 14
        }
      },
      "gpt-5.4": {
        "usd": {
          "input": 2.5,
          "cacheRead": 0.25,
          "output": 15
        }
      },
      "gpt-5.4-mini": {
        "usd": {
          "input": 0.75,
          "cacheRead": 0.075,
          "output": 4.5
        }
      },
      "gpt-5.4-nano": {
        "usd": {
          "input": 0.2,
          "cacheRead": 0.02,
          "output": 1.25
        }
      },
      "gpt-5.4-pro": {
        "usd": {
          "input": 30,
          "cacheRead": 30,
          "output": 180
        }
      },
      "gpt-5.5": {
        "usd": {
          "input": 5,
          "cacheRead": 0.5,
          "output": 30
        }
      },
      "gpt-5.5-pro": {
        "usd": {
          "input": 30,
          "cacheRead": 30,
          "output": 180
        }
      },
      "gpt-5.6-luna": {
        "usd": {
          "input": 1,
          "cacheRead": 0.1,
          "output": 6
        }
      },
      "gpt-5.6-sol": {
        "usd": {
          "input": 5,
          "cacheRead": 0.5,
          "output": 30
        }
      },
      "gpt-5.6-terra": {
        "usd": {
          "input": 2.5,
          "cacheRead": 0.25,
          "output": 15
        }
      },
      "grok-4.5": {
        "usd": {
          "input": 2,
          "cacheRead": 0.5,
          "output": 6
        }
      }
    }
  },
  "kimi-coding": {
    "label": "Kimi Coding",
    "kind": "coding",
    "models": {
      "k3": {
        "usd": {
          "input": 3,
          "cacheRead": 0.3,
          "output": 15
        }
      },
      "k3-256k": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "kimi-for-coding": {
        "usd": {
          "input": 0.95,
          "cacheRead": 0.19,
          "output": 4
        }
      },
      "kimi-for-coding-highspeed": {
        "usd": {
          "input": 1.9,
          "cacheRead": 0.38,
          "output": 8
        }
      }
    }
  },
  "qwen-token-plan": {
    "label": "Qwen Token Plan",
    "kind": "subscription",
    "models": {
      "MiniMax-M2.5": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "deepseek-v3.2": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "deepseek-v4-flash": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "deepseek-v4-pro": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "glm-5": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "glm-5.1": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "glm-5.2": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "kimi-k2.5": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "kimi-k2.6": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "kimi-k2.7-code": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "qwen3.6-flash": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "qwen3.6-plus": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "qwen3.7-max": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "qwen3.7-plus": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "qwen3.8-max-preview": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      }
    }
  },
  "qwen-token-plan-cn": {
    "label": "Qwen Token Plan (CN)",
    "kind": "subscription",
    "models": {
      "MiniMax-M2.5": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "deepseek-v3.2": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "deepseek-v4-flash": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "deepseek-v4-pro": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "glm-5": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "glm-5.1": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "glm-5.2": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "kimi-k2.5": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "kimi-k2.6": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "kimi-k2.7-code": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "qwen3.6-flash": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "qwen3.6-plus": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "qwen3.7-max": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "qwen3.7-plus": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "qwen3.8-max-preview": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      }
    }
  },
  "xiaomi-token-plan-ams": {
    "label": "Xiaomi MiMo Token Plan (AMS)",
    "kind": "subscription",
    "models": {
      "mimo-v2-pro": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "mimo-v2.5": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "mimo-v2.5-pro": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      }
    }
  },
  "xiaomi-token-plan-cn": {
    "label": "Xiaomi MiMo Token Plan (CN)",
    "kind": "subscription",
    "models": {
      "mimo-v2-pro": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "mimo-v2.5": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "mimo-v2.5-pro": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      }
    }
  },
  "xiaomi-token-plan-sgp": {
    "label": "Xiaomi MiMo Token Plan (SGP)",
    "kind": "subscription",
    "models": {
      "mimo-v2-pro": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "mimo-v2.5": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "mimo-v2.5-pro": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      }
    }
  },
  "zai-coding-cn": {
    "label": "Z.ai Coding (CN)",
    "kind": "subscription",
    "models": {
      "glm-4.5-air": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "glm-4.7": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "glm-5-turbo": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "glm-5.1": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "glm-5.2": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      },
      "glm-5v-turbo": {
        "usd": {
          "input": 0,
          "cacheRead": 0,
          "output": 0
        }
      }
    }
  }
};
