# API Key Setup Guide

## For Development (Local Testing)

### Option 1: Use the App Interface (Recommended)
1. Open the app in your browser
2. On the login screen, you'll see an "API Keys Setup" section
3. Enter your OpenAI API key in the input field
4. Click "Save API Key"
5. The key will be stored securely in your browser's localStorage

### Option 2: Create .env.local file
1. Create a file named `.env.local` in your project root
2. Add your API keys:
   ```
   OPENAI_API_KEY=your-actual-openai-api-key-here
   ASSEMBLYAI_API_KEY=your-actual-assemblyai-api-key-here
   ```
3. Restart your development server

## For Production (Vercel Deployment)

### Setting Environment Variables in Vercel:
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key
   - **Environment**: Production (and Preview if needed)
4. Add AssemblyAI key if needed:
   - **Name**: `ASSEMBLYAI_API_KEY`
   - **Value**: Your AssemblyAI API key
   - **Environment**: Production (and Preview if needed)
5. Click "Save"
6. Redeploy your project

## Getting API Keys

### OpenAI API Key:
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (it starts with `sk-`)
5. Store it securely

### AssemblyAI API Key (Optional):
1. Go to [AssemblyAI](https://www.assemblyai.com/)
2. Sign up for an account
3. Get your API key from the dashboard
4. Store it securely

## Security Notes

- ✅ API keys are stored in localStorage for development (browser-only)
- ✅ Environment variables are used for production
- ✅ The `.env.local` file is ignored by Git
- ✅ Never commit API keys to version control
- ✅ API keys are encrypted in transit

## Testing

After setting up your API key:
1. Sign in to the app
2. Go to "The Lounge"
3. Click "Test Conversation" to hear the improved voice
4. Check the browser console to see which voice system is being used 