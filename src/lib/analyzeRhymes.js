import natural from 'natural';

function analyzeRhymes(lyrics) {
  const lines = lyrics.split('\n').filter(line => line.trim() !== '');
  const phonetics = new natural.Metaphone();
  const rhymeGroups = {};
  let currentGroup = 0;

  return lines.map((line, index) => {
    const words = line.trim().split(' ');
    const lastWord = words[words.length - 1].replace(/[^a-zA-Z]/g, '').toLowerCase();
    const phoneticRep = phonetics.process(lastWord);

    if (!rhymeGroups[phoneticRep]) {
      rhymeGroups[phoneticRep] = currentGroup++;
    }

    return {
      text: line,
      rhymeGroup: rhymeGroups[phoneticRep]
    };
  });
}

export default analyzeRhymes;
