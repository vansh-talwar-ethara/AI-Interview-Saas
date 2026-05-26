export async function transcribeAudio(_audioBuffer: Buffer) {
  return { transcript: "Transcription placeholder from voice pipeline." };
}

export async function synthesizeSpeech(text: string) {
  return { audioUrl: `tts://stream/${encodeURIComponent(text.slice(0, 32))}` };
}
