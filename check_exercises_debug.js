const myExercises = [
  "Military Press",
  "Overhead Press",
  "Lateral Raise",
  "Face Pull",
  "Bicep Curl",
  "Back Squat",
  "Bulgarian",
  "KB Swing",
  "Calf Raise",
  "Push Press",
  "Chin up",
  "Hammer Curl"
];

async function fetchRemaining() {
  const allExercises = [];
  let offset = 800;
  const limit = 100;
  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  for (let i = 0; i < 8; i++) { // 800 to 1600
    try {
      const res = await fetch(`https://oss.exercisedb.dev/api/v1/exercises?offset=${offset}&limit=${limit}`);
      const data = await res.json();
      if (!data.data || data.data.length === 0) break;
      allExercises.push(...data.data);
      offset += data.data.length;
      await delay(2000);
    } catch (err) { break; }
  }

  const mapping = {};
  myExercises.forEach(target => {
    const matches = allExercises.filter(ex => ex.name.toLowerCase().includes(target.toLowerCase()));
    if (matches.length > 0) mapping[target] = matches[0].exerciseId;
  });

  console.log(JSON.stringify(mapping, null, 2));
}

fetchRemaining();
