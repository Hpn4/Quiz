const fs = require('fs');
const path = require('path');

// Function to read the file tree
const readDirectoryTree = (dir) => {
  const result = {};

  // Read files and directories in the current directory
  const filesAndDirs = fs.readdirSync(dir);

  // Loop through each item in the directory
  filesAndDirs.forEach((fileOrDir) => {
    const fullPath = path.join(dir, fileOrDir);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // If it's a directory, add it to the result as a key and get its files
      result[fileOrDir] = fs.readdirSync(fullPath).filter(file => file.endsWith('.json'));
    }
  });

  return result;
};

// Function to generate the code from the file tree
const generateCode = (baseDir) => {
  const tree = readDirectoryTree(baseDir);

  let topicsCode = 'const topics = {\n';
  let topicsToQuizCode = 'const topicsToQuiz = {\n';
  let quizCodes = '';

  // First pass: Generate the topics array
  for (const subject in tree) {
    // Add entry to `topics` for each subject (directory)
    topicsCode += `  "${subject}": require('@/assets/content/${subject}/index.json'),\n`;
  }

  topicsCode += '};\n\n'; // Close the topics array

  // Second pass: Generate the quiz arrays (e.g., mathQuiz, physiqueQuiz)
  for (const subject in tree) {
    let quizCode = `const ${subject}Quiz = {\n`;

    tree[subject].forEach((file) => {
      // Add each quiz file to the subject quiz object
      if (file !== 'index.json') { // Skip index.json
        const quizName = path.basename(file, '.json');
        quizCode += `  "${quizName}": require('@/assets/content/${subject}/${file}'),\n`;
      }
    });

    quizCode += '};\n\n'; // Close the quiz array
    quizCodes += quizCode;
  }

  // Third pass: Generate the topicsToQuiz array
  for (const subject in tree) {
    topicsToQuizCode += `  "${subject}": ${subject}Quiz,\n`;
  }

  topicsToQuizCode += '};\n\n'; // Close the topicsToQuiz object

  // Combine all code
  return topicsCode + quizCodes + topicsToQuizCode + `export function getTopics() : Topic[]
{
  return Object.values(topics);
}

export function getTopic(slug: string) : Topic
{
  return topics[slug];
}

export function getQuizs(topic_slug: string) : Quiz[]
{
  return Object.values(topicsToQuiz[topic_slug]);
}

export function getQuiz(topic_slug: string, quiz_slug: string) : Quiz
{
  return topicsToQuiz[topic_slug][quiz_slug];
}`;
};

// Call the function to generate the code
const baseDir = path.resolve(__dirname, '../assets/content'); // Replace this path with where your folders are
const generatedCode = generateCode(baseDir);

// Write the generated code to a file
fs.writeFileSync(path.join(__dirname, '../types/Data.tsx'), generatedCode);

console.log("The code has been generated in the 'generatedCode.js' file");
