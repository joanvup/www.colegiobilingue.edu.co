import fs from "fs";
import path from "path";

const galleryDir = path.join(process.cwd(), "src", "assets", "gallery");
const distDir = path.join(process.cwd(), "dist");

// Robust recursive copy helper
function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(source)) return;

  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(source);
  for (const file of files) {
    const curSource = path.join(source, file);
    const curTarget = path.join(target, file);
    if (fs.lstatSync(curSource).isDirectory()) {
      copyFolderRecursiveSync(curSource, curTarget);
    } else {
      fs.copyFileSync(curSource, curTarget);
    }
  }
}

function generate() {
  // 1. First, copy src/assets to dist/src/assets so that images are available in the build output
  const srcAssetsDir = path.join(process.cwd(), "src", "assets");
  const destAssetsDir = path.join(distDir, "src", "assets");
  console.log(`Copying ${srcAssetsDir} to ${destAssetsDir}...`);
  try {
    copyFolderRecursiveSync(srcAssetsDir, destAssetsDir);
    console.log("Assets copied successfully to dist/src/assets!");
  } catch (err) {
    console.error("Error copying assets:", err);
  }

  if (!fs.existsSync(galleryDir)) {
    console.log("No gallery directory found at", galleryDir);
    return;
  }

  const albums = [];
  const files = fs.readdirSync(galleryDir, { withFileTypes: true });

  for (const file of files) {
    if (file.isDirectory()) {
      const albumName = file.name;
      const albumPath = path.join(galleryDir, albumName);
      
      const subfolders = [];
      const flatImages = [];
      const albumContents = fs.readdirSync(albumPath, { withFileTypes: true });
      
      // Separate files and subfolders
      for (const entry of albumContents) {
        if (entry.isDirectory()) {
          const subfolderName = entry.name;
          const subfolderPath = path.join(albumPath, subfolderName);
          const subfolderFiles = fs.readdirSync(subfolderPath);
          
          const images = subfolderFiles
            .filter(f => {
              const ext = path.extname(f).toLowerCase();
              return [".jpg", ".jpeg", ".png", ".svg", ".webp", ".gif"].includes(ext);
            })
            .map(f => `/src/assets/gallery/${encodeURIComponent(albumName)}/${encodeURIComponent(subfolderName)}/${encodeURIComponent(f)}`);
            
          if (images.length > 0) {
            subfolders.push({
              name: subfolderName,
              images: images
            });
            flatImages.push(...images);
          }
        } else {
          // Direct file under the album
          const ext = path.extname(entry.name).toLowerCase();
          if ([".jpg", ".jpeg", ".png", ".svg", ".webp", ".gif"].includes(ext)) {
            flatImages.push(`/src/assets/gallery/${encodeURIComponent(albumName)}/${encodeURIComponent(entry.name)}`);
          }
        }
      }
      
      // If there are direct images, put them in a "General" virtual subfolder
      const directImages = albumContents
        .filter(entry => !entry.isDirectory() && [".jpg", ".jpeg", ".png", ".svg", ".webp", ".gif"].includes(path.extname(entry.name).toLowerCase()))
        .map(entry => `/src/assets/gallery/${encodeURIComponent(albumName)}/${encodeURIComponent(entry.name)}`);
        
      if (directImages.length > 0) {
        subfolders.unshift({
          name: "General",
          images: directImages
        });
      }

      // Sort subfolders (e.g. months/dates)
      subfolders.sort((a, b) => a.name.localeCompare(b.name));

      if (flatImages.length > 0) {
        albums.push({
          id: albumName.toLowerCase().replace(/\s+/g, "-"),
          name: albumName,
          subfolders: subfolders,
          images: flatImages
        });
      }
    }
  }

  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Write to dist/gallery.json
  fs.writeFileSync(path.join(distDir, "gallery.json"), JSON.stringify(albums, null, 2));
  console.log("Generated dist/gallery.json successfully!");

  // Also write to public/gallery.json so it's available as fallback
  const publicDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.writeFileSync(path.join(publicDir, "gallery.json"), JSON.stringify(albums, null, 2));
  console.log("Generated public/gallery.json successfully!");
}

generate();

