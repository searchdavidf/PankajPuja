import test from 'node:test';import assert from 'node:assert/strict';import{readFileSync}from'node:fs';
const raw=readFileSync('content/songs-original-hi.txt','utf8').replaceAll('\r\n','\n');
const roman=readFileSync('content/songs-roman.txt','utf8');const songs=JSON.parse(readFileSync('songs.json','utf8'));
const words=/[\u0900-\u0963\u0970-\u097f]+|[A-Za-z]+/gu;
const structure=s=>s.replace(words,'');
test('Whole document punctuation, spacing and newlines match',()=>{assert.equal(structure(roman),structure(raw));assert.equal(roman.split('\n').length,raw.split('\n').length)});
test('Eight songs, unique ids and eight distinct Instagram references',()=>{assert.equal(songs.length,8);assert.equal(new Set(songs.map(s=>s.id)).size,8);assert.equal(new Set(songs.map(s=>s.instagram)).size,8);for(const s of songs)assert.equal(new URL(s.instagram).hostname,'www.instagram.com')});
test('Every title and lyric preserves punctuation, spaces and line boundaries',()=>{for(const s of songs){assert.equal(structure(s.hi),structure(s.roman),`Song ${s.id}`);assert.equal(structure(s.titleHi),structure(s.titleRoman));assert.ok(!/[\u0900-\u0963\u0970-\u097f]/u.test(s.roman));assert.ok(raw.includes(s.hi));assert.equal(s.hi.split('\n').length,s.roman.split('\n').length)}});
test('Source extraction includes every lyric line exactly once in order',()=>{const lines=raw.split('\n');const starts=lines.flatMap((l,i)=>(l.startsWith('॥')||l.startsWith('।।देदे')||l.startsWith('।। बिगड़ी'))?[i]:[]);for(let i=0;i<8;i++){const block=lines.slice(starts[i],starts[i+1]??lines.length);const urlLine=block.findIndex(l=>l.includes('https://'));assert.equal(songs[i].titleHi,block[0]);assert.equal(songs[i].hi,block.slice(urlLine+1).join('\n').replace(/^\n+|\n+$/g,''));}});
