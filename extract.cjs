const fs = require('fs');
const path = require('path');

const baseDir = 'C:\\Users\\beast\\.gemini\\antigravity\\brain';

const papers = [
  {
    name: 'Predictive Paper',
    files: [
      path.join(baseDir, '6585caad-e468-450e-84cd-652ef3ecbba6', 'answers_predictive_paper_part1.md'),
      path.join(baseDir, '6585caad-e468-450e-84cd-652ef3ecbba6', 'answers_predictive_paper_part2.md')
    ]
  },
  {
    name: 'Winter 2024',
    files: [
      path.join(baseDir, 'f52c5d84-2849-4557-b7a2-9e3221e26d88', 'answers_winter_2024_part1.md'),
      path.join(baseDir, 'f52c5d84-2849-4557-b7a2-9e3221e26d88', 'answers_winter_2024_part2.md')
    ]
  },
  {
    name: 'Summer 2024',
    files: [
      path.join(baseDir, '60bd79ef-363f-4e0f-8097-a7a638fb7d57', 'answers_summer_2024_part1.md'),
      path.join(baseDir, '60bd79ef-363f-4e0f-8097-a7a638fb7d57', 'answers_summer_2024_part2.md')
    ]
  },
  {
    name: 'Summer 2025',
    files: [
      path.join(baseDir, 'ad88e18a-34b1-46bb-ae0e-48b8f0eab289', 'answers_summer_2025_part1.md'),
      path.join(baseDir, 'eb6c0612-f443-4eb4-b871-7998bb2327c6', 'answers_summer_2025_part2.md')
    ]
  }
];

const result = [];

papers.forEach(paper => {
  let paperQuestions = [];
  
  paper.files.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Split by heading 2 (## Q...) or heading 3 (### (a)...)
      // We want to capture the question text and the answer body
      
      const lines = content.split('\n');
      let currentQuestion = null;
      let currentAnswer = [];
      
      const saveQuestion = () => {
        if (currentQuestion) {
          paperQuestions.push({
            question: currentQuestion,
            answer: currentAnswer.join('\n').trim()
          });
        }
      };

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Match ## Q1, ## Q2, etc OR ### (a), ### (b), etc
        if (line.match(/^##\s+Q\d+:/) || line.match(/^##\s+Q\d+\./) || line.match(/^###\s+\([a-z]\)/) || line.match(/^##\s+Q\d+\s/)) {
          saveQuestion();
          
          let qText = line.replace(/^##\s+/, '').replace(/^###\s+/, '').trim();
          
          // Remove marks indication like "(10 Marks)"
          qText = qText.replace(/\(\d+\s*Marks?\)/i, '').trim();
          
          currentQuestion = qText;
          currentAnswer = [];
        } else if (line.match(/^##\s+Q1/)) {
           // Skip the "## Q1: Short Notes" header itself if it just introduces sub-questions
        } else if (line.match(/^---\s*$/)) {
           // Skip horizontal rules between questions
        } else if (line.match(/^#\s+/)) {
           // Skip main title
        } else {
          if (currentQuestion) {
            currentAnswer.push(line);
          }
        }
      }
      saveQuestion();
      
    } else {
      console.warn('File not found:', file);
    }
  });
  
  result.push({
    paper: paper.name,
    questions: paperQuestions
  });
});

const outDir = path.join(__dirname, 'src', 'data');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, 'papers.json'), JSON.stringify(result, null, 2));
console.log('Successfully extracted papers to src/data/papers.json');
