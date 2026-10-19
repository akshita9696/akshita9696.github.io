import AppKit

// Usage: swift align-check.swift <reference> <image>...
// Prints how different each image is from the reference outside the head area
// (average colour difference, 0 = identical). Low numbers mean the images line up.
func pixels(_ path: String) -> (data: [UInt8], w: Int, h: Int)? {
  guard let img = NSImage(contentsOfFile: path),
        let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else { return nil }
  let w = cg.width, h = cg.height
  var data = [UInt8](repeating: 0, count: w * h * 4)
  let ctx = CGContext(data: &data, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w * 4,
                      space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
  ctx.draw(cg, in: CGRect(x: 0, y: 0, width: w, height: h))
  return (data, w, h)
}
let args = CommandLine.arguments
guard args.count > 2, let ref = pixels(args[1]) else { exit(1) }
for path in args.dropFirst(2) {
  guard let img = pixels(path), img.w == ref.w, img.h == ref.h else { print("size mismatch", path); continue }
  var total = 0.0, n = 0.0
  // Body and sofa region (laptop, legs, cushions), well away from the head.
  for y in stride(from: Int(Double(ref.h) * 0.40), to: Int(Double(ref.h) * 0.85), by: 3) {
    for x in stride(from: 0, to: Int(Double(ref.w) * 0.62), by: 3) {
      let i = (y * ref.w + x) * 4
      for c in 0..<3 { total += abs(Double(ref.data[i + c]) - Double(img.data[i + c])) }
      n += 3
    }
  }
  print(String(format: "%6.2f  %@", total / n, (path as NSString).lastPathComponent))
}
