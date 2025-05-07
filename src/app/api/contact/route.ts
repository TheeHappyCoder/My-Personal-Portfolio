// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    // Add a new document in 'contacts' collection
    await addDoc(collection(db, "contacts"), {
      name,
      email,
      message,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save contact:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save message." },
      { status: 500 }
    );
  }
}
