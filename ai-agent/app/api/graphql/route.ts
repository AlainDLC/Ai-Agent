import { serverClient } from "@/lib/server/serverClient";
import { gql } from "@apollo/client";
import { NextResponse } from "next/server";

const corsHeader = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(request: Request) {
  const body = await request.json();
  const { query, variables } = body;

  try {
    let result;

    if (query.trim().startsWith("mutation")) {
      result = await serverClient.mutate({
        mutation: gql`
          ${query}
        `,
        variables,
      });
    } else {
      result = await serverClient.query({
        query: gql`
          ${query}
        `,
        variables,
      });
    }

    const data = result?.data;

    return NextResponse.json(
      {
        data,
      },
      {
        headers: corsHeader,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
