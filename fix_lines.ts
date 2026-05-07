import fs from 'fs';
const content = fs.readFileSync('src/pages/NexusDF.tsx', 'utf8');
const lines = content.split('\n');

// Localizar a área corrompida baseada no último view_file
// 891:                              </select>
// 892:                           </div>
// 893:                        ))}
// 894:                     </div>
// 895:                  </div>
// 896:                
// 897:                <div className="flex justify-end pt-4">

const startLine = 890; // lines[890] is 891
const endLine = 896; 

const replacement = [
    '                              </select>',
    '                           </div>',
    '                        ))}',
    '                     </div>',
    '                  </div>',
    '               </div>',
    '',
    '               <div className="flex justify-end pt-4">'
];

lines.splice(startLine, (endLine - startLine) + 1, ...replacement);

fs.writeFileSync('src/pages/NexusDF.tsx', lines.join('\n'));
console.log('Fixed JSX lines 891-897');
