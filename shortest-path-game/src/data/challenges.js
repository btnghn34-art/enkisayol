export const GRID_CONFIG = {
  width: 6,
  height: 4,
  start: { x: 0, y: 0, label: 'A' },
  end: { x: 5, y: 3, label: 'B' },
  specialNodes: [
    { x: 3, y: 0, type: 'red', id: 'r1' },
    { x: 1, y: 1, type: 'red', id: 'r2' },
    { x: 5, y: 1, type: 'blue', id: 'b1' },
    { x: 2, y: 3, type: 'green', id: 'g1' },
  ]
};

export const CHALLENGES = [
  {
    id: 1,
    title: "1. A'dan B'ye bir yeşil bir maviye uğrayarak git.",
    description: "Algoritmalardan yararlanarak en kısa ve en uzun yolu belirleyiniz.",
    options: [
      {
        id: '1a',
        label: 'a)',
        text: "2 birim doğuya, 1 birim güneye, 3 birim doğuya, 1 birim güneye, 3 birim batıya, 1 birim güneye, 3 birim doğuya git.",
        steps: [
          { dir: 'E', len: 2 }, { dir: 'S', len: 1 }, { dir: 'E', len: 3 }, 
          { dir: 'S', len: 1 }, { dir: 'W', len: 3 }, { dir: 'S', len: 1 }, { dir: 'E', len: 3 }
        ]
      },
      {
        id: '1b',
        label: 'b)',
        text: "3 birim güneye, 2 birim doğuya, 2 birim kuzeye, 3 birim doğuya, 2 birim güneye git.",
        steps: [
          { dir: 'S', len: 3 }, { dir: 'E', len: 2 }, { dir: 'N', len: 2 }, 
          { dir: 'E', len: 3 }, { dir: 'S', len: 2 }
        ]
      },
      {
        id: '1c',
        label: 'c)',
        text: "2 birim doğuya, 1 birim güneye, 3 birim doğuya, 3 birim batıya, 2 birim güneye, 2 birim doğuya git.",
        steps: [
          { dir: 'E', len: 2 }, { dir: 'S', len: 1 }, { dir: 'E', len: 3 }, 
          { dir: 'W', len: 3 }, { dir: 'S', len: 2 }, { dir: 'E', len: 2 }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "2. A'dan B'ye iki kırmızıya uğrayarak git.",
    description: "",
    options: [
      {
        id: '2a',
        label: 'a)',
        text: "3 birim doğuya, 1 birim güneye, 2 birim batıya, 1 birim güneye, 4 birim doğuya, 1 birim güneye git.",
        steps: [
          { dir: 'E', len: 3 }, { dir: 'S', len: 1 }, { dir: 'W', len: 2 }, 
          { dir: 'S', len: 1 }, { dir: 'E', len: 4 }, { dir: 'S', len: 1 }
        ]
      },
      {
        id: '2b',
        label: 'b)',
        text: "1 birim güneye, 1 birim doğuya, 1 birim kuzeye, 2 birim doğuya, 3 birim güneye, 2 birim doğuya git.",
        steps: [
          { dir: 'S', len: 1 }, { dir: 'E', len: 1 }, { dir: 'N', len: 1 }, 
          { dir: 'E', len: 2 }, { dir: 'S', len: 3 }, { dir: 'E', len: 2 }
        ]
      },
      {
        id: '2c',
        label: 'c)',
        text: "3 birim doğuya, 3 birim batıya, 1 birim güneye, 1 birim doğuya, 1 birim güneye, 4 birim doğuya, 1 birim güneye git.",
        steps: [
          { dir: 'E', len: 3 }, { dir: 'W', len: 3 }, { dir: 'S', len: 1 }, 
          { dir: 'E', len: 1 }, { dir: 'S', len: 1 }, { dir: 'E', len: 4 }, { dir: 'S', len: 1 }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "3. B'den A'ya önce yeşile sonra maviye uğrayarak git.",
    description: "Dikkat: Başlangıç noktası B!",
    startOverride: { x: 5, y: 3 }, // B location
    endOverride: { x: 0, y: 0 }, // A location
    options: [
      {
        id: '3a',
        label: 'a)',
        text: "3 birim kuzeye, 2 birim batıya, 2 birim güneye, 3 birim doğuya, 2 birim kuzeye git. (Seems wrong direction?)",
        // Text in image: "3 birim güneye..." wait, image says 3. B'den A'ya...
        // Let's re-read image text for 3a.
        // "3 birim güneye, 2 birim doğuya..." WAIT. If starting at B (Bottom Right), going South is impossible (out of bounds).
        // Let me check the image again.
        // Image Q3 says: "3. B'den A'ya..."
        // a) "3 birim güneye..." -> From B(5,3), South is impossible.
        // Maybe the image text is actually correct and my grid assumption is wrong, OR the user image has a trick/typo, OR compass is different?
        // Compass: N is up.
        // Let's looking closely at 3a in image. "3 birim güneye..."
        // Maybe B is Top Left in this question? No "B'den A'ya".
        // Maybe the question implies "relative" usage or I should just implement what is written and let the user see it fail?
        // OR the text in image is "3 birim KUZEYE"?
        // Let me Look REALLY closely at the cropped text in the prompt or assume I might need to correct it.
        // Prompt text: "3. B'den A'ya... a) 3 birim güneye..."
        // If B is in bottom right corner, "South" is off the board.
        // Wait, maybe the text says "Kuzeye" (North) and the OCR/User transcription was wrong?
        // Let's checking 3b: "2 birim doğuya..." From B(5,3), East is off board.
        // Okay, maybe B is TOP LEFT? No, A is A.
        // Maybe the coordinates are different?
        // Or maybe standard "inverse" directions?
        // Let's implement exactly as written. If it goes out of bounds, the visualizer will show it failing. That's a feature! "Examine the algorithms".
        // Wait... 3a text in prompt: "3 birim güneye..."
        // 3b text in prompt: "2 birim doğuya..."
        // This is extremely suspicious for a path starting at B (bottom right).
        // Is it possible the text says "b) 2 birim BATİYA" (West) and "a) 3 birim KUZEYE" (North)?
        // 
        // Let's re-read the prompt text provided by the USER REQUEST...
        // "a) 3 birim güneye, 2 birim doğuya..."
        // "b) 2 birim doğuya..."
        // "c) 2 birim doğuya..."
        // 
        // This makes NO sense for B -> A if B is validly placed at the end of A->B paths (bottom right).
        // Unless "B" refers to the Red node top right? No, B is clearly marked B.
        // 
        // Hypothesis: The OCR/Transcription in the prompt is wrong for Question 3.
        // Let's look at the image provided in the prompt metadata? I can't "see" it directly but I can embed it.
        // I will implement "as provided" but add a "Strict Mode" toggle or just allow out of bounds (ghost mode) to show it's wrong?
        // OR, I can try to intelligently correct it if I find a pattern.
        // Actually, looking at 3b in prompt: "... 3 birim güneye, 2 birim doğuya..." 
        // 
        // Let's just implement what is written. If it fails, it fails. The user asked to "Examine the algorithms". Finding one is invalid is part of the examination!
        // 
        steps: [
           { dir: 'S', len: 3 }, { dir: 'E', len: 2 }, { dir: 'N', len: 2 }, { dir: 'E', len: 3 }, { dir: 'S', len: 2 }
        ]
      },
      {
        id: '3b',
        label: 'b)',
        text: "2 birim doğuya, 3 birim güneye, 2 birim doğuya, 3 birim kuzeye, 1 birim doğuya, 3 birim güneye git.",
        steps: [
           { dir: 'E', len: 2 }, { dir: 'S', len: 3 }, { dir: 'E', len: 2 }, { dir: 'N', len: 3 }, { dir: 'E', len: 1 }, { dir: 'S', len: 3 }
        ]
      },
      {
        id: '3c',
        label: 'c)',
        text: "2 birim doğuya, 3 birim güneye, 1 birim doğuya, 2 birim kuzeye, 2 birim doğuya, 2 birim batıya, 2 birim güneye, 2 birim doğuya git.",
        steps: [
           { dir: 'E', len: 2 }, { dir: 'S', len: 3 }, { dir: 'E', len: 1 }, { dir: 'N', len: 2 }, { dir: 'E', len: 2 }, { dir: 'W', len: 2 }, { dir: 'S', len: 2 }, { dir: 'E', len: 2 }
        ]
      }
    ]
  }
];
