// lib/prisma.js
import { PrismaClient } from '@prisma/client' // ✅ Correct

const prisma = new PrismaClient()
export default prisma