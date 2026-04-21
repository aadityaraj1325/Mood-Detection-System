export const emotionColors = {
  Happy: 'var(--emotion-happy)',
  Neutral: 'var(--emotion-neutral)',
  Sad: 'var(--emotion-sad)'
};

export function getEmotionColor(emotion = 'Neutral') {
  return emotionColors[emotion] || emotionColors.Neutral;
}
