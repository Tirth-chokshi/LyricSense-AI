import natural from 'natural';
import stopwords from 'stopwords-en';

function generateWordCloudData(lyrics) {
  // Tokenize the lyrics
  const tokenizer = new natural.WordTokenizer();
  const words = tokenizer.tokenize(lyrics.toLowerCase());

  // Remove stopwords and short words
  const filteredWords = words.filter(word => 
    word.length > 2 && !stopwords.includes(word)
  );

  // Count word frequencies
  const wordCounts = {};
  filteredWords.forEach(word => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });

  // Format data for react-wordcloud
  return Object.entries(wordCounts).map(([text, value]) => ({ text, value }));
}

export default generateWordCloudData;
