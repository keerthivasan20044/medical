import { copy, ensureDir, remove } from 'fs-extra';
import { resolve } from 'path';

async function prep() {
  const root = resolve('.');
  const dist = resolve(root, 'client', 'dist');
  
  console.log('🚀 Prepping Vercel Deployment...');
  
  try {
    // We only copy if dist exists (it should after npm run build --workspace=client)
    console.log('📦 Consolidating client assets to root...');
    await copy(dist, root, {
      overwrite: true,
      filter: (src) => {
        // Don't copy the dist folder itself or node_modules
        return !src.includes('node_modules');
      }
    });
    console.log('✅ Assets consolidated.');
  } catch (err) {
    console.error('❌ Prep failed:', err);
    process.exit(1);
  }
}

prep();
