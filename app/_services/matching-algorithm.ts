import { DuAn, HoSoTester } from './data-service'

// Helper to normalize and tokenize text into a Set of unique keywords
function extractKeywords(text: string): Set<string> {
  if (!text) return new Set()

  // 1. Lowercase
  let normalized = text.toLowerCase()

  // 2. Normalize Synonyms (Expand this list as needed)
  const synonyms: Record<string, string> = {
    pc: 'desktop',
    laptop: 'desktop', // Sometimes treated loosely, but let's keep separate usually. User asked for PC vs Desktop
    'máy tính': 'desktop',
    'điện thoại': 'mobile',
    smartphone: 'mobile',
    iphone: 'ios',
    ipad: 'ios',
    'android phone': 'android'
  }

  // Simple synonym replacement
  Object.entries(synonyms).forEach(([key, value]) => {
    // Replace whole words only
    const regex = new RegExp(`\\b${key}\\b`, 'g')
    normalized = normalized.replace(regex, value)
  })

  // 3. Remove Special Characters except alphanumeric and single whitespace
  normalized = normalized.replace(
    /[^\w\sđêăâôơưàáạảãèéẹẻẽìíịỉĩòóọỏõùúụủũỳýỵỷỹ]/g,
    ' '
  )

  // 4. Split by whitespace
  const tokens = normalized.split(/\s+/).filter(t => t.length > 1) // Ignore single chars

  return new Set(tokens)
}

function calculateJaccardSimilarity(
  setA: Set<string>,
  setB: Set<string>
): number {
  if (setA.size === 0 || setB.size === 0) return 0

  let intersection = 0
  setA.forEach(token => {
    if (setB.has(token)) intersection++
  })

  const union = setA.size + setB.size - intersection
  return intersection / union
}

export type TesterProfileExtended = HoSoTester & {
  gioiThieu?: string
}

export function calculateMatchScore(
  testerProfile: TesterProfileExtended | null,
  project: DuAn
): number {
  if (!testerProfile) return 0

  let score = 0

  // ---------------------------------------------------------
  // 1. DEVICE MATCHING (60% Weight)
  // Improved with Synonym Normalization
  // ---------------------------------------------------------

  const envReqs = project.yeuCauMoiTruong as any
  let requiredDevices: string[] = []

  if (Array.isArray(envReqs?.devices)) {
    requiredDevices = envReqs.devices
  } else if (typeof envReqs?.devices === 'string') {
    requiredDevices = envReqs.devices.split(',').map((d: string) => d.trim())
  }

  let deviceMatchScore = 0

  if (requiredDevices.length === 0) {
    deviceMatchScore = 60
  } else {
    const testerDevicesInfo = testerProfile.thongTinThietBi as any
    const userDevices = Array.isArray(testerDevicesInfo?.devices)
      ? testerDevicesInfo.devices
      : []

    // Normalize tester devices specifically for checking
    const userDeviceTokens = new Set<string>()
    userDevices.forEach((d: any) => {
      const str = typeof d === 'string' ? d : JSON.stringify(d)
      // Extract keywords from each device string (e.g. "Asus Tuf Dash F15" -> asus, tuf, dash, f15, desktop, laptop...)
      // We also manually map "type": "desktop" from the JSON to our normalized keywords
      extractKeywords(str).forEach(k => userDeviceTokens.add(k))

      // Explicitly format known fields if object
      if (typeof d === 'object') {
        if (d.type)
          extractKeywords(d.type).forEach(k => userDeviceTokens.add(k))
        if (d.category)
          extractKeywords(d.category).forEach(k => userDeviceTokens.add(k))
        if (d.os) extractKeywords(d.os).forEach(k => userDeviceTokens.add(k))
      }
    })

    let matchedCount = 0
    requiredDevices.forEach(req => {
      // Normalize requirement too (e.g. "PC" -> "desktop")
      const reqKeywords = extractKeywords(req)

      // Check intersection size
      let hasMatch = false
      for (const k of reqKeywords) {
        if (userDeviceTokens.has(k)) {
          hasMatch = true
          break
        }
      }

      if (hasMatch) matchedCount++
    })

    if (matchedCount > 0) {
      const matchRatio = Math.min(matchedCount / requiredDevices.length, 1)
      deviceMatchScore = 60 * matchRatio
    }
  }

  score += deviceMatchScore

  // ---------------------------------------------------------
  // 2. SKILL / DOMAIN VECTOR MATCHING (40% Weight)
  // "Giả lập Vector" using Keyword Extraction & Coverage
  // ---------------------------------------------------------

  // A. Construct Project Vector (Document)
  const projectDoc = [
    project.tieuDe,
    project.moTa,
    typeof project.phamViTest === 'string'
      ? project.phamViTest
      : JSON.stringify(project.phamViTest || '')
  ].join(' ')

  const projectVector = extractKeywords(projectDoc)

  // B. Construct Tester Vector (Query)
  const testerDoc = [
    JSON.stringify(testerProfile.thongTinKiemThu || ''),
    testerProfile.ngonNguChinh,
    JSON.stringify(testerProfile.ngonNguKhac || ''),
    testerProfile.gioiThieu || '', // Added gioiThieu
    testerProfile.soNamKinhNghiem
      ? `${testerProfile.soNamKinhNghiem} năm experience`
      : ''
  ].join(' ')

  const testerVector = extractKeywords(testerDoc)

  // C. Calculate Similarity
  if (projectVector.size === 0) {
    score += 20 // Neutral
  } else {
    let coveredKeywords = 0
    projectVector.forEach(k => {
      if (testerVector.has(k)) coveredKeywords++
    })

    const coverageRatio = coveredKeywords / projectVector.size

    // Bonus weighting: rarer keywords should matter more, but we don't have IDF.
    // Boost the ratio slightly to be generous as pure token matching is strict
    const skillMatchScore = Math.min(coverageRatio * 2.0, 1) * 40

    score += skillMatchScore
  }

  return Math.min(Math.round(score), 100)
}
