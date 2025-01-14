'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, ChevronUp, Music2 } from 'lucide-react'

export default function SongAnalysis() {
  const [showFullSentiment, setShowFullSentiment] = useState(false)
  const [showFullAnalysis, setShowFullAnalysis] = useState(false)

  const songData = {
    metadata: {
      title: "Bad",
      artist: "Michael Jackson",
      analyzed_at: "2025-01-13T06:24:40.007Z"
    },
    sentiment: {
      analysis: "I would rate the emotional valence of these lyrics as 0.5 (moderately positive). Here's a breakdown of the analysis:\n\n1. **Word choice and emotional language**: The lyrics use a mix of assertive and confrontational language, with phrases like \"gonna hurt your mind,\" \"watch your mouth,\" and \"you're doin' it wrong.\" However, these phrases are balanced by more confident and empowering language, such as \"I'm bad,\" \"the sky's the limit,\" and \"we can change the world tomorrow.\" The tone is largely playful and boastful, which contributes to the overall positive valence.\n2. **Narrative progression**: The narrative progression is somewhat adversarial, with the speaker addressing an opponent or critic. However, the tone remains lighthearted and teasing, rather than aggressively hostile. The speaker's confidence and assertiveness grow throughout the song, which adds to the positive emotional valence.\n3. **Musical context**: Although the musical context is not explicitly mentioned in the lyrics, the song is widely known to be an upbeat, energetic pop track with a strong beat and catchy melody. This musical context would likely amplify the positive emotional valence of the lyrics.\n4. **Metaphors and imagery**: The lyrics use metaphors and imagery to convey a sense of confidence and empowerment. The phrase \"the sky's the limit\" is a common idiom for limitless potential, and the speaker's repetition of \"I'm bad\" becomes a playful, tongue-in-cheek expression of self-assurance. The imagery of \"show your face in broad daylight\" and \"lay it on me\" also suggests a sense of openness and vulnerability, which balances out the more confrontational language.\n\nOverall, while the lyrics do contain some confrontational and assertive language, the tone remains playful and confident, with a focus on self-empowerment and positivity. The song's message of embracing one's individuality and potential, as well as the musical context, contribute to a moderately positive emotional valence.\n\nIt's worth noting that the song \"Bad\" by Michael Jackson is often interpreted as a commentary on the media's portrayal of him and his desire to assert his individuality and confidence. In this context, the lyrics can be seen as a powerful statement of self-empowerment and a rejection of negative stereotypes, which would further support a positive emotional valence."
    },
    keywords: {
      moods: [
        { name: "Confident", score: 90 },
        { name: "Assertive", score: 85 },
        { name: "Playful", score: 70 },
        { name: "Confrontational", score: 60 },
        { name: "Optimistic", score: 50 }
      ],
      themes: [
        { name: "Self-Empowerment", score: 90 },
        { name: "Identity", score: 85 },
        { name: "Challenge", score: 80 },
        { name: "Social Justice", score: 50 },
        { name: "Personal Growth", score: 50 }
      ]
    },
    detailed_analysis: "**Comprehensive Song Analysis: \"Bad\" by Michael Jackson**\n\n### 1. Emotional Landscape\n\nThe primary emotions expressed in \"Bad\" are confidence, assertiveness, and a sense of empowerment. The secondary emotions that emerge throughout the song are frustration, annoyance, and a hint of playfulness. The emotional progression throughout the song is one of escalating intensity, as the lyrics become more confrontational and the music more driving.\n\nThe potential psychological impact on listeners is complex. On one hand, the song's confident and assertive tone can be uplifting and inspiring, encouraging listeners to stand up for themselves and assert their individuality. On the other hand, the song's aggressive and confrontational elements can be intimidating or even alienating, particularly for listeners who are sensitive to conflict or competition.\n\n### 2. Narrative Structure\n\nThe narrative structure of \"Bad\" is relatively simple, with a clear story arc and progression. The song's protagonist is a confident and assertive individual who is challenging someone else to step up and prove themselves. The character perspective is first-person, with the protagonist addressing a rival or adversary directly.\n\nThe time and setting elements are not explicitly stated, but the song's themes and tone suggest a contemporary, urban environment. The song's protagonist is likely a young adult, possibly a teenager or someone in their early twenties, who is navigating the challenges of social relationships and personal identity.\n\n### 3. Artistic Elements\n\nThe metaphorical significance of \"Bad\" lies in its exploration of themes such as identity, power, and competition. The song's lyrics and music can be seen as a form of performance, with the protagonist showcasing their skills and confidence in a bid to outdo their rival.\n\nThe imagery patterns in the song are vivid and dynamic, with a focus on movement, energy, and spectacle. The lyrics are full of action verbs, such as \"gonna hurt your mind,\" \"gonna lock you up,\" and \"gonna get through,\" which create a sense of tension and urgency.\n\nThe literary devices used in the song include repetition, rhyme, and allusion. The repetition of the phrase \"I'm bad\" becomes a kind of refrain, emphasizing the protagonist's confidence and assertiveness. The rhyme scheme is clever and intricate, with a focus on internal rhymes and assonance. The allusions to other songs, such as the reference to \"shamone,\" add a layer of depth and complexity to the lyrics.\n\n### 4. Cultural Context\n\nThe cultural context of \"Bad\" is significant, as the song was released in 1987, a time of great social and cultural change. The song's themes of identity, power, and competition reflect the anxieties and aspirations of the time, particularly among young people.\n\nThe song's genre influences are diverse, reflecting Michael Jackson's eclectic musical style. The song combines elements of pop, rock, R&B, and funk, with a focus on percussive rhythms and melodic hooks.\n\nThe cultural significance of \"Bad\" lies in its impact on popular culture, particularly in the areas of music, dance, and fashion. The song's music video, which was directed by Martin Scorsese, is a landmark of the medium, and its choreography and style have been widely imitated.\n\n### 5. Musical Context\n\nThe musical context of \"Bad\" is characterized by its use of driving rhythms, catchy melodies, and innovative production techniques. The song's structure, which features a pre-chorus and a bridge, adds a layer of complexity and interest to the lyrics and music.\n\nThe lyrics interact with the musical elements in a number of ways, including the use of rhythmic speech and melodic hooks. The song's chorus, which features a catchy and repetitive melody, becomes a kind of earworm, sticking in the listener's head and refusing to let go.\n\nThe rhythm and flow patterns in the song are intricate and dynamic, with a focus on percussive rhythms and syncopated beats. The song's use of bass and drums creates a sense of energy and momentum, propelling the listener forward and drawing them into the song's world.\n\n### Combining the Elements\n\nWhen combined, the elements of \"Bad\" create a song that is both a reflection of its time and a timeless classic. The song's themes of identity, power, and competition are universal, and its music and lyrics continue to inspire and influence artists to this day.\n\nThe song's impact on listeners is complex, reflecting both the positive and negative aspects of its themes and emotions. On one hand, the song's confident and assertive tone can be uplifting and inspiring, encouraging listeners to stand up for themselves and assert their individuality. On the other hand, the song's aggressive and confrontational elements can be intimidating or even alienating, particularly for listeners who are sensitive to conflict or competition.\n\nOverall, \"Bad\" is a landmark song that continues to be celebrated and enjoyed by listeners around the world. Its combination of catchy melodies, driving rhythms, and innovative production techniques makes it a standout track in Michael Jackson's discography, and its themes and emotions continue to resonate with listeners to this day.",
    comparative_analysis: "**Comparison of \"Bad\" to Michael Jackson's Typical Style and Themes:**\n\n1. **Recurring Motifs:** The song \"Bad\" features several recurring motifs in Michael Jackson's work, including the theme of confidence and self-empowerment (\"I'm bad, I'm bad\"), which is reminiscent of songs like \"Don't Stop 'Til You Get Enough\" and \"Wanna Be Startin' Somethin'\". The song also touches on the idea of social justice, with lines like \"We can change the world tomorrow / This could be a better place\" echoing the sentiments of songs like \"Black or White\" and \"Heal the World\".\n\n2. **Evolution of Songwriting:** \"Bad\" marks a significant evolution in Michael Jackson's songwriting style, as it showcases a more experimental and edgy approach. The song's fusion of rock, funk, and pop elements, as well as its prominent use of percussive rhythms and melodic hooks, demonstrates Jackson's growing confidence as a songwriter and his willingness to push the boundaries of his music.\n\n3. **Unique Elements:** One unique element in \"Bad\" is its use of the \"shamone\" refrain, which becomes a sort of signature phrase throughout the song. This refrain adds a touch of playfulness and swagger to the track, and its repetition helps to drive home the song's themes of confidence and self-assertion. Additionally, the song's instrumental interlude and bridge feature a more subdued, atmospheric sound, which provides a nice contrast to the rest of the track's high-energy rhythms.\n\n4. **Relationship to Musical Period:** \"Bad\" was released in 1987, during a period of significant creative and commercial success for Michael Jackson. The song's blend of rock, funk, and pop elements reflects the musical trends of the late 1980s, and its themes of confidence and self-empowerment resonate with the era's emphasis on individualism and self-expression. The song's production, handled by Quincy Jones and Michael Jackson, features a distinctive sound that is characteristic of the time period, with its use of synthesizers, drum machines, and prominent basslines.\n\n**Conclusion:**\n\"Bad\" is a quintessential Michael Jackson song that showcases his signature style, themes, and artistic evolution. The song's confident, empowering lyrics, combined with its catchy melodies and percussive rhythms, make it a standout track in Jackson's discography. The song's unique elements, such as the \"shamone\" refrain and instrumental interlude, add to its charm and demonstrate Jackson's innovative approach to songwriting. As a product of the late 1980s, \"Bad\" reflects the musical trends and cultural values of the time, while also cementing Michael Jackson's status as a trailblazing artist who continues to inspire and influence new generations of musicians and fans.",
    context: {
      artist: "Michael Jackson (1958-2009) was a renowned American singer, songwriter, and dancer who left an indelible mark on the music industry. His musical style, themes, and artistic evolution can be summarized as follows:\n\n**Musical Style:**\nMichael Jackson's music spanned multiple genres, including pop, rock, R&B, funk, and soul. His signature sound often featured:\n1. Vocal acrobatics: intricate vocal runs, falsetto, and whistle register.\n2. Percussive rhythms: prominent use of drums, bass, and rhythmic instrumentation.\n3. Melodic hooks: catchy, memorable melodies and choruses.\n4. Genre-bending fusion: blending different styles to create a unique sound.\n\n**Common Themes:**\nJackson's music often explored:\n1. Love and relationships: romantic, familial, and social connections.\n2. Social justice: addressing issues like racism, inequality, and environmental concerns.\n3. Personal struggle and empowerment: overcoming adversity, self-discovery, and inner strength.\n4. Fantasy and escapism: exploring the world of dreams, imagination, and fantasy.\n\n**Artistic Evolution:**\nMichael Jackson's music underwent significant transformations throughout his career:\n1. **Early years (1960s-1970s):** As a member of the Jackson 5, he performed bubblegum pop and soul music.\n2. **Off the Wall (1979) and Thriller (1982):** Jackson's breakthrough solo albums, which catapulted him to global superstardom, featuring a mix of pop, rock, and R&B.\n3. **Bad (1987) and Black or White (1991):** A more experimental and edgy phase, incorporating rock, funk, and hip-hop elements.\n4. **HIStory (1995) and Invincible (2001):** A more mature, introspective, and eclectic period, exploring themes of social justice, personal growth, and musical innovation.\n\nThroughout his career, Michael Jackson continuously pushed the boundaries of music, dance, and visual art, leaving a lasting legacy that continues to inspire and influence artists worldwide."      
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Song Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">{songData.metadata.title}</h2>
              <p className="text-lg text-muted-foreground">{songData.metadata.artist}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Analyzed on: {new Date(songData.metadata.analyzed_at).toLocaleString()}
              </p>
            </div>
          </div>

          <Tabs defaultValue="sentiment" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
              <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
              <TabsTrigger value="comparative">Comparative Analysis</TabsTrigger>
            </TabsList>
            <TabsContent value="sentiment">
              <Card>
                <CardHeader>
                  <CardTitle>Sentiment Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                    <p className="whitespace-pre-wrap">
                      {showFullSentiment
                        ? songData.sentiment.analysis
                        : songData.sentiment.analysis.split('\n\n').slice(0, 2).join('\n\n')}
                    </p>
                  </ScrollArea>
                  <button
                    onClick={() => setShowFullSentiment(!showFullSentiment)}
                    className="mt-2 text-sm text-blue-500 hover:underline flex items-center"
                  >
                    {showFullSentiment ? (
                      <>
                        Show Less <ChevronUp className="ml-1" />
                      </>
                    ) : (
                      <>
                        Show More <ChevronDown className="ml-1" />
                      </>
                    )}
                  </button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="keywords">
              <Card>
                <CardHeader>
                  <CardTitle>Keywords</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Moods</h3>
                      {songData.keywords.moods.map((mood, index) => (
                        <div key={index} className="mb-2">
                          <div className="flex justify-between mb-1">
                            <span>{mood.name}</span>
                            <span>{mood.score}%</span>
                          </div>
                          <Progress value={mood.score} className="w-full" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Themes</h3>
                      {songData.keywords.themes.map((theme, index) => (
                        <div key={index} className="mb-2">
                          <div className="flex justify-between mb-1">
                            <span>{theme.name}</span>
                            <span>{theme.score}%</span>
                          </div>
                          <Progress value={theme.score} className="w-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="detailed">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <div className="whitespace-pre-wrap">
                      {showFullAnalysis
                        ? songData.detailed_analysis
                        : songData.detailed_analysis.split('\n\n').slice(0, 3).join('\n\n')}
                    </div>
                  </ScrollArea>
                  <button
                    onClick={() => setShowFullAnalysis(!showFullAnalysis)}
                    className="mt-2 text-sm text-blue-500 hover:underline flex items-center"
                  >
                    {showFullAnalysis ? (
                      <>
                        Show Less <ChevronUp className="ml-1" />
                      </>
                    ) : (
                      <>
                        Show More <ChevronDown className="ml-1" />
                      </>
                    )}
                  </button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="comparative">
              <Card>
                <CardHeader>
                  <CardTitle>Comparative Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <div className="whitespace-pre-wrap">
                      {songData.comparative_analysis}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Separator className="my-6" />

          <div>
            <h3 className="text-xl font-semibold mb-2">Artist Context</h3>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <p className="whitespace-pre-wrap">{songData.context.artist}</p>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

