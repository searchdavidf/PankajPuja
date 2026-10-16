import {mkdir,cp,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist');
for(const file of ['index.html','styles.css','app.js','songs.json','sw.js','manifest.webmanifest','assets'])await cp(file,`dist/${file}`,{recursive:true});
console.log('Static website built in dist/');
