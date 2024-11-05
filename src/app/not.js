const fs = require("fs");
const path = require("path");

async function generateSitemap() {
    await fetch(`https://quizzet-be.onrender.com/api/admin/suboutline`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            // Chuyển đổi dữ liệu thành định dạng XML cho sitemap
            const urls = data
                .map(
                    (post) => `
  <url>
    <loc>https://www.trongan.site/decuong/${post.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
`
                )
                .join("");

            // Các URL cố định
            const staticUrls = `
  <url>
    <loc>https://www.trongan.site</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.trongan.site/chude</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
`;

            const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls}
  ${urls}
</urlset>`;

            // Đường dẫn đến file sitemap.xml trong thư mục public
            const filePath = path.join(process.cwd(), "public", "sitemap.xml");

            // Ghi file sitemap.xml
            fs.writeFileSync(filePath, sitemap, "utf8");

            console.log(`Sitemap generated and saved to ${filePath}`);
        });
}

generateSitemap();
