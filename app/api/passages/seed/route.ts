import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Passage from "@/models/Passage";

const defaultPassages = [
  {
    title: "The Great Gatsby - Opening",
    content: "In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since. Whenever you feel like criticizing any one, he told me, just remember that all the people in this world haven't had the advantages that you've had.",
    category: "books",
    difficulty: "medium",
  },
  {
    title: "To Kill a Mockingbird",
    content: "Atticus said to Jem one day, I'd rather you shot at tin cans in the backyard, but I know you'll go after birds. Shoot all the blue jays you want, if you can hit 'em, but remember it's a sin to kill a mockingbird.",
    category: "books",
    difficulty: "medium",
  },
  {
    title: "The Road Not Taken",
    content: "Two roads diverged in a yellow wood, And sorry I could not travel both And be one traveler, long I stood And looked down one as far as I could To where it bent in the undergrowth.",
    category: "poems",
    difficulty: "easy",
  },
  {
    title: "If - Rudyard Kipling",
    content: "If you can keep your head when all about you Are losing theirs and blaming it on you, If you can trust yourself when all men doubt you, But make allowance for their doubting too.",
    category: "poems",
    difficulty: "medium",
  },
  {
    title: "Steve Jobs Quote",
    content: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work. And the only way to do great work is to love what you do.",
    category: "quotes",
    difficulty: "easy",
  },
  {
    title: "Python Hello World",
    content: "def greet(name): return f'Hello, {name}!' if __name__ == '__main__': user = input('Enter your name: ') print(greet(user))",
    category: "code",
    difficulty: "easy",
  },
  {
    title: "JavaScript Async",
    content: "async function fetchData(url) { try { const response = await fetch(url); const data = await response.json(); return data; } catch (error) { console.error('Error:', error); throw error; } }",
    category: "code",
    difficulty: "hard",
  },
  {
    title: "The Big Bang",
    content: "The Big Bang theory is the prevailing cosmological model for the universe from the earliest known periods through its present expansion and cooling. It is based on the fact that the universe is expanding and other observations.",
    category: "science",
    difficulty: "medium",
  },
  {
    title: "World War II Overview",
    content: "World War II was a global war that lasted from 1939 to 1945. It involved the vast majority of the world's countries, including all of the great powers, forming two opposing military alliances: the Allies and the Axis.",
    category: "history",
    difficulty: "easy",
  },
  {
    title: "Artificial Intelligence",
    content: "Artificial intelligence is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction.",
    category: "technology",
    difficulty: "medium",
  },
  {
    title: "The Godfather",
    content: "I'm gonna make him an offer he can't refuse. The Godfather is a 1972 American crime film directed by Francis Ford Coppola, who co-wrote the screenplay with Mario Puzo, based on Puzo's best-selling novel.",
    category: "movies",
    difficulty: "medium",
  },
  {
    title: "Basketball Origins",
    content: "Basketball was invented in 1891 by James Naismith, a Canadian physical education instructor, in Springfield, Massachusetts. The game was originally played with a soccer ball and two peach baskets.",
    category: "sports",
    difficulty: "easy",
  },
];

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Check if passages already exist
    const existingCount = await Passage.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json({ 
        message: "Passages already seeded",
        count: existingCount 
      });
    }

    const result = await Passage.insertMany(defaultPassages);

    return NextResponse.json({
      success: true,
      message: `Seeded ${result.length} passages`,
      count: result.length,
    });

  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed passages" }, { status: 500 });
  }
}
