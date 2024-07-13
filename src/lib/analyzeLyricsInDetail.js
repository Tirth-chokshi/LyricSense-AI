import natural from 'natural';

const tokenizer = new natural.WordTokenizer();
const language = "EN"
const defaultCategory = 'N';
const defaultCategoryCapitalized = 'NNP';

const lexicon = new natural.Lexicon(language, defaultCategory, defaultCategoryCapitalized);
const ruleSet = new natural.RuleSet('EN');
const tagger = new natural.BrillPOSTagger(lexicon, ruleSet);

export default async function analyzeLyricsInDetail(lyrics) {
  try {
    const lines = lyrics.split('\n');
    const analyzedLines = lines.map(line => {
      const words = tokenizer.tokenize(line);
      let taggedWords;
      try {
        taggedWords = tagger.tag(words).taggedWords;
      } catch (error) {
        console.error('Error tagging words:', error);
        taggedWords = words.map(word => ({ token: word, tag: 'Unknown' }));
      }
      return {
        line,
        words: taggedWords.map(word => ({
          text: word.token || word,
          pos: word.tag || 'Unknown'
        }))
      };
    });

    return analyzedLines;
  } catch (error) {
    console.error('Error in analyzeLyricsInDetail:', error);
    return [{ line: "Error analyzing lyrics", words: [] }];
  }
}