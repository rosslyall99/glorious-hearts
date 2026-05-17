# Hearts 2025/26 Tribute Site

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown in Terminal.

## Edit content

Edit match data here:

```text
src/data/matches.json
```

Useful fields to edit:
- `summary`
- `image`
- `tags`
- `youtubeUrl`
- `youtubeId`
- `bbcUrl`

## Add images

Put images here:

```text
public/images/
```

Then reference them in `matches.json`, for example:

```json
"image": "/images/shankland-celtic.jpg"
```
