const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * PNG 파일을 WebP로 변환하고 같은 이름의 SVG와 PNG 파일을 삭제하는 스크립트
 * 사용법: node scripts/convert-png-to-webp.js <폴더경로>
 * 예시: node scripts/convert-png-to-webp.js assets/icons/main
 */

function convertPngToWebp(folderPath) {
  try {
    // 폴더 경로 확인
    if (!fs.existsSync(folderPath)) {
      console.error(`❌ 폴더를 찾을 수 없습니다: ${folderPath}`);
      return;
    }

    console.log(`📁 폴더 처리 중: ${folderPath}`);

    // 폴더 내 모든 파일 읽기
    const files = fs.readdirSync(folderPath);

    // PNG 파일 찾기
    const pngFiles = files.filter(file => file.toLowerCase().endsWith('.png'));

    if (pngFiles.length === 0) {
      console.log('ℹ️  변환할 PNG 파일이 없습니다.');
      return;
    }

    console.log(`🔍 발견된 PNG 파일: ${pngFiles.length}개`);

    // 각 PNG 파일에 대해 처리
    pngFiles.forEach(pngFile => {
      const pngPath = path.join(folderPath, pngFile);
      const baseName = path.basename(pngFile, '.png');
      const webpPath = path.join(folderPath, `${baseName}.webp`);
      const svgPath = path.join(folderPath, `${baseName}.svg`);

      console.log(`\n🔄 처리 중: ${pngFile}`);

      try {
        // PNG를 WebP로 변환 (ImageMagick 사용)
        console.log(`  📤 PNG → WebP 변환 중...`);
        execSync(`magick "${pngPath}" "${webpPath}"`, { stdio: 'pipe' });
        console.log(`  ✅ WebP 변환 완료: ${baseName}.webp`);

        // 같은 이름의 SVG 파일이 있는지 확인하고 삭제
        if (fs.existsSync(svgPath)) {
          fs.unlinkSync(svgPath);
          console.log(`  🗑️  SVG 파일 삭제: ${baseName}.svg`);
        }

        // 원본 PNG 파일 삭제
        fs.unlinkSync(pngPath);
        console.log(`  🗑️  PNG 파일 삭제: ${pngFile}`);
      } catch (error) {
        console.error(`  ❌ 오류 발생: ${error.message}`);

        // ImageMagick이 설치되지 않은 경우 안내
        if (error.message.includes('magick')) {
          console.error(`  💡 ImageMagick이 설치되지 않았습니다.`);
          console.error(`  💡 macOS: brew install imagemagick`);
          console.error(`  💡 Ubuntu: sudo apt-get install imagemagick`);
        }
      }
    });

    console.log(`\n🎉 변환 완료! 총 ${pngFiles.length}개 파일 처리됨`);
  } catch (error) {
    console.error(`❌ 스크립트 실행 중 오류 발생:`, error.message);
  }
}

// 명령행 인수 확인
const folderPath = process.argv[2];

if (!folderPath) {
  console.error('❌ 사용법: node scripts/convert-png-to-webp.js <폴더경로>');
  console.error('예시: node scripts/convert-png-to-webp.js assets/icons/main');
  process.exit(1);
}

// 스크립트 실행
convertPngToWebp(folderPath);
