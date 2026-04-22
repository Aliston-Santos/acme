import { NextResponse } from "next/server";
import { getDashboardMetrics } from "@/services/DashboardService";

export async function GET () {
	const metrics = await getDashboardMetrics();

	return NextResponse.json(metrics, {status:200})
}