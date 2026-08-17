/**
 * PROMO_MODELS — 「按量+可白嫖」免费模型情报（provider → 免费模型集合）。
 *
 * 由 `node scripts/sync-promo-models.mjs` 从本机 pi-ai catalog 自动提取
 * （cost.input==0 且 cost.output==0 的模型），勿手改。活动会变化——升级 DSH 后
 * 重跑该脚本即可同步；用户可在 metering 配置中用 `freeModels` 覆盖/扩展。
 * 订阅制 provider（github-copilot / opencode-go / token-plan 系等）不在此列，
 * 其白嫖语义由 metering 的 subscription/free 模式决定。
 *
 * 来源：@earendil-works/pi-ai（生成于 2026-08-17T14:59:15.264Z）
 */
export const PROMO_MODELS = {
  "google": {
    "gemma-4-26b-a4b-it": true,
    "gemma-4-31b-it": true
  },
  "huggingface": {
    "zai-org/GLM-4.7-Flash": true
  },
  "mistral": {
    "labs-devstral-small-2512": true
  },
  "nvidia": {
    "meta/llama-3.1-70b-instruct": true,
    "meta/llama-3.1-8b-instruct": true,
    "meta/llama-3.2-11b-vision-instruct": true,
    "meta/llama-3.2-90b-vision-instruct": true,
    "meta/llama-3.3-70b-instruct": true,
    "minimaxai/minimax-m3": true,
    "mistralai/mistral-small-4-119b-2603": true,
    "moonshotai/kimi-k2.6": true,
    "nvidia/nemotron-3-nano-30b-a3b": true,
    "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning": true,
    "nvidia/nvidia-nemotron-nano-9b-v2": true,
    "openai/gpt-oss-120b": true,
    "openai/gpt-oss-20b": true,
    "stepfun-ai/step-3.5-flash": true,
    "stepfun-ai/step-3.7-flash": true,
    "z-ai/glm-5.2": true
  },
  "opencode": {
    "big-pickle": true,
    "deepseek-v4-flash-free": true,
    "laguna-s-2.1-free": true,
    "ling-3.0-flash-free": true,
    "mimo-v2.5-free": true,
    "nemotron-3-ultra-free": true,
    "north-mini-code-free": true
  },
  "openrouter": {
    "auto": true,
    "cohere/north-mini-code:free": true,
    "google/gemma-4-26b-a4b-it:free": true,
    "google/gemma-4-31b-it:free": true,
    "inclusionai/ling-3.0-flash:free": true,
    "nvidia/nemotron-3-nano-30b-a3b:free": true,
    "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free": true,
    "nvidia/nemotron-3-super-120b-a12b:free": true,
    "nvidia/nemotron-3-ultra-550b-a55b:free": true,
    "nvidia/nemotron-nano-12b-v2-vl:free": true,
    "nvidia/nemotron-nano-9b-v2:free": true,
    "openai/gpt-oss-20b:free": true,
    "openrouter/free": true,
    "openrouter/fusion": true,
    "poolside/laguna-m.1:free": true,
    "poolside/laguna-s-2.1:free": true,
    "poolside/laguna-xs-2.1:free": true
  },
  "vercel-ai-gateway": {
    "inclusionai/ling-3.0-flash-free": true,
    "poolside/laguna-s-2.1-free": true,
    "zai/glm-4.6v-flash": true
  }
};
