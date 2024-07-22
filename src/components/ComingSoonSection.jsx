"use client"
import { useState } from 'react'

const ComingSoonFeature = ({ title, description }) => (
  <li className="flex items-center space-x-2 p-2 bg-secondary rounded-md shadow-sm transition-all hover:shadow-md">
    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    </div>
    <div>
      <h3 className="font-semibold text-sm">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </li>
)

export const ComingSoonSection = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const features = [
    { title: "Dynamic Song Search", description: "Search for songs dynamically as you type" },
    { title: "Popular Songs", description: "See current popular song's insights" },
    { title: "Emotion Graph", description: "Visualize emotional progression throughout the song" },
    { title: "Word Cloud", description: "See the most prominent words in the lyrics" },
    { title: "Sentiment Timeline", description: "Track sentiment changes across the song" },
    { title: "Rhyme Scheme Analysis", description: "Understand the song's rhyming structure" },
  ]

  const filteredFeatures = features.filter(feature =>
    feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feature.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <section className="bg-card rounded-lg shadow-lg p-4 transition-all hover:shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-card-foreground">Upcoming features...</h2>
      <ul className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        {filteredFeatures.map((feature, index) => (
          <ComingSoonFeature key={index} title={feature.title} description={feature.description} />
        ))}
      </ul>
      {filteredFeatures.length === 0 && (
        <p className="text-center text-muted-foreground mt-4">No features found matching your search.</p>
      )}
    </section>
  )
}