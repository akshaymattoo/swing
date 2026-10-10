export const completionMessages = [
  'You showed up. That matters.',
  'You earned every drop of that sweat.',
  'Busy day. Strong finish.',
  'That feeling? You made it.',
  'One workout. A better day.',
  'Momentum looks good on you.',
  'Your future self felt that.',
  'Done is powerful.',
  'Energy earned.',
  'Strength is built on days like this.',
  'You made time for yourself.',
  'Less thinking. More living.',
  'Today, you chose you.',
  'Small window. Big win.',
  'Proof that you can begin.',
  'You moved. You won.',
  'Keep this feeling.',
  'Your reset is complete.',
  'That was time well spent.',
  'You turned intention into action.',
  'One more promise kept.',
  'Strong body. Clear mind.',
  'You did the hard part: starting.',
  'The sweat fades. The win stays.',
  'Showed up. Put in work. Done.',
  'You are leaving stronger.',
  'That is how momentum begins.',
  'A good sweat changes the day.',
  'Take the win with you.',
  'Your body worked. Your mind can breathe.'
] as const;

export function completionMessageIndex(sessionId: string) {
  let hash = 2166136261;
  for (const character of sessionId) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % completionMessages.length;
}

export function completionMessageForSession(sessionId: string) {
  return completionMessages[completionMessageIndex(sessionId)];
}
