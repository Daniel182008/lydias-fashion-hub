import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();

  const product = await prisma.product.create({
    data: {
      name: body.name,
      price: Number(body.price),
      category: body.category,
      image: body.image || null,
      description: body.description || null,
    },
  });

  return NextResponse.json(product);
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const product = await prisma.product.update({
      where: {
        id: Number(body.id),
      },
      data: {
        name: body.name,
        price: Number(body.price),
        category: body.category,
        description: body.description || null,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Product update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    await prisma.product.delete({
      where: {
        id: Number(body.id),
      },
    });

    return NextResponse.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Product deletion failed" },
      { status: 500 }
    );
  }
}