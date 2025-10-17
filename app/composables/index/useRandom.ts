export function useRandom() {
  const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
  const emojis = ['🎯','🚀','✨','🧩','🎲','🎉','🔥','🌈','🍀','🧠'] as const
  const colors = ['#ef4444','#f59e0b','#10b981','#3b82f6','#8b5cf6'] as const
  const emoji = () => emojis[Math.floor(Math.random() * emojis.length)] ?? '❓'
  const color = () => colors[Math.floor(Math.random() * colors.length)] ?? '#000000'
  return { randomInt, emoji, color }
}
