import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname } from 'path';

const PUBLIC_DIR = './public';
const QUALITY_JPG = 85;
const QUALITY_PNG = 85;

async function getFiles(dir) {
  const files = [];
  const items = await readdir(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...await getFiles(fullPath));
    } else {
      const ext = extname(item.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

async function optimizeImage(filePath) {
  const ext = extname(filePath).toLowerCase();
  const stats = await stat(filePath);
  const originalSize = stats.size;
  
  try {
    let image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Mantener el tamaño original pero optimizar compresión
    if (ext === '.png') {
      await image
        .png({ quality: QUALITY_PNG, compressionLevel: 9 })
        .toFile(filePath + '.tmp');
    } else {
      await image
        .jpeg({ quality: QUALITY_JPG, mozjpeg: true })
        .toFile(filePath + '.tmp');
    }
    
    // Verificar si el archivo optimizado es más pequeño
    const newStats = await stat(filePath + '.tmp');
    const newSize = newStats.size;
    
    if (newSize < originalSize) {
      // Reemplazar con el archivo optimizado
      const { rename, unlink } = await import('fs/promises');
      await unlink(filePath);
      await rename(filePath + '.tmp', filePath);
      
      const saved = ((originalSize - newSize) / originalSize * 100).toFixed(1);
      console.log(`✅ ${filePath}`);
      console.log(`   ${(originalSize / 1024).toFixed(1)}KB → ${(newSize / 1024).toFixed(1)}KB (-${saved}%)`);
      return { original: originalSize, optimized: newSize };
    } else {
      // Mantener el original
      const { unlink } = await import('fs/promises');
      await unlink(filePath + '.tmp');
      console.log(`⏭️  ${filePath} (ya optimizado)`);
      return { original: originalSize, optimized: originalSize };
    }
  } catch (error) {
    console.error(`❌ Error en ${filePath}:`, error.message);
    return { original: originalSize, optimized: originalSize };
  }
}

async function main() {
  console.log('🖼️  Optimizando imágenes...\n');
  
  const files = await getFiles(PUBLIC_DIR);
  console.log(`Encontradas ${files.length} imágenes\n`);
  
  let totalOriginal = 0;
  let totalOptimized = 0;
  
  for (const file of files) {
    const result = await optimizeImage(file);
    totalOriginal += result.original;
    totalOptimized += result.optimized;
  }
  
  console.log('\n📊 Resumen:');
  console.log(`   Total original: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB`);
  console.log(`   Total optimizado: ${(totalOptimized / 1024 / 1024).toFixed(2)}MB`);
  console.log(`   Ahorro: ${((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(2)}MB (${((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(1)}%)`);
}

main().catch(console.error);
