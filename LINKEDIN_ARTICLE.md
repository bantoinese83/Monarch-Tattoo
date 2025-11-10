# Testing Gemini's Maps Grounding API with a Tattoo App

Been playing around with Google's Gemini API lately, specifically their new Maps Grounding feature. Wanted to see how well it could find local businesses based on natural language queries, so I built a quick side project called **Monarch Tattoo**.

## What It Does

It's pretty simple — you upload a photo of where you want a tattoo, get some style suggestions, and then it generates a preview of what it might look like. The fun part (for me at least) is the artist finder feature, which uses Gemini's Maps Grounding to find nearby tattoo shops based on the style you picked.

## The Experiment

The Maps Grounding API is interesting. You give it a prompt like "find tattoo shops near me that specialize in neo-traditional style" and it actually searches Google Maps and returns real places with ratings, reviews, and links. No need to build your own search logic or deal with Places API directly.

I was curious how well it would work with specific queries like tattoo styles, and honestly it's been pretty solid. The API handles the location context, filters by relevance, and gives you structured data back. Way easier than I expected.

## The Stack

Built it with React Native and Expo (because I wanted it to work on my phone). Used Gemini's multimodal capabilities for the image analysis and tattoo generation, then hooked up the Maps Grounding for the artist search. The whole thing came together in a weekend.

## What I Learned

The Maps Grounding feature is surprisingly good at understanding context. When you say "near me" it actually uses the location you provide, and it seems to filter results pretty intelligently. The response includes all the metadata you'd want — names, ratings, review counts, place IDs, and Google Maps links.

Still figuring out the best way to extract coordinates from the responses (they're not always in the URI), but the core functionality works well. The API feels production-ready, though I'm sure there are edge cases I haven't hit yet.

## Why Tattoos?

Honestly? It was just a fun use case. Everyone has thought about getting a tattoo, and visualizing it beforehand is genuinely useful. Plus it gave me a good excuse to test both the image generation and Maps features in one app.

---

**Tech:** React Native, Expo, Gemini API (Maps Grounding + Multimodal)

Anyone else been experimenting with Gemini's new features? Curious what other use cases people are finding for Maps Grounding.

