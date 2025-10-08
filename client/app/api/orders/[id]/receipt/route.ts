import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;

    // For now, return a message that PDF generation should be done client-side
    // Or implement a server-side PDF library like puppeteer
    return NextResponse.json({
      message:
        "PDF generation is handled client-side. Use the download button in the order details page.",
      orderId,
    });
  } catch (error) {
    console.error("Error in PDF route:", error);
    return NextResponse.json(
      { error: "Failed to process PDF request" },
      { status: 500 }
    );
  }
}
