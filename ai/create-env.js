import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('\n🔧 Creating .env file...\n');

// Prompt for values
console.log('Please provide the following values:');
console.log('(Press Enter to use default values for testing)\n');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const questions = [
  { key: 'PORT', default: '5000', prompt: 'PORT (default: 5000): ' },
  { key: 'MONGODB_URI', default: 'mongodb://localhost:27017/expense-tracker', prompt: 'MONGODB_URI: ' },
  { key: 'JWT_SECRET', default: 'your_jwt_secret_key_minimum_32_characters_long_for_security', prompt: 'JWT_SECRET (min 32 chars): ' },
  { key: 'GOOGLE_CLIENT_ID', default: '', prompt: 'GOOGLE_CLIENT_ID: ' },
  { key: 'GOOGLE_CLIENT_SECRET', default: '', prompt: 'GOOGLE_CLIENT_SECRET: ' },
  { key: 'CLIENT_URL', default: 'http://localhost:5173', prompt: 'CLIENT_URL (default: http://localhost:5173): ' },
  { key: 'NODE_ENV', default: 'development', prompt: 'NODE_ENV (default: development): ' }
];

const answers = {};
let currentIndex = 0;

function askQuestion() {
  if (currentIndex >= questions.length) {
    readline.close();
    createEnvFile();
    return;
  }

  const question = questions[currentIndex];
  readline.question(question.prompt, (answer) => {
    answers[question.key] = answer.trim() || question.default;
    currentIndex++;
    askQuestion();
  });
}

function createEnvFile() {
  const envContent = Object.entries(answers)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const envPath = join(__dirname, '.env');

  try {
    writeFileSync(envPath, envContent, { encoding: 'utf8' });
    console.log('\n✅ .env file created successfully at:', envPath);
    console.log('\nFile contents:');
    console.log('=====================================');
    console.log(envContent);
    console.log('=====================================\n');
    console.log('Now restart your server with: npm run dev\n');
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
    process.exit(1);
  }
}

askQuestion();

