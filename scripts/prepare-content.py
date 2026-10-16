from pathlib import Path
import re,json
root=Path(__file__).resolve().parents[1]
s=(root/'content/songs-original-hi.txt').read_text()
m=dict(l.split('=',1) for l in (root/'content/transliteration-map.txt').read_text().splitlines() if l)
word=re.compile(r'[\u0900-\u0963\u0970-\u097f]+')
missing=set(word.findall(s))-m.keys()
assert not missing, missing
roman=word.sub(lambda x:m[x[0]],s)
(root/'content/songs-roman.txt').write_text(roman)
lines=s.splitlines()
starts=[i for i,l in enumerate(lines) if l.startswith('॥') or l.startswith('।।देदे') or l.startswith('।। बिगड़ी')]
assert len(starts)==8
songs=[]
for n,a in enumerate(starts):
 b=starts[n+1] if n+1<len(starts) else len(lines)
 block=lines[a:b]
 url=next(re.search(r'https://\S+',l)[0] for l in block if 'https://' in l)
 first=next(i for i,l in enumerate(block) if 'https://' in l)+1
 body='\n'.join(block[first:]).strip('\n')
 title=block[0]
 songs.append(dict(id=n+1,titleHi=title,titleRoman=word.sub(lambda x:m[x[0]],title),hi=body,roman=word.sub(lambda x:m[x[0]],body),instagram=url))
(root/'songs.json').write_text(json.dumps(songs,ensure_ascii=False,indent=2)+'\n')
print('Prepared 8 songs; all source words covered.')
