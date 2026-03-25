const exercises = [
  { name: "Floor Press", id: "0030" },
  { name: "Press Militar", id: "0075" },
  { name: "Flexiones", id: "0662" },
  { name: "Lateral Raise", id: "0334" },
  { name: "Skull Crusher", id: "0391" },
  { name: "Pull up", id: "0851" },
  { name: "Pendlay Row", id: "0064" },
  { name: "One Arm Row", id: "0293" },
  { name: "Face Pull", id: "0759" },
  { name: "Curl", id: "0031" },
  { name: "Back Squat", id: "0022" },
  { name: "Romanian Deadlift", id: "0069" },
  { name: "Bulgarian Split Squat", id: "0403" },
  { name: "KB Swing", id: "0518" },
  { name: "Calf Raise", id: "0441" },
  { name: "Push Press", id: "0072" },
  { name: "Chin up", id: "0211" },
  { name: "Dip", id: "0683" },
  { name: "Inverted Row", id: "0507" },
  { name: "Hammer Curl", id: "0313" },
  { name: "Front Squat", id: "0043" },
  { name: "Walking Lunge", id: "0426" },
  { name: "Goblet Squat", id: "0513" },
  { name: "Hip Thrust", id: "0054" },
  { name: "Single Leg Calf Raise", id: "0417" }
];

async function verifyGifs() {
  for (const ex of exercises) {
    const url = `https://static.exercisedb.dev/media/${ex.id}.gif`;
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.ok) {
        console.log(`✅ OK: ${ex.name} -> ${url}`);
      } else {
        console.log(`❌ FAIL (${res.status}): ${ex.name} -> ${url}`);
      }
    } catch (err) {
      console.log(`⚠️ ERROR: ${ex.name} -> ${url}`);
    }
  }
}

verifyGifs();
