import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** รากแพ็กเกจ backend (โฟลเดอร์ที่มี package.json ของ API) */
export const backendRoot = join(__dirname, '..', '..')

export const uploadsDir = join(backendRoot, 'uploads')
export const avatarsDir = join(uploadsDir, 'avatars')
