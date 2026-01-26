const fs = require("fs");
const path = require("path");

const rootDir = "d:/work/buildex/images/data classification";
const outputParams = {
  outputFile: "d:/work/buildex/projects_data.js",
  varName: "projectData",
};

// Mapping folder names to IDs and Arabic titles
const categoryMap = {
  "internal design": { id: "interior", title: "التصميم الداخلي" },
  "external design": { id: "exterior", title: "تشطيب خارجي" },
  basic: { id: "furniture", title: "الأثاث" },
  cketchen: { id: "kitchen", title: "المطبخ" },
  "3design": { id: "3dmax", title: "3D Max" },
};

const styleMap = {
  classic: { id: "classic", label: "Classic" },
  كلاسيك: { id: "classic", label: "Classic" },
  modern: { id: "modern", label: "Modern" },
  مودرن: { id: "modern", label: "Modern" },
  "new classic": { id: "newclassic", label: "New Classic" },
  "نيو كلاسيك": { id: "newclassic", label: "New Classic" },
};

function toWebPath(absPath) {
  const rel = path.relative("d:/work/buildex", absPath);
  return rel.split(path.sep).join("/");
}

function getFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).map((file) => path.join(dir, file));
}

function isImage(file) {
  return /\.(jpg|jpeg|png|gif|heic|webp)$/i.test(file);
}

function getAllImages(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllImages(file));
    } else if (isImage(file)) {
      results.push(file);
    }
  });
  return results;
}

function generateData() {
  const projects = [];

  // Level 1: Categories
  const categoryDirs = fs
    .readdirSync(rootDir)
    .filter((f) => fs.statSync(path.join(rootDir, f)).isDirectory());

  categoryDirs.forEach((catDirName) => {
    const catInfo = categoryMap[catDirName.toLowerCase()];
    if (!catInfo) return; // Skip unknown folders

    const catPath = path.join(rootDir, catDirName);

    const styleDirs = fs
      .readdirSync(catPath)
      .filter((f) => fs.statSync(path.join(catPath, f)).isDirectory());

    styleDirs.forEach((styleDirName) => {
      let styleInfo = styleMap[styleDirName.toLowerCase()];

      if (!styleInfo) return;

      const stylePath = path.join(catPath, styleDirName);
      const cardDirs = fs
        .readdirSync(stylePath)
        .filter((f) => fs.statSync(path.join(stylePath, f)).isDirectory());

      cardDirs.forEach((cardDirName) => {
        const cardPath = path.join(stylePath, cardDirName);
        
        // Find ALL images recursively inside the card folder
        const allImagePaths = getAllImages(cardPath);
        
        if (allImagePaths.length === 0) {
          console.warn(`No images found in ${cardPath}, skipping.`);
          return;
        }

        // Find "mena" image for cover (prioritize case-insensitive "mena")
        let coverImgPathFull = allImagePaths.find(p => 
          path.basename(p).toLowerCase().includes("mena")
        );

        // Fallback to first image if no "mena"
        if (!coverImgPathFull) {
          coverImgPathFull = allImagePaths[0];
          console.log(`Using fallback cover ${path.basename(coverImgPathFull)} for ${cardPath}`);
        }

        const coverImgRel = toWebPath(coverImgPathFull);
        const allImgRels = allImagePaths.map(toWebPath);

        // Construct the project object
        projects.push({
          category: catInfo.id,
          style: styleInfo.id,
          title: catInfo.title,
          desc: `${catInfo.title} - ${styleInfo.label}`,
          cover: coverImgRel,
          images: allImgRels,
          styleLabel: styleInfo.label,
          catLabel: catInfo.title,
        });
      });
    });
  });

  const fileContent = `const projectData = ${JSON.stringify(projects, null, 2)};`;

  fs.writeFileSync(outputParams.outputFile, fileContent, "utf8");
  console.log(
    `Successfully generated ${projects.length} projects to ${outputParams.outputFile}`,
  );
}

generateData();
