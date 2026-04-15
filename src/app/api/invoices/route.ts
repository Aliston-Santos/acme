import {NextRequest, NextResponse} from 'next/server';
import {InvoiceController} from '@/controllers/InvoiceController';

export async function GET (request: NextRequest) {
	const {searchParams} = request.nextUrl;

	const result = await InvoiceController.getAll(searchParams);

	return NextResponse.json(result.body, {status: result.status})
};


export async function POST (request: NextRequest) {
		const body = await request.json();
	const result = await InvoiceController.create(body);

	return NextResponse.json(result.body, {status: result.status})
}