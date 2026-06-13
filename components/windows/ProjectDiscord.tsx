'use client'

import { useState, useEffect, useRef } from 'react'

// Mock Discord responses for the demo
const MOCK_EXCHANGES = [
  {
    user: 'Researcher',
    avatar: '👤',
    command: '!hardmode Why do most quant strategies fail in production?',
    response: '🔬 **Hard Mode Analysis**\n\n**Claude (Opus)** [Skeptic Mode]\n\nLet me aggressively dismantle this question:\n\n**1. Overfitting is the silent killer**\nMost quants optimize for backtest metrics, not robustness. You\'re fitting noise, not signal. Your Sharpe ratio? Probably inflated by data snooping.\n\n**2. Regime change destroys static models**\nMarkets evolve. 2022 volatility dynamics ≠ 2020. Your "edge" from 2018-2020 is dead now. Walk-forward validation is necessary but not sufficient.\n\n**3. Execution reality ≠ simulation**\nSlippage, market impact, partial fills... your backtest assumes perfect fills. Reality doesn\'t care about your model.\n\n**Counter-arguments welcome. Prove me wrong.**\n\n*Routing: Claude Opus (Skeptic mode) | Cost: $0.04 | Tokens: 847*',
    ai: 'claude',
    timestamp: '2:34 PM'
  },
  {
    user: 'Researcher',
    avatar: '👤',
    command: '!consensus Is Monte Carlo simulation useful for backtesting?',
    response: '🤖 **Multi-AI Consensus**\n\n**Claude (Opus):** "Monte Carlo is essential for stress-testing. Random resampling of returns helps estimate distribution of outcomes, not just point estimates. Key insight: your single backtest path is one of infinite possible realities."\n\n**GPT-4:** "Agrees, but with caveats. Monte Carlo assumes returns are i.i.d. Markets have autocorrelation and volatility clustering. Block bootstrap preserves these dependencies better."\n\n**Gemini:** "Both correct, but add: Monte Carlo shines for position sizing and risk management, not strategy validation per se. Use it to answer \'how much can I lose?\' not \'will this strategy work?\'"\n\n\n**📊 Consensus:** Monte Carlo is a tool for risk estimation, not strategy validation. Use block bootstrap to preserve time-series structure. Critical for portfolio sizing, less so for entry/exit logic.\n\n*Routing: All 3 models | Cost: $0.12 | Tokens: 2,341*',
    ai: 'consensus',
    timestamp: '2:36 PM'
  },
  {
    user: 'Researcher',
    avatar: '👤',
    command: '!crosscheck What causes look-ahead bias in backtesting?',
    response: '⚠️ **Cross-Verification**\n\n**Claude:** "Look-ahead bias leaks future information into past decisions. Common causes: using future data for normalization (like rolling z-scores computed on full dataset), peaking at future volatility for position sizing, or incorporating earnings data before release date."\n\n**GPT-4:** "Add survivorship bias - only counting currently-active stocks in historical samples. Also data revisions: economic indicators get restated. Your \'historical\' data is actually forward-looking."\n\n\n**✅ Cross-verified:** Both models agree. Look-ahead bias is insidious because it\'s often unintentional. Audit every data pipeline step. If you \'normalize\' or \'adjust\' historical data, ask: \'did this calculation use information available at that time?\'\n\n*Routing: Claude + GPT-4 | Cost: $0.07 | Tokens: 1,423*',
    ai: 'crosscheck',
    timestamp: '2:38 PM'
  },
  {
    user: 'Researcher',
    avatar: '👤',
    command: '!auto Explain market microstructure impact on execution',
    response: '🎯 **Auto-Optimized Routing**\n\n**GPT-4o (Fast)** [Selected for speed/cost]\n\nMarket microstructure matters more than most quants admit:\n\n**Bid-Ask Spread** - Every cross costs you. Tight spreads (high liquidity) = less slippage.\n\n**Order Book Depth** - Size matters. Your order might be 10% of volume or 0.001%. Different impact.\n\n**Order Flow Toxicity** - Aggressive orders signal informed traders. Market makers widen spreads.\n\n**Time-of-Day Effects** - Open/close have different dynamics than mid-day.\n\n\n**Execution algorithms** (TWAP, VWAP, POV) exist to mitigate these. Your backtest assumes perfect execution at mid-price. Reality: you cross the spread, move the market, and receive partial fills.\n\n*Routing: GPT-4o (cost-optimized) | Cost: $0.01 | Tokens: 412*',
    ai: 'gpt',
    timestamp: '2:40 PM'
  }
]

