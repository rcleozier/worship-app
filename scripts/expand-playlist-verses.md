# Instructions for Expanding Playlist Verses

The playlists currently have single verses that are too short. To fix this:

1. **Update verse references** to include verse ranges (e.g., "John 3:16-21" instead of "John 3:16")
2. **Add more verses** to each track (aim for 3-8 verses per track)
3. **Recalculate estimatedMinutes** based on actual word count

## Example Update

**Before:**
```json
{
  "id": "john-3-16",
  "reference": "John 3:16",
  "estimatedMinutes": 3,
  "verses": [
    {
      "book": "John",
      "chapter": 3,
      "verse": 16,
      "text": "For God so loved the world..."
    }
  ]
}
```

**After:**
```json
{
  "id": "john-3-16-21",
  "reference": "John 3:16-21",
  "estimatedMinutes": 3,
  "verses": [
    {
      "book": "John",
      "chapter": 3,
      "verse": 16,
      "text": "For God so loved the world..."
    },
    {
      "book": "John",
      "chapter": 3,
      "verse": 17,
      "text": "For God sent not his Son..."
    },
    {
      "book": "John",
      "chapter": 3,
      "verse": 18,
      "text": "He that believeth on him..."
    },
    {
      "book": "John",
      "chapter": 3,
      "verse": 19,
      "text": "And this is the condemnation..."
    },
    {
      "book": "John",
      "chapter": 3,
      "verse": 20,
      "text": "For every one that doeth evil..."
    },
    {
      "book": "John",
      "chapter": 3,
      "verse": 21,
      "text": "But he that doeth truth..."
    }
  ]
}
```

## Duration Calculation

Use this formula:
- Count total words in all verses
- Add ~8 words for reference reading
- Divide by 140 (words per minute for TTS)
- Round to nearest 0.5 minute

Example: 200 words = 200/140 = 1.43 minutes ≈ 1.5 minutes

