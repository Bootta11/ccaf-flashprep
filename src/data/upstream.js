// The 15-question mock exam from jamesbuckett/ccaf-exam-tutorial (MIT).
// Source: https://github.com/jamesbuckett/ccaf-exam-tutorial (study-guide.html)
// Imported verbatim; `d` is the CCA-F domain, `a` the 0-based correct option index.

export const UPSTREAM = [
  {
    "d": "1",
    "q": "You're designing a multi-agent research system. Each specialized agent needs to search different sources independently. Which topology should you choose?",
    "options": [
      "Fully-connected mesh: every agent can call every other agent for maximum flexibility.",
      "Hub-and-spoke: one orchestrator decomposes the query and delegates to isolated sub-agents.",
      "Sequential chain: each agent hands off the full conversation to the next.",
      "Single-agent loop: a single Claude instance iteratively searches all sources itself."
    ],
    "a": 1,
    "explain": "Hub-and-spoke is the canonical pattern: the orchestrator keeps the plan, each sub-agent owns one slice of work in isolated context, and only summaries return. Mesh is chaos; chain leaks context; single-agent fails when sub-tasks are independent and parallelizable."
  },
  {
    "d": "2",
    "q": "Your MCP server needs to expose (a) a way for the model to fetch live order data, (b) a set of documentation pages the app preloads, (c) a shortcut users can type to start a refund workflow. Map each to the right primitive.",
    "options": [
      "(a) resource, (b) tool, (c) prompt",
      "(a) tool, (b) resource, (c) prompt",
      "(a) tool, (b) prompt, (c) resource",
      "(a) prompt, (b) tool, (c) resource"
    ],
    "a": 1,
    "explain": "Ask who initiates. Model-invoked action → tool. App-provided data → resource. User-triggered template → prompt. Live fetch is a tool (model decides to call it); preloaded docs are resources; a user shortcut is a prompt template."
  },
  {
    "d": "3",
    "q": "You want 'always run gofmt after every file edit' to happen deterministically, no matter what the model decides. Where does this belong?",
    "options": [
      "A line in the project CLAUDE.md.",
      "A custom skill the model can invoke.",
      "A PostToolUse hook in settings.json.",
      "A slash command the user types manually."
    ],
    "a": 2,
    "explain": "CLAUDE.md can't guarantee behavior — the model can ignore or overlook it. Skills are model-chosen. Slash commands require the user to type. Hooks are the harness's deterministic event handlers — they always fire."
  },
  {
    "d": "4",
    "q": "You need structured output from Claude for a data extraction pipeline — guaranteed to match a schema. What's the reliable approach?",
    "options": [
      "Write 'Respond in JSON matching this schema: {...}' in the system prompt.",
      "Define a tool whose input_schema is the target JSON schema and force the model to use it.",
      "Ask Claude to 'think step by step' and then 'output only JSON'.",
      "Use a very high temperature so Claude explores more output formats."
    ],
    "a": 1,
    "explain": "Tool-use with a JSON schema is the canonical structured-output path: the model fills a schema the API enforces, and you get a validated tool_use block back. Prose instructions alone are unreliable and don't guarantee shape."
  },
  {
    "d": "5",
    "q": "A long-running agent has a 150K-token conversation that includes a policy block the model must always follow. Where should the policy live?",
    "options": [
      "Buried in the middle of the conversation so it doesn't dominate.",
      "In the system prompt at the top — and repeated near the end of the context.",
      "Only at the very end, right before the final user turn.",
      "Attached as a resource so the model fetches it when needed."
    ],
    "a": 1,
    "explain": "Attention is strongest at start and end, weakest in the middle ('lost in the middle'). Critical rules belong at both anchors. The system prompt alone is vulnerable on long contexts — restate the policy near the current turn."
  },
  {
    "d": "1",
    "q": "A customer support agent handles refunds, order lookups, and escalations. Team is considering splitting into 3 specialized sub-agents. What's the best first move?",
    "options": [
      "Split immediately — specialization improves accuracy.",
      "Start with a single agent and a set of tools; split only if evidence demands it.",
      "Build a mesh of 3 agents that call each other as needed.",
      "Use one agent per user message for minimum state."
    ],
    "a": 1,
    "explain": "Most 'support-agent' workloads fit a single loop with well-described tools. Adding sub-agents adds orchestration cost and context-boundary bugs. Split only when you have independent, parallelizable work — not by default."
  },
  {
    "d": "2",
    "q": "Your tool's description reads: 'Gets data from the database.' The model keeps calling it at wrong times. What's the fix?",
    "options": [
      "Raise the model temperature for more exploration.",
      "Rewrite the description to specify what data, which parameters, side effects, and when NOT to call.",
      "Rename the tool 'get_data_v2' to refresh the model's attention.",
      "Add more few-shot examples of unrelated tasks."
    ],
    "a": 1,
    "explain": "The model decides based on the description. Vague text = wrong calls. A good description names the domain, lists parameters with units, states side effects, and gives anti-examples of when NOT to call."
  },
  {
    "d": "3",
    "q": "You want a capability the model can choose to invoke for 'review this PR for security issues'. It should not run on every tool call — only when relevant. Which Claude Code primitive?",
    "options": [
      "A hook wired to the PreToolUse event.",
      "An MCP resource containing a security checklist.",
      "A skill with a clear description of when to use it.",
      "A line in global CLAUDE.md that says 'always check security'."
    ],
    "a": 2,
    "explain": "Skills are model-selected capabilities. The description tells Claude when to invoke them. Hooks fire deterministically on events (wrong for 'only when relevant'). A resource is passive data. CLAUDE.md instructions can drift."
  },
  {
    "d": "4",
    "q": "You're writing a long prompt with instructions, three in-context examples, and a block of user data. How should you structure it?",
    "options": [
      "Concatenate everything as plain prose separated by blank lines.",
      "Wrap each section in XML tags: <instructions>, <example>, <data>.",
      "Put everything in Markdown headings.",
      "Interleave examples with the instructions to reinforce each rule."
    ],
    "a": 1,
    "explain": "Claude is trained to respect XML-tag structure. Tags cleanly delimit instructions from examples from raw data and reduce confusion on what's a directive vs. what's content to process."
  },
  {
    "d": "5",
    "q": "A chatbot repeatedly sends the same 40K-token product manual as part of its system prompt. Traffic is high and latency is bad. Best fix?",
    "options": [
      "Move the manual to the user turn so it's 'closer' to the question.",
      "Mark the manual with cache_control so it's cached as a stable prefix.",
      "Summarize the manual into 200 tokens once and discard the rest.",
      "Use a smaller model to reduce per-token cost."
    ],
    "a": 1,
    "explain": "Prompt caching is designed exactly for this: stable prefixes (system prompt, long references) get marked with cache_control; cache hits cost a fraction of uncached tokens and cut latency dramatically."
  },
  {
    "d": "1",
    "q": "A sub-agent spawned by an orchestrator finishes a task. What should it return to the parent?",
    "options": [
      "Its full conversation history so the parent can audit every step.",
      "A concise summary of the outcome + any structured artifacts the parent asked for.",
      "Nothing — the parent should poll tools to verify.",
      "All of the tool outputs it saw, verbatim."
    ],
    "a": 1,
    "explain": "Sub-agents exist to isolate context. Dumping the full transcript back defeats the purpose and blows up the parent's token budget. Return a summary + the specific artifact the parent requested."
  },
  {
    "d": "2",
    "q": "A tool returns 2MB of JSON per call. The model's context fills up after three calls. Best remediation?",
    "options": [
      "Raise max_tokens so the model can output longer responses.",
      "Return a small preview + IDs or cursors; expose a second tool to fetch details on demand.",
      "Compress the JSON with gzip inline in the response.",
      "Rename the tool so the model calls it less often."
    ],
    "a": 1,
    "explain": "Tool result size is a context budget issue. The standard fix is a paginated / cursor-based pattern: return a tight preview with handles, and let the model fetch details only when needed."
  },
  {
    "d": "3",
    "q": "You're configuring Claude Code for a team. Every engineer should share the same 'no emojis in commits' rule, but you personally want 'use 4-space indent everywhere'. Where does each go?",
    "options": [
      "Both in the global CLAUDE.md.",
      "Both in the project CLAUDE.md.",
      "'No emojis' in project CLAUDE.md (checked in); '4-space indent' in your global CLAUDE.md.",
      "Put both in settings.json."
    ],
    "a": 2,
    "explain": "Team-wide rules belong in the project CLAUDE.md (checked in, shared). Personal preferences belong in your global ~/.claude/CLAUDE.md — they apply across your sessions without imposing on teammates."
  },
  {
    "d": "4",
    "q": "Which prompt pattern is most likely to produce inconsistent output structure?",
    "options": [
      "A tool-use call backed by a strict JSON schema.",
      "A prompt that says 'Return your answer as JSON with fields x, y, z.'",
      "A prompt with a wrapped <output_format> tag describing the schema.",
      "Few-shot examples showing three input → JSON output pairs."
    ],
    "a": 1,
    "explain": "Natural-language 'return as JSON' is the weakest contract — nothing enforces it, and the model may wrap output in prose or add fields. Tool-use with a schema is strongest; XML-tagged format hints and few-shot examples are solid second tiers."
  },
  {
    "d": "5",
    "q": "Your agent needs to remember user preferences across separate sessions (new chats, different days). Best mechanism?",
    "options": [
      "Expand the context window and keep the full history forever.",
      "Use the memory tool (file-backed) so the model reads/writes persistent notes.",
      "Save preferences in a Python variable in the outer loop.",
      "Rely on prompt caching — the cache persists across sessions."
    ],
    "a": 1,
    "explain": "Prompt caching is ephemeral and tied to prompt prefixes, not user state. The memory tool is designed for persistent, cross-session facts — the model can list, read, and write notes that survive between conversations."
  }
];
