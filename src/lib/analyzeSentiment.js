import natural from 'natural';

function analyzeSentiment(lyrics) {
  const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
  const tokenizer = new natural.SentenceTokenizer();
  const sentences = tokenizer.tokenize(lyrics);

  return sentences.map((sentence, index) => ({
    segment: `Segment ${index + 1}`,
    sentiment: analyzer.getSentiment(sentence.split(' '))
  }));
}

export default analyzeSentiment;
