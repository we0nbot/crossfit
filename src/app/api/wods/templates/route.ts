import { NextResponse } from "next/server";

/**
 * WOD Templates API - Catálogo maestro de Hero y Girl WODs.
 * Proporciona configuraciones técnicas precargadas para agilizar la programación del Box.
 */
export async function GET() {
  const templates = [
    // --- CATEGORÍA: HERO WODS ---
    { 
      id: 'h1', 
      titulo: 'MURPH', 
      descripcion: '1 Mile Run\n100 Pull-ups\n200 Push-ups\n300 Air Squats\n1 Mile Run', 
      timerType: 'STOPWATCH', 
      timerValue: 0, 
      inputSchema: 'tiempo', 
      category: 'HERO' 
    },
    { 
      id: 'h2', 
      titulo: 'DT', 
      descripcion: '5 Rounds for Time:\n12 Deadlifts (155/105 lb)\n9 Hang Power Cleans (155/105 lb)\n6 Push Jerks (155/105 lb)', 
      timerType: 'STOPWATCH', 
      timerValue: 0, 
      inputSchema: 'tiempo', 
      category: 'HERO' 
    },
    { 
      id: 'h3', 
      titulo: 'WOD BULL', 
      descripcion: '2 Rounds:\n200 Double-Unders\n50 Overhead Squats (135/95 lb)\n50 Pull-ups\n1 Mile Run', 
      timerType: 'STOPWATCH', 
      timerValue: 0, 
      inputSchema: 'tiempo', 
      category: 'HERO' 
    },

    // --- CATEGORÍA: GIRL WODS ---
    { 
      id: 'g1', 
      titulo: 'FRAN', 
      descripcion: '21-15-9\nThrusters (95/65 lb)\nPull-ups', 
      timerType: 'STOPWATCH', 
      timerValue: 0, 
      inputSchema: 'tiempo', 
      category: 'GIRL' 
    },
    { 
      id: 'g2', 
      titulo: 'CINDY', 
      descripcion: 'AMRAP 20\n5 Pull-ups\n10 Push-ups\n15 Air Squats', 
      timerType: 'COUNTDOWN', 
      timerValue: 1200, 
      inputSchema: 'rondas,reps', 
      category: 'GIRL' 
    },
    { 
      id: 'g3', 
      titulo: 'GRACE', 
      descripcion: '30 Clean-and-Jerks for Time (135/95 lb)', 
      timerType: 'STOPWATCH', 
      timerValue: 0, 
      inputSchema: 'tiempo', 
      category: 'GIRL' 
    },
    { 
      id: 'g4', 
      titulo: 'GWEN', 
      descripcion: 'Clean-and-Jerk 15-12-9 reps\nUnbroken. Rest as needed between sets.', 
      timerType: 'STOPWATCH', 
      timerValue: 0, 
      inputSchema: 'peso', 
      category: 'GIRL' 
    }
  ];

  return NextResponse.json(templates);
}