const CHANNELS = [
  { id: 'general', name: 'general', unread: 0 },
  { id: 'research', name: 'research', unread: 3 },
  { id: 'trading', name: 'trading-strategies', unread: 0 },
  { id: 'help', name: 'bot-help', unread: 0 },
]

const MEMBERS = [
  { name: 'Researcher', status: 'online', avatar: '👤', bot: false },
  { name: 'ResearchBot', status: 'online', avatar: '🤖', bot: true },
  { name: 'Quant_Dev', status: 'idle', avatar: '👨‍💻', bot: false },
  { name: 'Data_Guru', status: 'offline', avatar: '📊', bot: false },
]

const AI_COLORS = {
  claude: { bg: 'bg-[#5865F2]/20', border: 'border-[#5865F2]', name: 'Claude Opus' },
  gpt: { bg: 'bg-[#57F287]/20', border: 'border-[#57F287]', name: 'GPT-4o' },
  consensus: { bg: 'bg-[#EB459E]/20', border: 'border-[#EB459E]', name: 'All 3 AIs' }
}

const STATUS_COLORS = {
  online: 'bg-[#23A559]',
  idle: 'bg-[#F0B232]',
  offline: 'bg-gray-500'
}

export default function ProjectDiscord() {
  const [selectedExchange, setSelectedExchange] = useState(-1)
  const [isTyping, setIsTyping] = useState(false)
  const [displayedResponse, setDisplayedResponse] = useState('')
  const [currentAI, setCurrentAI] = useState<string | null>(null)
  const [selectedChannel, setSelectedChannel] = useState('research')
  const [inputValue, setInputValue] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [displayedResponse, selectedExchange])

  const runExchange = (index: number) => {
    setSelectedExchange(index)
    setIsTyping(true)
    setDisplayedResponse('')
    setCurrentAI(MOCK_EXCHANGES[index].ai)

    const exchange = MOCK_EXCHANGES[index]
    let i = 0
    const typeInterval = setInterval(() => {
      if (i < exchange.response.length) {
        setDisplayedResponse(prev => prev + exchange.response[i])
        i++
      } else {
        clearInterval(typeInterval)
        setIsTyping(false)
      }
    }, 8)

    return () => clearInterval(typeInterval)
  }

  const handleCommandSubmit = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return

    const matchIndex = MOCK_EXCHANGES.findIndex(e => e.command.includes(trimmed))
    if (matchIndex !== -1) {
      runExchange(matchIndex)
    }
    setInputValue('')
  }

  const currentExchange = selectedExchange >= 0 ? MOCK_EXCHANGES[selectedExchange] : null

  return (
    <div className="h-full flex bg-[#313338] font-sans text-xs">
      {/* Server sidebar */}
      <div className="w-[72px] bg-[#1E1F22] flex flex-col items-center py-3 gap-2">
        {/* Discard logo - Home button */}
        <div className="relative group">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-white rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <button className="w-12 h-12 bg-[#5865F2] rounded-2xl hover:rounded-xl transition-all duration-200 flex items-center justify-center text-white relative overflow-hidden">
            {/* Discard logo - trash can glyph */}
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
          </button>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#111214] text-white text-[11px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Direct Messages
          </div>
        </div>

        <div className="w-8 h-0.5 bg-[#35363C] rounded-full my-1" />

        {/* Server icon */}
        <div className="relative group">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-white rounded-r-full" />
          <button className="w-12 h-12 bg-[#5865F2] rounded-2xl hover:rounded-xl transition-all duration-200 flex items-center justify-center text-2xl">
            🧪
          </button>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#111214] text-white text-[11px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Research Lab
          </div>
        </div>

        <div className="flex-1" />

        {/* Add server */}
        <button className="w-12 h-12 bg-[#313338] rounded-full hover:rounded-xl hover:bg-[#23A559] transition-all duration-200 flex items-center justify-center text-[#23A559] hover:text-white relative group">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#111214] text-white text-[11px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Add a Server
          </div>
        </button>

        {/* Explore */}
        <button className="w-12 h-12 bg-[#313338] rounded-full hover:rounded-xl hover:bg-[#5865F2] transition-all duration-200 flex items-center justify-center text-[#23A559] hover:text-white relative group">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#111214] text-white text-[11px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Explore Servers
          </div>
        </button>
      </div>

      {/* Channel sidebar */}
      <div className="w-60 bg-[#2B2D31] flex flex-col">
        {/* Server header */}
        <div className="h-12 px-4 flex items-center border-b border-[#1F2023] shadow-md cursor-pointer hover:bg-[#35373C] transition-colors">
          <span className="text-white font-semibold">Research Lab</span>
          <svg className="w-4 h-4 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>

        {/* Channels */}
        <div className="flex-1 p-2 overflow-y-auto">
          <div className="text-[#949BA4] text-[11px] font-semibold uppercase px-2 mb-1 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5H7z"/>
            </svg>
            Text Channels
          </div>
          {CHANNELS.map(channel => (
            <button
              key={channel.id}
              onClick={() => setSelectedChannel(channel.id)}
              className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded ${
                selectedChannel === channel.id
                  ? 'bg-[#404249] text-white'
                  : 'text-[#949BA4] hover:bg-[#35373C] hover:text-gray-300'
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z"/>
              </svg>
              <span className="truncate">{channel.name}</span>
              {channel.unread > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full">
                  {channel.unread}
                </span>
              )}
            </button>
          ))}

          <div className="text-[#949BA4] text-[11px] font-semibold uppercase px-2 mt-4 mb-1 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5H7z"/>
            </svg>
            Voice Channels
          </div>
          <button className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-[#949BA4] hover:bg-[#35373C] hover:text-gray-300">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3C10.34 3 9 4.37 9 6.07V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V6.07C15 4.37 13.66 3 12 3ZM5.5 12C5.5 14.76 7.74 17 10.5 17H13.5C16.26 17 18.5 14.76 18.5 12H16.5C16.5 13.66 15.16 15 13.5 15H10.5C8.84 15 7.5 13.66 7.5 12H5.5ZM12 18C9.24 18 7 15.76 7 13H5C5 16.53 7.61 19.43 11 19.93V23H13V19.93C16.39 19.43 19 16.53 19 13H17C17 15.76 14.76 18 12 18Z"/>
            </svg>
            <span>Lounge</span>
          </button>
        </div>

        {/* User panel */}
        <div className="h-[52px] bg-[#232428] px-2 flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 bg-[#5865F2] rounded-full flex items-center justify-center text-white text-sm">
              👤
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#232428] ${STATUS_COLORS.online}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-medium truncate">You</div>
            <div className="text-[#949BA4] text-[11px] truncate">Online</div>
          </div>
          <div className="flex gap-1">
            <button className="p-1.5 hover:bg-[#35373C] rounded text-[#B5BAC1]">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.5 16.5v-9l7 4.5-7 4.5z"/>
              </svg>
            </button>
            <button className="p-1.5 hover:bg-[#35373C] rounded text-[#B5BAC1]">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col bg-[#313338]">
        {/* Channel header */}
        <div className="h-12 px-4 flex items-center border-b border-[#1F2023] shadow-sm">
          <svg className="w-6 h-6 text-[#949BA4] mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z"/>
          </svg>
          <span className="text-white font-semibold">research</span>
          <div className="mx-4 w-px h-6 bg-[#3F4147]" />
          <span className="text-[#949BA4] truncate flex-1">Multi-AI research discussion • Try !hardmode, !consensus, !crosscheck</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {selectedExchange === -1 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#949BA4]">
              <div className="w-16 h-16 bg-[#404249] rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">#</span>
              </div>
              <div className="text-white text-lg font-semibold mb-2">Welcome to #research!</div>
              <div className="text-sm max-w-md text-center">
                This is the start of the #research channel. Use the commands below or type in the input to interact with the Research Bot!
              </div>
            </div>
          ) : (
            <>
              {/* User message */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center flex-shrink-0">
                  {currentExchange?.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-white font-medium hover:underline cursor-pointer">{currentExchange?.user}</span>
                    <span className="text-[10px] text-[#949BA4]">{currentExchange?.timestamp}</span>
                  </div>
                  <div className="text-white">{currentExchange?.command}</div>
                </div>
              </div>

              {/* Bot response */}
              {isTyping || displayedResponse ? (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#57F287] flex items-center justify-center flex-shrink-0 relative">
                    🤖
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#313338] bg-[#23A559]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-[#57F287] font-medium hover:underline cursor-pointer">ResearchBot</span>
                      <span className="px-1.5 py-0.5 bg-[#57F287]/20 text-[#57F287] text-[10px] rounded font-medium">BOT</span>
                      {currentAI && (
                        <span className="text-[10px] text-[#949BA4]">
                          via {AI_COLORS[currentAI as keyof typeof AI_COLORS]?.name}
                        </span>
                      )}
                      <span className="text-[10px] text-[#949BA4]">{currentExchange?.timestamp}</span>
                    </div>
                    <div className="text-[#DBDEE1] whitespace-pre-wrap">
                      {displayedResponse}
                      {isTyping && (
                        <span className="inline-flex items-center gap-0.5 ml-1">
                          <span className="w-1 h-1 bg-[#949BA4] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1 h-1 bg-[#949BA4] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1 h-1 bg-[#949BA4] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#57F287] flex items-center justify-center flex-shrink-0">
                    🤖
                  </div>
                  <div className="flex items-center gap-1 text-[#949BA4]">
                    <span className="w-1 h-1 bg-[#949BA4] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-1 bg-[#949BA4] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 bg-[#949BA4] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div className="px-4 pb-6">
          <div className="bg-[#383A40] rounded-lg flex items-center px-4">
            <button className="text-[#B5BAC1] hover:text-gray-300 p-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
              </svg>
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCommandSubmit()}
              placeholder="Message #research"
              className="flex-1 bg-transparent py-3 px-2 text-[#DBDEE1] placeholder-[#6D6F78] outline-none"
            />
            <div className="flex items-center gap-2 text-[#B5BAC1]">
              <button className="hover:text-gray-300 p-1">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              </button>
              <button className="hover:text-gray-300 p-1">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Members sidebar */}
      <div className="w-60 bg-[#2B2D31] p-4 overflow-y-auto hidden lg:block">
        <div className="text-[#949BA4] text-[11px] font-semibold uppercase mb-2">Online — 3</div>
        {MEMBERS.filter(m => m.status !== 'offline').map(member => (
          <div key={member.name} className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-[#35373C] cursor-pointer">
            <div className="relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${member.bot ? 'bg-[#5865F2]' : 'bg-[#5865F2]'}`}>
                {member.avatar}
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#2B2D31] ${STATUS_COLORS[member.status as keyof typeof STATUS_COLORS]}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-white text-sm truncate">{member.name}</span>
                {member.bot && (
                  <span className="px-1.5 py-0.5 bg-[#5865F2]/20 text-[#5865F2] text-[10px] rounded font-medium">BOT</span>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="text-[#949BA4] text-[11px] font-semibold uppercase mb-2 mt-4">Offline — 1</div>
        {MEMBERS.filter(m => m.status === 'offline').map(member => (
          <div key={member.name} className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-[#35373C] cursor-pointer opacity-50">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                {member.avatar}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#2B2D31] bg-gray-500" />
            </div>
            <span className="text-gray-400 text-sm">{member.name}</span>
          </div>
        ))}

        {/* Commands shortcut */}
        <div className="mt-6 p-3 bg-[#232428] rounded">
          <div className="text-[#949BA4] text-[10px] uppercase font-semibold mb-2">Quick Commands</div>
          <div className="space-y-1">
            {MOCK_EXCHANGES.map((exchange, index) => (
              <button
                key={index}
                onClick={() => runExchange(index)}
                className={`w-full text-left px-2 py-1 rounded text-[11px] transition-colors ${
                  selectedExchange === index
                    ? 'bg-[#5865F2] text-white'
                    : 'text-[#949BA4] hover:bg-[#35373C] hover:text-gray-300'
                }`}
              >
                {exchange.command.split(' ').slice(0, 2).join(' ')}...
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
