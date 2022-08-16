import { NextResponse, NextRequest } from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

export default async function handler(req: NextRequest, res: NextResponse) {
  const decoder = new TextDecoder()

  const RESOURCE_URL =
    'https://gist.githubusercontent.com/okbel/8ba642143f6912548df2d79f2c0ebabe/raw/4bcf9dc5750b42fa225cf6571d6aaa68c23a73aa/README.md'

  const r = await fetch(RESOURCE_URL)
  const transformedStream = r.body?.pipeThrough(
    new TransformStream({
      start: (controller) => {
        controller.enqueue(
          `<html><head><title>Vercel Edge Functions + Streams + Transforms</title></head><body>`
        )
        controller.enqueue(`Resource: ${RESOURCE_URL} <br/>`)
        controller.enqueue(`<hr/><br/><br/><br/>`)
      },
      transform: (chunk, ctrl) => {
        ctrl.enqueue(decoder.decode(chunk).toUpperCase().concat('   <---'))
      },
    })
  )

  return new Response(transformedStream, {
    headers: { 'Content-Type': 'text/html' },
  })
}
